import { range } from "ramda";
import * as Comlink from "comlink";

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from "worker-loader!./worker";

let population: Chromo[] = [];
let refImageCanvas: HTMLCanvasElement | null = null;
let refChromoCanvas: HTMLCanvasElement | null = null;
const worker = new Worker();
const workerCalculateFitness =
  Comlink.wrap<
    (chromoImage: Uint8ClampedArray, refImage: Uint8ClampedArray) => number
  >(worker);

class Point {
  x: number = 0;
  y: number = 0;

  constructor() {
    this.x = Math.random();
    this.y = Math.random();
  }
}

class Polygon {
  vertices: Point[] = [];
  color: [r: number, g: number, b: number, alpha: number] = [0, 0, 0, 0];

  constructor(vertices: number) {
    this.vertices = range(0, vertices).map(() => new Point());
    this.color = [Math.random(), Math.random(), Math.random(), 0.15];
  }
}

export class Chromo {
  fitness: number = 0;
  polygon: Polygon[] = [];

  constructor({
    polyCount,
    vertices,
  }: {
    polyCount: number;
    vertices: number;
  }) {
    this.polygon = range(0, polyCount).map(() => new Polygon(vertices));
  }

  async calculateFitness() {
    if (!refChromoCanvas || !refImageCanvas) return;
    const refChromoCtx = refChromoCanvas.getContext("2d");
    const refImageCtx = refImageCanvas.getContext("2d");
    if (!refChromoCtx || !refImageCtx) return;

    const width = refImageCanvas.width;
    const height = refImageCanvas.height;

    drawChromo(this, refChromoCanvas);

    const refChromoData = refChromoCtx.getImageData(0, 0, width, height).data;
    const refImageData = refImageCtx.getImageData(0, 0, width, height).data;

    if (!refImageCanvas) return;
    this.fitness = await workerCalculateFitness(refChromoData, refImageData);
  }

  isBetterThan(compare: Chromo) {
    if (this.fitness === compare.fitness) return 0;
    if (this.fitness >= compare.fitness) return 1;
    return -1;
  }
}

const recalculateAllFitness = async () =>
  await Promise.all(population.map((chromo) => chromo.calculateFitness()));

export const init = async ({
  popSize,
  polyCount,
  vertices,
  refImageCanvas: imageCanvas,
  refChromoCanvas: chromoCanvas,
}: {
  popSize: number;
  polyCount: number;
  vertices: number;
  refImageCanvas: HTMLCanvasElement;
  refChromoCanvas: HTMLCanvasElement;
}) => {
  refImageCanvas = imageCanvas;
  refChromoCanvas = chromoCanvas;
  population = range(0, popSize).map(() => new Chromo({ polyCount, vertices }));
  await recalculateAllFitness();
};

export const mainLoop = async () => {
  const sortByFitness = population.sort((a, b) => a.isBetterThan(b));
  await recalculateAllFitness();
  return sortByFitness;
};

export const drawChromo = (chromo: Chromo, canvas: HTMLCanvasElement) => {
  const width = canvas.width;
  const height = canvas.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  chromo.polygon.forEach((polygon) => {
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
