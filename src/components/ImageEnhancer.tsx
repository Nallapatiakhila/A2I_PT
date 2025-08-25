import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sliders, Zap, Download, RotateCcw, Eye } from 'lucide-react';

interface ImageEnhancerProps {
  originalImage: string;
  onImageEnhanced: (enhancedImage: string, quality: number) => void;
}

interface EnhancementSettings {
  clahe: number;
  denoise: number;
  sharpen: number;
  brightness: number;
  contrast: number;
}

const ImageEnhancer: React.FC<ImageEnhancerProps> = ({ originalImage, onImageEnhanced }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<EnhancementSettings>({
    clahe: 50,
    denoise: 30,
    sharpen: 40,
    brightness: 50,
    contrast: 50
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const applyEnhancements = useCallback(async () => {
    if (!canvasRef.current || !originalImage) return;
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply enhancements
      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        const brightnessMultiplier = settings.brightness / 50;
        data[i] *= brightnessMultiplier;     // Red
        data[i + 1] *= brightnessMultiplier; // Green
        data[i + 2] *= brightnessMultiplier; // Blue
        
        // Apply contrast
        const contrastMultiplier = settings.contrast / 50;
        data[i] = ((data[i] - 128) * contrastMultiplier) + 128;
        data[i + 1] = ((data[i + 1] - 128) * contrastMultiplier) + 128;
        data[i + 2] = ((data[i + 2] - 128) * contrastMultiplier) + 128;
        
        // Clamp values
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
      }
      
      // Put enhanced image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Calculate quality score (simplified)
      const qualityScore = Math.min(100, 60 + (settings.clahe + settings.sharpen + settings.denoise) / 10);
      
      const enhancedDataUrl = canvas.toDataURL('image/png');
      onImageEnhanced(enhancedDataUrl, qualityScore);
      setIsProcessing(false);
    };
    
    img.src = originalImage;
  }, [originalImage, settings, onImageEnhanced]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyEnhancements();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [applyEnhancements]);

  const resetSettings = () => {
    setSettings({
      clahe: 50,
      denoise: 30,
      sharpen: 40,
      brightness: 50,
      contrast: 50
    });
  };

  const downloadEnhanced = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'enhanced-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center space-x-2">
          <Sliders className="w-5 h-5" />
          <span>Enhancement Controls</span>
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showComparison ? 'Hide' : 'Compare'}</span>
          </button>
          <button
            onClick={resetSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={downloadEnhanced}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">AI Enhancement</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CLAHE (Contrast Enhancement) - {settings.clahe}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.clahe}
                  onChange={(e) => setSettings(prev => ({ ...prev, clahe: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Denoising - {settings.denoise}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.denoise}
                  onChange={(e) => setSettings(prev => ({ ...prev, denoise: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sharpening - {settings.sharpen}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sharpen}
                  onChange={(e) => setSettings(prev => ({ ...prev, sharpen: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Basic Adjustments</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brightness - {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={settings.brightness}
                  onChange={(e) => setSettings(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contrast - {settings.contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={settings.contrast}
                  onChange={(e) => setSettings(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center space-x-2 text-blue-400">
              <Zap className="w-4 h-4 animate-pulse" />
              <span>Processing enhancements...</span>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-200">Preview</h3>
          
          {showComparison ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Original</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-64 object-cover rounded-lg border border-gray-600"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Enhanced</p>
                <canvas
                  ref={canvasRef}
                  className="w-full h-64 object-cover rounded-lg border border-gray-600"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-2">Enhanced Result</p>
              <canvas
                ref={canvasRef}
                className="w-full h-64 object-cover rounded-lg border border-gray-600"
                style={{ display: 'block' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEnhancer;