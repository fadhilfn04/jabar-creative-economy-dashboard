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

import type { MapRegionData } from "@/lib/map-data-service"

interface InteractiveMapProps {
  regionData: MapRegionData[]
}

// Coordinates for major cities in West Java
const cityCoordinates: Record<string, [number, number]> = {
  'Bandung': [-6.9175, 107.6191],
  'Bekasi': [-6.2383, 106.9756],
  'Bogor': [-6.5971, 106.8060],
  'Depok': [-6.4025, 106.7942],
  'Cimahi': [-6.8721, 107.5420],
  'Sukabumi': [-6.9278, 106.9271],
  'Tasikmalaya': [-7.3506, 108.2172],
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

    // Create custom icon function based on company count
    const createCustomIcon = (companies: number, color: string) => {
      const size = Math.max(20, Math.min(40, companies / 20))
      const colorMap: Record<string, string> = {
        'bg-blue-500': '#3b82f6',
        'bg-green-500': '#10b981',
        'bg-purple-500': '#8b5cf6',
        'bg-orange-500': '#f97316',
        'bg-red-500': '#ef4444',
        'bg-indigo-500': '#6366f1',
        'bg-pink-500': '#ec4899',
      }

      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${colorMap[color] || '#3b82f6'};
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size > 30 ? '12px' : '10px'};
          ">
            ${companies > 999 ? '999+' : companies}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      })
    }

    // Add markers for each region
    regionData.forEach((region) => {
      const coordinates = cityCoordinates[region.name]
      if (coordinates) {
        const marker = L.marker(coordinates, {
          icon: createCustomIcon(region.companies, region.color)
        }).addTo(map)

        // Add popup with region information
        marker.bindPopup(`
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
        marker.on('mouseover', function() {
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