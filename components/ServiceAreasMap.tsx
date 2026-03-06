"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJsonObject, Feature } from "geojson";
import type { PageMeta } from "@/lib/content";
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from "@/lib/serviceAreaCoordinates";
import Link from "next/link";

/** FIPS county id -> service area slug for popup links */
const COUNTY_SLUG: Record<string, string> = {
  "49043": "summit-county-ut-painting",
  "49051": "wasatch-county-ut-painting",
};

const COUNTY_TITLE: Record<string, string> = {
  "49043": "Summit County",
  "49051": "Wasatch County",
};

type ServiceAreasMapProps = {
  areas: PageMeta[];
  className?: string;
};

/** Fit map to GeoJSON bounds when data loads */
function FitGeoBounds({ data }: { data: GeoJsonObject | null }) {
  const map = useMap();
  useEffect(() => {
    if (!data || data.type !== "FeatureCollection") return;
    const layer = L.geoJSON(data);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 11 });
    }
  }, [map, data]);
  return null;
}

export function ServiceAreasMap({ areas, className = "" }: ServiceAreasMapProps) {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    fetch("/service-area-counties.geojson")
      .then((r) => r.json())
      .then(setGeoData)
      .catch(() => setGeoData(null));
  }, []);

  const style = () => ({
    fillColor: "#0ea5e9",
    fillOpacity: 0.25,
    color: "#0284c7",
    weight: 2,
  });

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const id = feature.id != null ? String(feature.id) : "";
    const slug = COUNTY_SLUG[id];
    const title = COUNTY_TITLE[id] ?? feature.properties?.name ?? "Service area";
    if (slug) {
      layer.bindPopup(
        `<a href="/service-areas" class="font-medium text-sky-600 hover:underline">${title}</a>`
      );
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 ${className}`}
    >
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        className="h-[360px] w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitGeoBounds data={geoData} />
        {geoData && (
          <GeoJSON
            key="service-counties"
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}
