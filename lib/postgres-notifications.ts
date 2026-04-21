import { Pool } from 'pg'

// PostgreSQL LISTEN/NOTIFY notification system
export class PostgresNotificationService {
  private pool: Pool
  private listeners: Map<string, Set<(payload: string) => void>> = new Map()
  private notificationClient: any = null

  constructor(pool: Pool) {
    this.pool = pool
  }

  // Subscribe to PostgreSQL notifications
  async subscribe(channel: string, callback: (payload: string) => void): Promise<void> {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set())
      await this.listenToChannel(channel)
    }

    this.listeners.get(channel)!.add(callback)
  }

  // Unsubscribe from notifications
  unsubscribe(channel: string, callback: (payload: string) => void): void {
    const channelListeners = this.listeners.get(channel)
    if (channelListeners) {
      channelListeners.delete(callback)

      // If no more listeners for this channel, clean up
      if (channelListeners.size === 0) {
        this.listeners.delete(channel)
        this.unlistenFromChannel(channel)
      }
    }
  }

  // Set up the LISTEN connection for a channel
  private async listenToChannel(channel: string): Promise<void> {
    if (!this.notificationClient) {
      await this.setupNotificationClient()
    }

    try {
      await this.notificationClient.query(`LISTEN ${channel}`)
      console.log(`Listening to PostgreSQL channel: ${channel}`)
    } catch (error) {
      console.error(`Failed to listen to channel ${channel}:`, error)
      throw error
    }
  }

  // Stop listening to a channel
  private async unlistenFromChannel(channel: string): Promise<void> {
    if (this.notificationClient) {
      try {
        await this.notificationClient.query(`UNLISTEN ${channel}`)
        console.log(`Stopped listening to PostgreSQL channel: ${channel}`)
      } catch (error) {
        console.error(`Failed to unlisten from channel ${channel}:`, error)
      }
    }
  }

  // Set up the dedicated notification client
  private async setupNotificationClient(): Promise<void> {
    try {
      // Create a dedicated client for notifications
      this.notificationClient = new Pool({
        host: this.pool.options.host,
        port: this.pool.options.port,
        database: this.pool.options.database,
        user: this.pool.options.user,
        password: this.pool.options.password,
        max: 1, // Only one connection needed for notifications
      })

      const client = await this.notificationClient.connect()

      // Set up notification handler
      client.on('notification', (msg: any) => {
        const { channel, payload } = msg
        const channelListeners = this.listeners.get(channel)

        if (channelListeners) {
          channelListeners.forEach(callback => {
            try {
              callback(payload || '')
            } catch (error) {
              console.error(`Error in notification callback for channel ${channel}:`, error)
            }
          })
        }
      })

      // Keep the connection alive
      client.on('error', (err: any) => {
        console.error('Notification client error:', err)
        this.handleNotificationClientError()
      })

      client.on('end', () => {
        console.warn('Notification client connection ended')
        this.handleNotificationClientError()
      })

      console.log('PostgreSQL notification client set up successfully')
    } catch (error) {
      console.error('Failed to set up notification client:', error)
      throw error
    }
  }

  // Handle notification client errors
  private handleNotificationClientError(): void {
    this.notificationClient = null

    // Attempt to reconnect after a delay
    setTimeout(() => {
      console.log('Attempting to reconnect notification client...')
      this.setupNotificationClient().catch(err => {
        console.error('Failed to reconnect notification client:', err)
      })
    }, 5000)
  }

  // Clean up all notification subscriptions
  async cleanup(): Promise<void> {
    if (this.notificationClient) {
      try {
        await this.notificationClient.end()
        console.log('Notification client cleaned up')
      } catch (error) {
        console.error('Error cleaning up notification client:', error)
      }
    }

    this.listeners.clear()
  }
}

// Fallback polling service for environments where LISTEN/NOTIFY doesn't work
export class PostgresPollingService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private lastCheckedValues: Map<string, any> = new Map()

  // Start polling for changes
  startPolling(
    key: string,
    checkFunction: () => Promise<any>,
    callback: () => void,
    interval: number = 30000 // Default 30 seconds
  ): void {
    if (this.intervals.has(key)) {
      this.stopPolling(key)
    }

    const intervalId = setInterval(async () => {
      try {
        const currentValue = await checkFunction()

        // Check if value has changed
        const lastValue = this.lastCheckedValues.get(key)
        if (JSON.stringify(currentValue) !== JSON.stringify(lastValue)) {
          this.lastCheckedValues.set(key, currentValue)
          callback()
        }
      } catch (error) {
        console.error(`Polling error for ${key}:`, error)
      }
    }, interval)

    this.intervals.set(key, intervalId)
  }

  // Stop polling for changes
  stopPolling(key: string): void {
    const intervalId = this.intervals.get(key)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(key)
      this.lastCheckedValues.delete(key)
    }
  }

  // Clean up all polling intervals
  cleanup(): void {
    this.intervals.forEach((intervalId, key) => {
      clearInterval(intervalId)
    })
    this.intervals.clear()
    this.lastCheckedValues.clear()
  }
}

// Factory function to create the appropriate notification service
export function createNotificationService(pool: Pool) {
  return new PostgresNotificationService(pool)
}

export function createPollingService() {
  return new PostgresPollingService()
}