
import React, { useState } from 'react';
import ColorPickerCanvas from './components/ColorPickerCanvas';
import { ColorData, ColorHarmonies } from './types';
import { calculateHarmonies } from './utils/colorUtils';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
  const [history, setHistory] = useState<ColorData[]>([]);
  const [harmonies, setHarmonies] = useState<ColorHarmonies | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setSelectedColor(null);
        setHarmonies(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorPicked = (color: ColorData) => {
    setSelectedColor(color);
    setHistory(prev => [color, ...prev.slice(0, 9)]);
    setHarmonies(calculateHarmonies(color.hsv));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-indigo-200 shadow-lg">
              V
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">Vivid HSV</h1>
              <p className="text-xs text-slate-500 font-medium">Pro Color Extraction Tool</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer font-medium transition-all shadow-md active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Import Image
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Image Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <ColorPickerCanvas imageSrc={imageSrc} onColorPicked={handleColorPicked} />
          </div>
        </div>

        {/* Right Column: Tools & History */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Color Info */}
          {selectedColor ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div 
                className="h-32 w-full flex items-end p-6 relative transition-colors duration-300" 
                style={{ backgroundColor: selectedColor.hex }}
              >
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-bold border border-white/20">
                  {`hsv(${selectedColor.hsv.h}, ${selectedColor.hsv.s}%, ${selectedColor.hsv.v}%)`}
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">HSV Output</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center group relative cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => copyToClipboard(selectedColor.hsv.h.toString())}>
                        <span className="text-xs text-slate-500 font-bold mb-1">Hue</span>
                        <span className="text-xl font-bold text-slate-800">{selectedColor.hsv.h}°</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center group relative cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => copyToClipboard(selectedColor.hsv.s.toString())}>
                        <span className="text-xs text-slate-500 font-bold mb-1">Sat</span>
                        <span className="text-xl font-bold text-slate-800">{selectedColor.hsv.s}%</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center group relative cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => copyToClipboard(selectedColor.hsv.v.toString())}>
                        <span className="text-xs text-slate-500 font-bold mb-1">Val</span>
                        <span className="text-xl font-bold text-slate-800">{selectedColor.hsv.v}%</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`hsv(${selectedColor.hsv.h}, ${selectedColor.hsv.s}%, ${selectedColor.hsv.v}%)`)}
                    className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Copy HSV String
                  </button>
                </div>

                {harmonies && (
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Color Harmonies</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Complementary</span>
                        <div 
                          className="w-8 h-8 rounded-md border border-slate-100 cursor-pointer hover:scale-110 transition-transform" 
                          style={{ backgroundColor: harmonies.complementary }}
                          onClick={() => copyToClipboard(harmonies.complementary)}
                          title={harmonies.complementary}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Split Comp.</span>
                        <div className="flex gap-2">
                          {harmonies.splitComplementary.map((c, i) => (
                            <div key={i} 
                              className="w-8 h-8 rounded-md border border-slate-100 cursor-pointer hover:scale-110 transition-transform" 
                              style={{ backgroundColor: c }}
                              onClick={() => copyToClipboard(c)}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Analogous</span>
                        <div className="flex gap-2">
                          {harmonies.analogous.map((c, i) => (
                            <div key={i} 
                              className="w-8 h-8 rounded-md border border-slate-100 cursor-pointer hover:scale-110 transition-transform" 
                              style={{ backgroundColor: c }}
                              onClick={() => copyToClipboard(c)}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">Triadic</span>
                        <div className="flex gap-2">
                          {harmonies.triadic.map((c, i) => (
                            <div key={i} 
                              className="w-8 h-8 rounded-md border border-slate-100 cursor-pointer hover:scale-110 transition-transform" 
                              style={{ backgroundColor: c }}
                              onClick={() => copyToClipboard(c)}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Pick a color</h3>
              <p className="text-sm text-slate-500">Click anywhere on the image to see HSV details and harmonies.</p>
            </div>
          )}

          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Picks</h3>
            {history.length > 0 ? (
              <div className="grid grid-cols-5 gap-3">
                {history.map((item, idx) => (
                  <button 
                    key={item.timestamp + idx}
                    onClick={() => handleColorPicked(item)}
                    className="aspect-square rounded-lg border border-slate-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-indigo-500 outline-none"
                    style={{ backgroundColor: item.hex }}
                    title={`HSV(${item.hsv.h}, ${item.hsv.s}, ${item.hsv.v})`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No colors picked yet</p>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">Built for high-precision color analysis</p>
          <div className="flex gap-6">
            <span className="text-xs font-bold text-slate-400">RGB TO HSV</span>
            <span className="text-xs font-bold text-slate-400">COLOR HARMONY</span>
            <span className="text-xs font-bold text-slate-400">PIXEL PRECISION</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-8">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default App;
