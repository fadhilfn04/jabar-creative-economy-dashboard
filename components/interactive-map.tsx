import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen.css";
import "leaflet.fullscreen";

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

import type { MapRegionData } from "@/lib/map-data-service";

interface InteractiveMapProps {
  regionData: MapRegionData[];
}

// Coordinates for major cities in West Java
const cityCoordinates: Record<string, [number, number]> = {
  "Kota Bandung": [-6.9175, 107.6191],
  "Kota Bekasi": [-6.2383, 106.9756],
  "Kota Bogor": [-6.5971, 106.806],
  "Kota Depok": [-6.4025, 106.7942],
  "Kota Cimahi": [-6.8721, 107.542],
  "Kota Sukabumi": [-6.9278, 106.9271],
  "Kota Tasikmalaya": [-7.3506, 108.2172],
  "Kota Cirebon": [-6.7063, 108.557],
  "Kota Banjar": [-7.3721, 108.5389],
  "Kabupaten Bekasi": [-6.2649, 107.1281],
  "Kabupaten Karawang": [-6.3067, 107.3032],
  "Kabupaten Bogor": [-6.5944, 106.7892],
  "Kabupaten Bandung": [-7.0051, 107.5619],
  "Kabupaten Majalengka": [-6.8364, 108.2274],
  "Kabupaten Garut": [-7.2134, 107.9067],
  "Kabupaten Purwakarta": [-6.5569, 107.4431],
  "Kabupaten Subang": [-6.5693, 107.7607],
  "Kabupaten Sukabumi": [-6.9278, 106.9271],
  "Kabupaten Sumedang": [-6.8595, 107.9239],
  "Kabupaten Indramayu": [-6.3274, 108.3199],
  "Kabupaten Cirebon": [-6.7767, 108.4815],
  "Kabupaten Bandung Barat": [-6.8186, 107.4817],
  "Kabupaten Cianjur": [-6.8174, 107.1425],
  "Kabupaten Kuningan": [-6.9759, 108.4837],
  "Kabupaten Tasikmalaya": [-7.3274, 108.2207],
  "Kabupaten Ciamis": [-7.3274, 108.3534],
  "Kabupaten Pangandaran": [-7.684, 108.65],
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regionData }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with fullscreen control
    const map = L.map(mapRef.current, {
      center: [-6.9175, 107.6191],
      zoom: 8,
      minZoom: 8,
      maxZoom: 15,
      fullscreenControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );

    // Create custom icon function based on company count
    const createCustomIcon = (companies: number, color: string) => {
      const size = Math.max(20, Math.min(40, companies / 20));
      const colorMap: Record<string, string> = {
        "bg-blue-500": "#3b82f6",
        "bg-green-500": "#10b981",
        "bg-purple-500": "#8b5cf6",
        "bg-orange-500": "#f97316",
        "bg-red-500": "#ef4444",
        "bg-indigo-500": "#6366f1",
        "bg-pink-500": "#ec4899",
      };

      return L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${colorMap[color] || "#3b82f6"};
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
            font-size: ${size > 30 ? "12px" : "10px"};
          ">
            ${companies}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    // Add markers for each region
    regionData.forEach((region) => {
      const coordinates = cityCoordinates[region.name];
      if (coordinates) {
        const marker = L.marker(coordinates, {
          icon: createCustomIcon(region.companies, region.color),
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg mb-2 text-gray-900">${region.name}</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Proyek:</span>
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
        `);

        marker.on("mouseover", function () {
          this.openPopup();
        });
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [regionData]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default InteractiveMap;
