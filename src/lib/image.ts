// Google Sheets caps a cell at 50,000 characters, so the encoded avatar
// must stay well under that to fit in the Photo URL column.
const MAX_DATA_URL_LENGTH = 40000;

export const isDataUrl = (value: string | undefined | null): boolean =>
  !!value && value.trim().startsWith('data:');

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image file'));
    };
    img.src = url;
  });

const drawToDataUrl = (img: HTMLImageElement, maxSize: number, quality: number): string => {
  const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // JPEG has no transparency; avoid black backgrounds on transparent PNGs.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
};

export const compressImageToDataUrl = async (file: File): Promise<string> => {
  const img = await loadImage(file);

  for (const maxSize of [256, 192, 128, 96]) {
    for (const quality of [0.8, 0.6, 0.4]) {
      const dataUrl = drawToDataUrl(img, maxSize, quality);
      if (dataUrl.length <= MAX_DATA_URL_LENGTH) {
        return dataUrl;
      }
    }
  }

  throw new Error('Image could not be compressed enough to store');
};
