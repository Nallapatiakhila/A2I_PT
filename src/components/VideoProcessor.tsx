import React, { useState, useRef } from 'react';
import { Video, Play, Pause, SkipForward, Camera, Download, Eye } from 'lucide-react';

const VideoProcessor: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const extractFrames = () => {
    // Simulate frame extraction
    const mockFrames = [
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    setExtractedFrames(mockFrames);
  };

  const toggleFrameSelection = (index: number) => {
    setSelectedFrames(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-8">
      {/* Video Upload Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Video className="w-5 h-5" />
          <span>Video Processing</span>
        </h2>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400 mb-2">Upload video for multi-angle face capture</p>
          <p className="text-sm text-gray-500">Supports MP4, MOV, AVI up to 100MB</p>
          <button className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
            Select Video File
          </button>
        </div>
      </div>

      {/* Multi-Angle Capture Guide */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Multi-Angle Capture Guide</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
            </div>
            <h4 className="font-medium mb-2">Front View</h4>
            <p className="text-sm text-gray-400">Look directly at camera with neutral expression</p>
          </div>
          
          <div className="text-center">
            <div className="bg-teal-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-teal-400 rounded-full transform -rotate-12"></div>
            </div>
            <h4 className="font-medium mb-2">Left Profile</h4>
            <p className="text-sm text-gray-400">Turn head 45° to the left slowly</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-500/20 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-400 rounded-full transform rotate-12"></div>
            </div>
            <h4 className="font-medium mb-2">Right Profile</h4>
            <p className="text-sm text-gray-400">Turn head 45° to the right slowly</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-blue-400 text-sm">
            <strong>Tip:</strong> Maintain good lighting and keep movements slow and steady for best frame extraction results.
          </p>
        </div>
      </div>

      {/* Frame Extraction Results */}
      {extractedFrames.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <SkipForward className="w-5 h-5" />
              <span>Extracted Frames</span>
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={extractFrames}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Extract Frames</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Download Selected</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {extractedFrames.map((frame, index) => (
              <div
                key={index}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedFrames.includes(index)
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => toggleFrameSelection(index)}
              >
                <img
                  src={frame}
                  alt={`Frame ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs">
                  Frame {index + 1}
                </div>
                {selectedFrames.includes(index) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/70 rounded px-2 py-1 text-xs">
                    Quality: {85 + Math.random() * 10 | 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Selected {selectedFrames.length} of {extractedFrames.length} frames
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;