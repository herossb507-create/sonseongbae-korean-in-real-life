"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { VenueGroup } from "@/lib/concerts/format";
import { type Region, inRegion } from "@/lib/concerts/regions";

interface Props {
  groups: VenueGroup[];
  selectedVenueId: string | null;
  onSelectVenue: (venueId: string) => void;
  region: Region;
}

const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

function markerIcon(count: number, selected: boolean, allInactive: boolean) {
  const size = count > 1 ? 34 : 28;
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

function FlyToSelected({ groups, selectedVenueId }: Pick<Props, "groups" | "selectedVenueId">) {
  const map = useMap();
  useEffect(() => {
    const g = groups.find((x) => x.venue.id === selectedVenueId);
    if (!g) return;
    // On desktop the detail panel covers the right side; on phones it's a sheet
    // over the page, so just centre the pin.
    const desktop = !isPhone();
    const point = L.latLng(g.venue.lat, g.venue.lng);
    map.flyToBounds(L.latLngBounds(point, point), {
      paddingBottomRight: desktop ? [400, 0] : [0, 0],
      maxZoom: Math.max(map.getZoom(), desktop ? 5 : 6),
      duration: 0.8,
    });
  }, [groups, selectedVenueId, map]);
  return null;
}

/** Frames the venues of the chosen region; on first render, phones start on Asia where most shows are. */
function FitRegion({ groups, region }: Pick<Props, "groups" | "region">) {
  const map = useMap();
  const first = useRef(true);
  useEffect(() => {
    if (groups.length === 0) return;
    const animate = !first.current;
    first.current = false;
    // The container may have been resized by the flex layout after Leaflet measured it.
    map.invalidateSize();
    const inView = groups.filter((g) => inRegion(g.venue, region));
    const points = (inView.length ? inView : groups).map((g) => [g.venue.lat, g.venue.lng] as [number, number]);
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 9, animate });
  }, [groups, region, map]);
  return null;
}

export default function ConcertMap({ groups, selectedVenueId, onSelectVenue, region }: Props) {
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
      center={[25, 110]}
      zoom={2}
      minZoom={1}
      zoomSnap={0.25}
      maxBounds={[[-85, -540], [85, 540]]}
      maxBoundsViscosity={1}
      worldCopyJump
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />
      <ZoomControl position="bottomright" />
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
      <FitRegion groups={groups} region={region} />
      <FlyToSelected groups={groups} selectedVenueId={selectedVenueId} />
    </MapContainer>
  );
}
