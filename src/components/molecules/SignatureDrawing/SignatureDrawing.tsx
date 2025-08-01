import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/atoms/Dialog/dialog';
import { Button } from '@/components/atoms/Button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * SignatureDrawing Component
 * 
 * A digital signature drawing tool that allows users to draw their signature
 * using mouse or touch input on a canvas element.
 * 
 * Features:
 * - Canvas-based drawing with smooth lines
 * - Clear signature functionality
 * - Save signature as base64 image data
 * - Responsive design for mobile and desktop
 * - Professional healthcare interface styling
 */

interface SignatureDrawingProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  title?: string;
  description?: string;
}

const SignatureDrawing: React.FC<SignatureDrawingProps> = ({
  isOpen,
  onClose,
  onSave,
  title = "Digital Signature",
  description = "Please draw your signature in the box below using your mouse or finger."
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas when dialog opens
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = 600;
        canvas.height = 200;
        
        // Set drawing styles
        ctx.strokeStyle = '#1f2937'; // Gray-800
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add border
        ctx.strokeStyle = '#d1d5db'; // Gray-300
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        // Reset drawing style
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
      }
    }
  }, [isOpen]);

  // Get mouse/touch position relative to canvas
  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  // Draw line
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const pos = getEventPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Reset drawing style
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    
    setHasSignature(false);
  };

  // Save signature
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    // Convert canvas to base64 image data
    const signatureData = canvas.toDataURL('image/png');
    onSave(signatureData);
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    clearSignature();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <DialogTitle className="flex items-center gap-3">
          <PencilIcon className="w-6 h-6 text-blue-600" />
          {title}
        </DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>

        {/* Signature Canvas */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Canvas Container */}
            <div className="flex justify-center">
              <div className="relative bg-white border-2 border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  className="cursor-crosshair touch-none"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                
                {/* Instructions overlay when no signature */}
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-gray-400 text-center">
                      <PencilIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Draw your signature here</p>
                      <p className="text-xs">Use mouse or finger to sign</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Button */}
            <div className="flex justify-center">
              <Button
                onClick={clearSignature}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                disabled={!hasSignature}
              >
                <TrashIcon className="w-4 h-4" />
                Clear Signature
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="py-2.5 px-4">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="px-3 h-9 font-normal border-gray-200 text-sm"
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave}
            disabled={!hasSignature}
            className="px-3 h-9 text-sm"
          >
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDrawing;
