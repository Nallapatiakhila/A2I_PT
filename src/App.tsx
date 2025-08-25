import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Image as ImageIcon, Video, Settings, Zap } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ImageEnhancer from './components/ImageEnhancer';
import QualityAssessment from './components/QualityAssessment';
import VideoProcessor from './components/VideoProcessor';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('enhance');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [processingStats, setProcessingStats] = useState({
    totalProcessed: 0,
    successRate: 95.8,
    avgQualityImprovement: 34.2
  });

  const handleImageUpload = useCallback((imageData: string) => {
    setUploadedImage(imageData);
    setEnhancedImage(null);
    setQualityScore(null);
  }, []);

  const handleImageEnhanced = useCallback((enhancedData: string, quality: number) => {
    setEnhancedImage(enhancedData);
    setQualityScore(quality);
    setProcessingStats(prev => ({
      ...prev,
      totalProcessed: prev.totalProcessed + 1
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Image Enhancement & Preprocessing</h1>
              <p className="text-gray-400">Optimize image quality for face recognition systems</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Images Processed</p>
                    <p className="text-2xl font-bold text-blue-400">{processingStats.totalProcessed}</p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">{processingStats.successRate}%</p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Quality Boost</p>
                    <p className="text-2xl font-bold text-teal-400">+{processingStats.avgQualityImprovement}%</p>
                  </div>
                  <div className="bg-teal-500/20 p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-teal-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            {activeTab === 'enhance' && (
              <div className="space-y-8">
                <ImageUploader onImageUpload={handleImageUpload} />
                
                {uploadedImage && (
                  <>
                    <ImageEnhancer 
                      originalImage={uploadedImage} 
                      onImageEnhanced={handleImageEnhanced}
                    />
                    
                    {enhancedImage && qualityScore && (
                      <QualityAssessment 
                        originalImage={uploadedImage}
                        enhancedImage={enhancedImage}
                        qualityScore={qualityScore}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'video' && (
              <VideoProcessor />
            )}

            {activeTab === 'batch' && (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                    <Settings className="w-8 h-8 text-blue-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Batch Processing</h3>
                  <p className="text-gray-400">Process multiple images simultaneously with advanced queue management and progress tracking.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;