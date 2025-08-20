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

// More detailed polygon coordinates for West Java regions (choropleth style)
const westJavaRegions: Record<string, [number, number][]> = {
  'Bandung': [
    [-6.8500, 107.5500], [-6.8200, 107.6200], [-6.8800, 107.6800], 
    [-6.9200, 107.7200], [-6.9800, 107.6800], [-6.9800, 107.6200], 
    [-6.9500, 107.5800], [-6.9200, 107.5500], [-6.8800, 107.5200], [-6.8500, 107.5500]
  ],
  'Bekasi': [
    [-6.1800, 106.9200], [-6.1500, 106.9800], [-6.2000, 107.0500], 
    [-6.2500, 107.0800], [-6.2900, 107.0300], [-6.3200, 106.9800], 
    [-6.2800, 106.9200], [-6.2200, 106.8800], [-6.1800, 106.9200]
  ],
  'Bogor': [
    [-6.4500, 106.7000], [-6.4200, 106.7800], [-6.4800, 106.8500], 
    [-6.5500, 106.9000], [-6.6200, 106.8800], [-6.6500, 106.8200], 
    [-6.6200, 106.7500], [-6.5800, 106.7000], [-6.5200, 106.6800], [-6.4500, 106.7000]
  ],
  'Depok': [
    [-6.3500, 106.7400], [-6.3200, 106.7800], [-6.3600, 106.8200], 
    [-6.4000, 106.8500], [-6.4500, 106.8200], [-6.4200, 106.7800], 
    [-6.3800, 106.7400], [-6.3500, 106.7400]
  ],
  'Cimahi': [
    [-6.8200, 107.4900], [-6.8000, 107.5300], [-6.8400, 107.5700], 
    [-6.8800, 107.5900], [-6.9200, 107.5600], [-6.9000, 107.5200], 
    [-6.8600, 107.4900], [-6.8200, 107.4900]
  ],
  'Sukabumi': [
    [-6.8500, 106.8500], [-6.8200, 106.9200], [-6.8800, 106.9800], 
    [-6.9200, 107.0200], [-6.9800, 106.9800], [-6.9500, 106.9200], 
    [-6.9200, 106.8800], [-6.8800, 106.8500], [-6.8500, 106.8500]
  ],
  'Tasikmalaya': [
    [-7.2800, 108.1400], [-7.2500, 108.1800], [-7.2800, 108.2200], 
    [-7.3200, 108.2600], [-7.3600, 108.2800], [-7.4000, 108.2400], 
    [-7.3800, 108.2000], [-7.3400, 108.1600], [-7.3000, 108.1400], [-7.2800, 108.1400]
  ],
  // Additional regions for better coverage
  'Kabupaten Bandung': [
    [-6.7500, 107.4000], [-6.7000, 107.5000], [-6.7500, 107.6000], 
    [-6.8000, 107.7000], [-6.8500, 107.6500], [-6.8200, 107.5500], 
    [-6.7800, 107.4500], [-6.7500, 107.4000]
  ],
  'Kabupaten Bogor': [
    [-6.3000, 106.5000], [-6.2500, 106.6000], [-6.3000, 106.7000], 
    [-6.3500, 106.8000], [-6.4000, 106.7500], [-6.3800, 106.6500], 
    [-6.3400, 106.5500], [-6.3000, 106.5000]
  ],
  'Kabupaten Bekasi': [
    [-6.0500, 106.8000], [-6.0000, 106.9000], [-6.0500, 107.0000], 
    [-6.1000, 107.1000], [-6.1500, 107.0500], [-6.1200, 106.9500], 
    [-6.0800, 106.8500], [-6.0500, 106.8000]
  ],
  'Karawang': [
    [-6.2000, 107.2000], [-6.1500, 107.3000], [-6.2000, 107.4000], 
    [-6.2500, 107.4500], [-6.3000, 107.4000], [-6.2800, 107.3000], 
    [-6.2400, 107.2500], [-6.2000, 107.2000]
  ],
  'Subang': [
    [-6.4000, 107.7000], [-6.3500, 107.8000], [-6.4000, 107.9000], 
    [-6.4500, 107.9500], [-6.5000, 107.9000], [-6.4800, 107.8000], 
    [-6.4400, 107.7500], [-6.4000, 107.7000]
  ],
  'Purwakarta': [
    [-6.5000, 107.4000], [-6.4500, 107.5000], [-6.5000, 107.6000], 
    [-6.5500, 107.6500], [-6.6000, 107.6000], [-6.5800, 107.5000], 
    [-6.5400, 107.4500], [-6.5000, 107.4000]
  ],
  'Cirebon': [
    [-6.6500, 108.4000], [-6.6000, 108.5000], [-6.6500, 108.6000], 
    [-6.7000, 108.6500], [-6.7500, 108.6000], [-6.7200, 108.5000], 
    [-6.6800, 108.4500], [-6.6500, 108.4000]
  ]
}

const InteractiveMapProps: React.FC<InteractiveMapProps> = ({ regionData }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  // Function to get color based on company count (choropleth style)
  const getColor = (companies: number): string => {
    return companies > 800 ? '#0d47a1' :  // Dark blue
           companies > 600 ? '#1565c0' :  // Medium dark blue
           companies > 400 ? '#1976d2' :  // Medium blue
           companies > 300 ? '#1e88e5' :  // Light medium blue
           companies > 200 ? '#42a5f5' :  // Light blue
           companies > 100 ? '#64b5f6' :  // Very light blue
           companies > 50  ? '#90caf9' :  // Pale blue
                            '#bbdefb'    // Very pale blue
  }

  // Function to get style for each polygon
  const getPolygonStyle = (companies: number) => ({
    fillColor: getColor(companies),
    weight: 1,
    opacity: 0.8,
    color: '#ffffff',
    dashArray: '',
    fillOpacity: 0.7
  })

  // Function to highlight feature on hover
  const highlightFeature = (layer: L.Layer) => {
    if (layer instanceof L.Polygon) {
      layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9
      })
      layer.bringToFront()
    }
  }

  // Function to reset highlight
  const resetHighlight = (layer: L.Layer, originalStyle: any) => {
    if (layer instanceof L.Polygon) {
      layer.setStyle(originalStyle)
    }
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map centered on West Java
    const map = L.map(mapRef.current, {
      center: [-6.9175, 107.6191],
      zoom: 8,
      minZoom: 7,
      maxZoom: 12,
    })

    // Add OpenStreetMap tiles with a lighter style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    // Create a data map for easy lookup
    const dataMap = new Map(regionData.map(region => [region.name, region]))

    // Add polygons for each region
    Object.entries(westJavaRegions).forEach(([regionName, coordinates]) => {
      const regionInfo = dataMap.get(regionName)
      const companies = regionInfo?.companies || Math.floor(Math.random() * 500) + 50 // Fallback data
      const investment = regionInfo?.investment || `${(Math.random() * 5 + 0.5).toFixed(1)}T`
      const workers = regionInfo?.workers || Math.floor(Math.random() * 20000) + 5000

      const style = getPolygonStyle(companies)
      
      const polygon = L.polygon(coordinates, style).addTo(map)

      // Create popup content
      const popupContent = `
        <div class="p-3 min-w-[220px]">
          <h3 class="font-bold text-lg mb-3 text-gray-900 border-b pb-2">${regionName}</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Pelaku Ekonomi Kreatif:</span>
              <span class="font-semibold text-blue-600">${companies.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Investasi:</span>
              <span class="font-semibold text-green-600">Rp ${investment}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Tenaga Kerja:</span>
              <span class="font-semibold text-purple-600">${workers.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `

      polygon.bindPopup(popupContent)

      // Add event listeners
      polygon.on({
        mouseover: function() {
          highlightFeature(this)
          this.openPopup()
        },
        mouseout: function() {
          resetHighlight(this, style)
          this.closePopup()
        },
        click: function() {
          map.fitBounds(this.getBounds())
          this.openPopup()
        }
      })
    })

    // Add legend
    const legend = L.control({ position: 'bottomright' })
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [0, 50, 100, 200, 300, 400, 600, 800]
      const labels = []

      div.innerHTML = '<h4 style="margin: 0 0 8px 0; font-weight: bold;">Jumlah Pelaku<br/>Ekonomi Kreatif</h4>'

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i]
        const to = grades[i + 1]
        
        labels.push(
          '<i style="background:' + getColor(from + 1) + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px; opacity: 0.7;"></i> ' +
          from + (to ? '&ndash;' + to : '+')
        )
      }
      
      div.innerHTML += labels.join('<br/>')
      return div
    }
    legend.addTo(map)

    // Add custom CSS for legend
    const style = document.createElement('style')
    style.textContent = `
      .legend {
        background: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 15px rgba(0,0,0,0.2);
        line-height: 18px;
        color: #555;
        font-size: 12px;
      }
      .legend i {
        border: 1px solid #ccc;
      }
    `
    document.head.appendChild(style)

    mapInstanceRef.current = map

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [regionData])

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
      />
    </div>
  )
}

export default InteractiveMapProps