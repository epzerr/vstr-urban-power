import { useCallback, useMemo, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

export type BoutiquePublic = {
  id: string;
  nom: string;
  quartier: string;
  adresse: string | null;
  latitude: number;
  longitude: number;
  active: boolean;
  offre_permanente: string | null;
  offre_unique: string | null;
};

const CENTER = { lat: 47.2155, lng: -1.5554 };

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#111111" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#111111" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c1c1c" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#151515" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] },
];

const pinIcon: google.maps.Symbol = {
  path: "M 0,-7 L 7,0 L 0,7 L -7,0 Z",
  fillColor: "#ffffff",
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1,
};

export default function BoutiquesMap({ shops }: { shops: BoutiquePublic[] }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded, loadError } = useJsApiLoader({
    id: "vstr-google-maps",
    googleMapsApiKey: apiKey ?? "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: "cooperative",
      styles: darkMapStyles,
      backgroundColor: "#000000",
    }),
    [],
  );

  const onMarkerClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const scrollToOffer = useCallback((id: string) => {
    document.getElementById(`boutique-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111111] text-xs tracking-[0.15em] text-foreground/50">
        Clé Google Maps manquante
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111111] text-xs tracking-[0.15em] text-foreground/50">
        Impossible de charger la carte
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="h-full w-full bg-[#111111]" />;
  }

  const selectedShop = shops.find((s) => s.id === selectedId);

  return (
    <GoogleMap
      mapContainerStyle={{ height: "100%", width: "100%" }}
      center={CENTER}
      zoom={15}
      options={options}
      onClick={() => setSelectedId(null)}
    >
      {shops.map((s) => (
        <Marker
          key={s.id}
          position={{ lat: Number(s.latitude), lng: Number(s.longitude) }}
          icon={pinIcon}
          title={s.nom}
          onClick={() => onMarkerClick(s.id)}
        />
      ))}
      {selectedShop && (
        <InfoWindow
          position={{
            lat: Number(selectedShop.latitude),
            lng: Number(selectedShop.longitude),
          }}
          onCloseClick={() => setSelectedId(null)}
          options={{ pixelOffset: new google.maps.Size(0, -12) }}
        >
          <div className="min-w-[160px] px-1 py-1 font-sans text-black">
            <p className="text-sm font-black uppercase tracking-wide">{selectedShop.nom}</p>
            <button
              type="button"
              onClick={() => scrollToOffer(selectedShop.id)}
              className="mt-3 w-full bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
            >
              Voir l&apos;offre
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
