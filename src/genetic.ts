import { range, splitAt } from "ramda";
import * as Comlink from "comlink";

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from "worker-loader!./worker";

let generation = 0;
let popSize = 0;
let polyCount = 0;
let vertices = 0;
let population: Chromo[] = [];
let cutoffIndex = 0;
const CROSSOVER_PROBABILITY = 0.95;
const worker = new Worker();
const workerCalculateFitness =
  Comlink.wrap<
    (chromoImage: Uint8ClampedArray, refImage: Uint8ClampedArray) => number
  >(worker);
const refChromoCanvas = document.createElement("canvas");
let refImageData: Uint8ClampedArray | null = null;

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

  constructor() {
    this.vertices = range(0, vertices).map(() => new Point());
    this.color = [Math.random(), Math.random(), Math.random(), 0.15];
  }
}

export class Chromo {
  fitness: number = 0;
  polygon: Polygon[] = [];

  constructor() {
    this.polygon = range(0, polyCount).map(() => new Polygon());
  }

  async calculateFitness() {
    if (!refImageData) return;

    drawChromo(this, refChromoCanvas);

    const refChromoCtx = refChromoCanvas.getContext("2d");
    if (!refChromoCtx) return;

    const refChromoData = refChromoCtx.getImageData(
      0,
      0,
      refChromoCanvas.width,
      refChromoCanvas.height
    ).data;

    const fitness = await workerCalculateFitness(refChromoData, refImageData);
    this.fitness = fitness;

    refChromoCanvas.remove();
  }

  compare(compare: Chromo) {
    if (this.fitness === compare.fitness) return 0;
    if (this.fitness >= compare.fitness) return -1;
    return 1;
  }

  mutate(perturbation: number) {
    this.polygon.forEach((polygon) => {
      // Mutate color
      polygon.color = polygon.color.map((value) => {
        const newValue =
          Math.random() < 0.25
            ? value + (10 * Math.random()) / perturbation
            : value;
        if (newValue < 0 || newValue > 1) return Math.random();
        return newValue;
      }) as [number, number, number, number];

      polygon.vertices = polygon.vertices.map((vertex) => {
        const newX = vertex.x + Math.random() / perturbation;
        const newY = vertex.y + Math.random() / perturbation;

        vertex.x = newX < 0 || newX > 1 ? Math.random() : newX;
        vertex.y = newY < 0 || newY > 1 ? Math.random() : newY;
        return vertex;
      });
    });
  }
}

const crossOverPtScheme = (c1: Chromo, c2: Chromo) => {
  const cutOffIdx = Math.floor(Math.random() * polyCount);
  const newChromo = new Chromo();

  const [firstHalf] = splitAt(cutOffIdx, c1.polygon);
  const [, secondHalf] = splitAt(cutOffIdx, c2.polygon);

  newChromo.polygon = [...firstHalf, ...secondHalf].map(
    ({ color, vertices }) => {
      const newPolygon = new Polygon();
      newPolygon.color = color;
      newPolygon.vertices = vertices.map(({ x, y }) => {
        const newPoint = new Point();
        newPoint.x = x;
        newPoint.y = y;
        return newPoint;
      });

      return newPolygon;
    }
  );

  return newChromo;
};

const crossOverRandScheme = (c1: Chromo, c2: Chromo) => {
  const newChromo = new Chromo();

  const newPolygon = newChromo.polygon.map((polygon, index) => {
    const { color, vertices } =
      Math.random() < 0.5 ? c1.polygon[index] : c2.polygon[index];

    const newPolygon = new Polygon();
    newPolygon.color = color;
    newPolygon.vertices = vertices.map(({ x, y }) => {
      const newPoint = new Point();
      newPoint.x = x;
      newPoint.y = y;
      return newPoint;
    });

    return newPolygon;
  });

  newChromo.polygon = newPolygon;

  return newChromo;
};

export const init = async ({
  popSize: pSize,
  polyCount: pCount,
  vertices: v,
  refImageCanvas,
}: {
  popSize: number;
  polyCount: number;
  vertices: number;
  refImageCanvas: HTMLCanvasElement;
}) => {
  generation = 0;
  popSize = pSize;
  polyCount = pCount;
  vertices = v;
  cutoffIndex = Math.ceil(pSize * 0.75);

  const width = refImageCanvas.width;
  const height = refImageCanvas.height;

  refChromoCanvas.width = refImageCanvas.width;
  refChromoCanvas.height = refImageCanvas.height;

  const refImageCtx = refImageCanvas.getContext("2d");
  if (refImageCtx) {
    refImageData = refImageCtx.getImageData(0, 0, width, height).data;
  }

  const newPopulation = range(0, popSize).map(() => new Chromo());

  await Promise.all(newPopulation.map((chromo) => chromo.calculateFitness()));
  population = newPopulation;
};

export const mainLoop = async () => {
  const sortByFitness = population.sort((a, b) => a.compare(b));
  const [keepChromo, mutateChromo] = splitAt(
    popSize - cutoffIndex,
    sortByFitness
  );

  const mutatedChromo = await Promise.all(
    mutateChromo.map(async (chromo) => {
      let newChromo = null;

      if (Math.random() < CROSSOVER_PROBABILITY) {
        // Crossover
        const idx1 = Math.round(Math.random() * (popSize - cutoffIndex));
        const idx2 = Math.round(Math.random() * (popSize - cutoffIndex));

        newChromo =
          Math.random() < 0.5
            ? crossOverPtScheme(sortByFitness[idx1], sortByFitness[idx2])
            : crossOverRandScheme(sortByFitness[idx1], sortByFitness[idx2]);
      } else {
        // Mutation
        if (Math.random() < 0.95) {
          chromo.mutate(500 * Math.random());
          newChromo = chromo;
        } else {
          newChromo = new Chromo();
        }
      }

      await newChromo.calculateFitness();
      return newChromo;
    })
  );

  const newPopulation = [...keepChromo, ...mutatedChromo];

  population = newPopulation;
  generation = generation + 1;
  return { generation, population: newPopulation };
};

export const getData = (chromo: Chromo) => {
  const canvasEle = document.createElement("canvas");

  const width = canvasEle.width;
  const height = canvasEle.height;

  const ctx = canvasEle.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvasEle.width, canvasEle.height);

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

  return ctx.getImageData(0, 0, width, height).data;
};

export const drawChromo = (
  chromo: Chromo,
  canvas: HTMLCanvasElement,
  drawInfo = false
) => {
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

  if (!drawInfo) return;
  ctx.font = "16px Rajdhani";
  ctx.fillStyle = "white";
  ctx.fillText(`Generation: ${generation}`, 10, 16);
  ctx.fillText(`Fitness: ${chromo.fitness}`, 10, 32);
};
