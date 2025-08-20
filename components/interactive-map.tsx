import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface RegionData {
  name: string
  companies: number
  investment: string
  workers: number
  color: string
}

interface InteractiveMapProps {
  regionData: RegionData[]
}

// Polygon coordinates for major cities/regions in West Java
const cityPolygons: Record<string, [number, number][]> = {
  'Bandung': [
    [-6.8500, 107.5500],
    [-6.8500, 107.6800],
    [-6.9800, 107.6800],
    [-6.9800, 107.5500],
    [-6.8500, 107.5500]
  ],
  'Bekasi': [
    [-6.1800, 106.9200],
    [-6.1800, 107.0300],
    [-6.2900, 107.0300],
    [-6.2900, 106.9200],
    [-6.1800, 106.9200]
  ],
  'Bogor': [
    [-6.5400, 106.7500],
    [-6.5400, 106.8600],
    [-6.6500, 106.8600],
    [-6.6500, 106.7500],
    [-6.5400, 106.7500]
  ],
  'Depok': [
    [-6.3500, 106.7400],
    [-6.3500, 106.8500],
    [-6.4500, 106.8500],
    [-6.4500, 106.7400],
    [-6.3500, 106.7400]
  ],
  'Cimahi': [
    [-6.8200, 107.4900],
    [-6.8200, 107.5900],
    [-6.9200, 107.5900],
    [-6.9200, 107.4900],
    [-6.8200, 107.4900]
  ],
  'Sukabumi': [
    [-6.8800, 106.8700],
    [-6.8800, 106.9800],
    [-6.9800, 106.9800],
    [-6.9800, 106.8700],
    [-6.8800, 106.8700]
  ],
  'Tasikmalaya': [
    [-7.3000, 108.1600],
    [-7.3000, 108.2700],
    [-7.4000, 108.2700],
    [-7.4000, 108.1600],
    [-7.3000, 108.1600]
  ],
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regionData }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on West Java
    const map = L.map(mapRef.current, {
      center: [-6.9175, 107.6191],
      zoom: 8,
      minZoom: 8,
      maxZoom: 12,
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    // Color mapping for polygons
    const colorMap: Record<string, string> = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-purple-500': '#8b5cf6',
      'bg-orange-500': '#f97316',
      'bg-red-500': '#ef4444',
      'bg-indigo-500': '#6366f1',
      'bg-pink-500': '#ec4899',
    }

    // Add polygons for each region
    regionData.forEach((region) => {
      const polygonCoords = cityPolygons[region.name]
      if (polygonCoords) {
        // Calculate opacity based on company count (more companies = more opaque)
        const opacity = Math.max(0.3, Math.min(0.8, region.companies / 1000))
        const fillOpacity = Math.max(0.4, Math.min(0.7, region.companies / 1000))
        
        const polygon = L.polygon(polygonCoords, {
          color: colorMap[region.color] || '#3b82f6',
          weight: 2,
          opacity: opacity,
          fillColor: colorMap[region.color] || '#3b82f6',
          fillOpacity: fillOpacity,
        }).addTo(map)

        // Add popup with region information
        polygon.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2 text-gray-900">${region.name}</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Pelaku Ekonomi Kreatif:</span>
                <span class="font-medium">${region.companies}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Investasi:</span>
                <span class="font-medium">${region.investment}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tenaga Kerja:</span>
                <span class="font-medium">${region.workers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        `)

        // Add hover effects
        polygon.on('mouseover', function() {
          this.setStyle({
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
          })
          this.openPopup()
        })
        
        polygon.on('mouseout', function() {
          this.setStyle({
            weight: 2,
            opacity: opacity,
            fillOpacity: fillOpacity
          })
          this.closePopup()
        })
        
        // Add click event for permanent popup
        polygon.on('click', function() {
          this.openPopup()
        })
      }
    })

    mapInstanceRef.current = map

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [regionData])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
    />
  )
}

export default InteractiveMap