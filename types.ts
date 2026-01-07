
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface ColorData {
  hex: string;
  rgb: RGB;
  hsv: HSV;
  timestamp: number;
}

export interface ColorHarmonies {
  complementary: string;
  analogous: string[];
  triadic: string[];
  splitComplementary: string[];
}
