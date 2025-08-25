import React, { useRef, useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const validateImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      return false;
    }
    
    if (file.size > maxSize) {
      setUploadStatus('error');
      return false;
    }
    
    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateImage(file)) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageUpload(result);
      setFileName(file.name);
      setUploadStatus('success');
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const openFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <Upload className="w-5 h-5" />
        <span>Upload Image</span>
      </h2>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-blue-400 bg-blue-500/10'
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-500/10'
            : uploadStatus === 'error'
            ? 'border-red-400 bg-red-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={openFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-4">
          {uploadStatus === 'success' ? (
            <div className="text-green-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" />
              <p className="font-medium">Image uploaded successfully</p>
              <p className="text-sm text-gray-400">{fileName}</p>
            </div>
          ) : uploadStatus === 'error' ? (
            <div className="text-red-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
              <p className="font-medium">Upload failed</p>
              <p className="text-sm text-gray-400">Please check file format and size</p>
            </div>
          ) : (
            <div className="text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3" />
              <p className="font-medium">Drop your image here or click to upload</p>
              <p className="text-sm">Supports JPEG, PNG, WebP up to 10MB</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-700/50 rounded p-3">
          <p className="text-gray-300 font-medium">Supported Formats</p>
          <p className="text-gray-400">JPEG, PNG, WebP</p>
        </div>
        <div className="bg-gray-700/50 rounded p-3">
          <p className="text-gray-300 font-medium">Max File Size</p>
          <p className="text-gray-400">10MB</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;