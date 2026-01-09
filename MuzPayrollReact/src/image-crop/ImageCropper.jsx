import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

export default function ImageCropper({ image, onComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    async (_, croppedAreaPixels) => {
      onComplete(croppedAreaPixels);
    },
    [onComplete]
  );

  return (
    <div className="cropper-wrapper">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={490 / 350}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}
