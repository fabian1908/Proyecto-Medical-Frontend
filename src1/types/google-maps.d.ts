// Types para Google Maps API
declare global {
  interface Window {
    google: typeof google;
    selectLocation: (locationId: number) => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      fitBounds(bounds: LatLngBounds): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      addListener(eventName: string, handler: () => void): void;
      setMap(map: Map | null): void;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
    }

    class LatLngBounds {
      constructor();
      extend(point: LatLng | LatLngLiteral): void;
    }

    class Size {
      constructor(width: number, height: number);
    }

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      styles?: MapTypeStyle[];
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }

    interface InfoWindowOptions {
      content?: string;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      url: string;
      scaledSize?: Size;
    }

    interface MapTypeStyle {
      featureType?: string;
      stylers?: Array<{ visibility?: string }>;
    }
  }
}

export {};
