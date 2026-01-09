import Cropper from "react-easy-crop";
import { useState } from "react";
import { getCroppedImage } from "../utills/AddressForm";
import "../../css/imageModel.css"
import { useEffect } from 'react';

export default function ImageCropModal({ file, onSave, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);

  const imageUrl = URL.createObjectURL(file);
 useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

   // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <div className="crop-modal-overlay" onClick={handleOverlayClick}>
  <div className="crop-modal">
    {/* Optional close button */}
    <button 
      className="crop-close" 
      onClick={onClose}
      aria-label="Close crop modal"
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    {/* Header */}
    <div className="crop-header">
      <h3 className="crop-title">Crop Company Image</h3>
      <p className="crop-subtitle">
        Adjust and crop your image to fit 300 × 250 pixels
      </p>
    </div>

    {/* Content */}
    <div className="crop-content">
      {/* Cropper Container */}
      <div className="cropper-container">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={300 / 250} // 🔒 fixed ratio
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCropPixels(pixels)}
        />
      </div>

      {/* Controls */}
      <div className="crop-controls">
        <div className="zoom-control">
          <label className="control-label">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Zoom
          </label>
          <div className="zoom-slider">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="zoom-icon minus">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-slider-input"
            />
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="zoom-icon plus">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="zoom-value">{zoom.toFixed(1)}x</span>
          </div>
        </div>

        <div className="dimensions-info">
          <div className="dimension-item">
            <span className="dimension-label">Target Size:</span>
            <span className="dimension-value">300 × 250 px</span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Aspect Ratio:</span>
            <span className="dimension-value">6:5 (Fixed)</span>
          </div>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="crop-actions">
      <button
        type="button"
        className="btn-crop-cancel"
        onClick={onClose}
      >
        {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg> */}
        Cancel
      </button>
      
      <button
        type="button"
        className="btn-crop-save"
        onClick={async () => {
          if (!cropPixels) {
            // Show error
            return;
          }
          
          // Show loading
          const croppedFile = await getCroppedImage(imageUrl, cropPixels);
          onSave(croppedFile);
        }}
        disabled={!cropPixels}
      >
        {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg> */}
        Save Image
      </button>
    </div>
  </div>
</div>
  );
}
