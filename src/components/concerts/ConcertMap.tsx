"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { VenueGroup } from "@/lib/concerts/format";

interface Props {
  groups: VenueGroup[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
}

function markerIcon(count: number, selected: boolean, allInactive: boolean) {
  const size = count > 1 ? 34 : 26;
  const cls = ["pin", selected && "pin--selected", allInactive && "pin--inactive"]
    .filter(Boolean)
    .join(" ");
  return L.divIcon({
    className: "",
    html: `<div class="${cls}" style="width:${size}px;height:${size}px">${count > 1 ? count : ""}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function FlyToSelected({ groups, selectedVenueId }: Omit<Props, "onSelectVenue">) {
  const map = useMap();
  useEffect(() => {
    const g = groups.find((x) => x.venue.id === selectedVenueId);
    if (!g) return;
    // Keep the pin clear of the detail panel: it covers the right side on desktop
    // and the bottom ~70% on phones.
    const { x: w, y: h } = map.getSize();
    const desktop = w >= 640;
    const point = L.latLng(g.venue.lat, g.venue.lng);
    map.flyToBounds(L.latLngBounds(point, point), {
      paddingBottomRight: desktop ? [400, 0] : [0, Math.round(h * 0.7)],
      maxZoom: Math.max(map.getZoom(), 5),
      duration: 0.8,
    });
  }, [groups, selectedVenueId, map]);
  return null;
}

// Frame all venues once on first render, so the initial view suits any screen size.
function FitOnMount({ groups }: { groups: VenueGroup[] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || groups.length === 0) return;
    fitted.current = true;
    // The container may have been resized by the flex layout after Leaflet measured it.
    map.invalidateSize();
    map.fitBounds(L.latLngBounds(groups.map((g) => [g.venue.lat, g.venue.lng])), { padding: [30, 30], animate: false });
    // On narrow screens the whole tour map can't fit; centre on where most shows are instead.
    if (map.getZoom() <= map.getMinZoom()) {
      const median = (xs: number[]) => xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)];
      map.setView([median(groups.map((g) => g.venue.lat)), median(groups.map((g) => g.venue.lng))], map.getZoom(), { animate: false });
    }
  }, [groups, map]);
  return null;
}

export default function ConcertMap({ groups, selectedVenueId, onSelectVenue }: Props) {
  const markers = useMemo(
    () =>
      groups.map((g) => ({
        g,
        icon: markerIcon(
          g.concerts.length,
          g.venue.id === selectedVenueId,
          g.concerts.every((c) => c.status === "cancelled"),
        ),
      })),
    [groups, selectedVenueId],
  );

  return (
    <MapContainer
      center={[25, 40]}
      zoom={2}
      minZoom={1.25}
      zoomSnap={0.25}
      maxBounds={[[-85, -200], [85, 200]]}
      worldCopyJump
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />
      {markers.map(({ g, icon }) => (
        <Marker
          key={g.venue.id}
          position={[g.venue.lat, g.venue.lng]}
          icon={icon}
          eventHandlers={{ click: () => onSelectVenue(g.venue.id) }}
        >
          <Tooltip direction="top" offset={[0, -14]}>
            <strong>{g.venue.city}</strong> · {g.venue.name}
            <br />
            {g.concerts.length} show{g.concerts.length > 1 ? "s" : ""}
          </Tooltip>
        </Marker>
      ))}
      <FitOnMount groups={groups} />
      <FlyToSelected groups={groups} selectedVenueId={selectedVenueId} />
    </MapContainer>
  );
}
