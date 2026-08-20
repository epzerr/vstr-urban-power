import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type Shop = {
  name: string;
  lat: number;
  lng: number;
};

const pin = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;background:#fff;transform:rotate(45deg);box-shadow:0 0 0 4px rgba(255,255,255,0.18)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function BoutiquesMap({ shops }: { shops: Shop[] }) {
  return (
    <MapContainer
      center={[47.2155, -1.5554]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#000" }}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png" />
      {shops.map((s) => (
        <Marker key={s.name} position={[s.lat, s.lng]} icon={pin}>
          <Tooltip
            direction="top"
            offset={[0, -10]}
            opacity={1}
            className="!border-0 !bg-black !px-2 !py-1 !text-[10px] !font-bold !tracking-[0.15em] !text-white !shadow-none"
          >
            {s.name.toUpperCase()}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
