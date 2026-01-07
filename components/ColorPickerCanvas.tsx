
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RGB, HSV, ColorData } from '../types';
import { rgbToHsv, rgbToHex } from '../utils/colorUtils';

interface ColorPickerCanvasProps {
  imageSrc: string | null;
  onColorPicked: (color: ColorData) => void;
}

const ColorPickerCanvas: React.FC<ColorPickerCanvasProps> = ({ imageSrc, onColorPicked }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverData, setHoverData] = useState<ColorData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Scale canvas to fit image while maintaining aspect ratio
      const maxWidth = canvas.parentElement?.clientWidth || 800;
      const scale = maxWidth / img.width;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getColorAtPosition = (x: number, y: number): ColorData | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const rgb: RGB = { r: imageData[0], g: imageData[1], b: imageData[2] };
    const hsv: HSV = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

    return { hex, rgb, hsv, timestamp: Date.now() };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    
    setMousePos({ x: e.clientX, y: e.clientY });

    const color = getColorAtPosition(x, y);
    if (color) {
      setHoverData(color);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const color = getColorAtPosition(x, y);
    if (color) {
      onColorPicked(color);
    }
  };

  if (!imageSrc) return (
    <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8">
      <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p className="text-slate-500 font-medium">Import an image to start picking colors</p>
    </div>
  );

  return (
    <div className="relative cursor-crosshair group">
      <canvas 
        ref={canvasRef} 
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoverData(null)}
        className="rounded-xl shadow-lg border border-slate-200 w-full"
      />
      {hoverData && (
        <div 
          className="pointer-events-none fixed z-50 px-3 py-1.5 bg-white shadow-xl border border-slate-100 rounded-lg text-xs font-bold flex items-center gap-2"
          style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}
        >
          <div className="w-4 h-4 rounded border border-slate-200" style={{ backgroundColor: hoverData.hex }} />
          hsv({hoverData.hsv.h}, {hoverData.hsv.s}%, {hoverData.hsv.v}%)
        </div>
      )}
    </div>
  );
};

export default ColorPickerCanvas;
