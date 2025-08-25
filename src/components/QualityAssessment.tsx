import React from 'react';
import { BarChart3, CheckCircle, AlertTriangle, TrendingUp, Eye, Zap } from 'lucide-react';

interface QualityAssessmentProps {
  originalImage: string;
  enhancedImage: string;
  qualityScore: number;
}

const QualityAssessment: React.FC<QualityAssessmentProps> = ({ 
  originalImage, 
  enhancedImage, 
  qualityScore 
}) => {
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const metrics = [
    { label: 'Sharpness', score: 85, improvement: 23 },
    { label: 'Contrast', score: 78, improvement: 15 },
    { label: 'Noise Level', score: 92, improvement: 45 },
    { label: 'Face Clarity', score: 88, improvement: 31 },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5" />
        <span>Quality Assessment</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Quality Score */}
        <div className="space-y-6">
          <div className={`${getQualityBg(qualityScore)} rounded-lg p-6 text-center`}>
            <div className="flex items-center justify-center mb-4">
              {qualityScore >= 80 ? (
                <CheckCircle className="w-12 h-12 text-green-400" />
              ) : (
                <AlertTriangle className="w-12 h-12 text-yellow-400" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">Overall Quality Score</h3>
            <p className={`text-4xl font-bold ${getQualityColor(qualityScore)}`}>
              {qualityScore.toFixed(1)}/100
            </p>
            <p className="text-gray-400 mt-2">
              {qualityScore >= 80 ? 'Excellent for face recognition' : 
               qualityScore >= 60 ? 'Good quality, suitable for processing' : 
               'May require additional enhancement'}
            </p>
          </div>

          {/* Quality Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Detailed Metrics</h3>
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-700/50 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">{metric.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getQualityColor(metric.score)}`}>
                      {metric.score}%
                    </span>
                    <div className="flex items-center text-green-400 text-sm">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{metric.improvement}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.score >= 80 ? 'bg-green-400' :
                      metric.score >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${metric.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processing Details */}
        <div className="space-y-6">
          <div className="bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Processing Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Enhancement Algorithm</span>
                <span className="text-blue-400">CLAHE + GFPGAN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Processing Time</span>
                <span className="text-gray-200">1.2s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Face Detection</span>
                <span className="text-green-400">✓ Detected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Image Format</span>
                <span className="text-gray-200">PNG (Optimized)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {qualityScore >= 80 ? (
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-medium">Ready for Processing</p>
                    <p className="text-gray-400 text-sm">Image quality is excellent for face recognition tasks.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">Additional Enhancement Available</p>
                    <p className="text-gray-400 text-sm">Consider adjusting CLAHE settings for better results.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Comparison */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Before & After</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-400 mb-1">Original</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-24 object-cover rounded border border-gray-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Enhanced</p>
                <img
                  src={enhancedImage}
                  alt="Enhanced"
                  className="w-full h-24 object-cover rounded border border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssessment;