
import { RGB, HSV, ColorHarmonies } from '../types';

export const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100)
  };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const hsvToRgb = (h: number, s: number, v: number): RGB => {
  s = s / 100;
  v = v / 100;
  
  let r = 0, g = 0, b = 0;
  
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
};

export const hsvToHex = (h: number, s: number, v: number): string => {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
};

export const calculateHarmonies = (hsv: HSV): ColorHarmonies => {
  const { h, s, v } = hsv;
  
  const shiftHue = (degree: number) => (h + degree + 360) % 360;
  
  return {
    complementary: hsvToHex(shiftHue(180), s, v),
    analogous: [
      hsvToHex(shiftHue(-30), s, v),
      hsvToHex(shiftHue(30), s, v)
    ],
    triadic: [
      hsvToHex(shiftHue(120), s, v),
      hsvToHex(shiftHue(240), s, v)
    ],
    splitComplementary: [
      hsvToHex(shiftHue(150), s, v),
      hsvToHex(shiftHue(210), s, v)
    ]
  };
};
