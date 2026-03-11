export interface Blip {
  name: string;
  x: number;
  y: number;
  blip: string;
}

export interface MapConfig {
  minZoom: number;
  maxZoom: number;
  defaultZoom: number;
  center: [number, number];
}
