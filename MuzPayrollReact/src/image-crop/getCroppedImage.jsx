export const getCroppedImage = (imageSrc, crop) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 490;
      canvas.height = 350;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        490,
        350
      );

      canvas.toBlob((blob) => {
        resolve(new File([blob], "company-image.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    };
  });
};
