import { Chromo } from "./chromo";

export const drawImg = (src: string, canvas: HTMLCanvasElement) =>
  new Promise<void>((resolve) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      const { width: imgWidth, height: imageHeight } = img;
      const { width: canvasWidth, height: canvasHeight } = canvas;

      const imgScale = Math.min(
        canvasWidth / imgWidth,
        canvasHeight / imageHeight
      );

      ctx.drawImage(img, 0, 0, imgWidth * imgScale, imageHeight * imgScale);
    };
    img.src = src;
    resolve();
  });

export const drawChromo = (chromo: Chromo, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;

  ctx.clearRect(0, 0, width, height);

  chromo.polygons.forEach((polygon) => {
    const [firstPt, ...restPoint] = polygon.vertices;
    const color = polygon.color;
    ctx.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${
      color[2] * 255
    }, ${color[3]})`;

    ctx.beginPath();
    ctx.moveTo(firstPt.x * width, firstPt.y * height);
    restPoint.forEach((point) => {
      ctx.lineTo(point.x * width, point.y * height);
    });

    ctx.closePath();
    ctx.fill();
  });
};

export const getCanvasData = (canvasEle: HTMLCanvasElement) => {
  const ctx = canvasEle.getContext("2d");
  if (!ctx) return new Uint8ClampedArray();
  const { data } = ctx.getImageData(0, 0, canvasEle.width, canvasEle.height);
  return data;
};

export const getChromoData = (chromo: Chromo) => {
  const canvasEle = document.createElement("canvas");
  drawChromo(chromo, canvasEle);
  const data = getCanvasData(canvasEle);
  canvasEle.remove();
  return data;
};
