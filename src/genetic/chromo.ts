import { range } from "ramda";
import { drawChromo, getCanvasData } from "./utils";
import * as Comlink from "comlink";

/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import Worker from "worker-loader!./worker";

const worker = new Worker();
const workerCalculateFitness =
  Comlink.wrap<
    (chromoImage: Uint8ClampedArray, refImage: Uint8ClampedArray) => number
  >(worker);

export class Point {
  #x: number = 0;
  #y: number = 0;

  constructor() {
    this.#x = Math.random();
    this.#y = Math.random();
  }

  get x() {
    return this.#x;
  }

  set x(value: number) {
    this.#x = value < 0 || value > 1 ? Math.random() : value;
  }

  get y() {
    return this.#y;
  }

  set y(value: number) {
    this.#y = value < 0 || value > 1 ? Math.random() : value;
  }

  static clone(point: Point) {
    const newPoint = new Point();
    newPoint.x = point.x;
    newPoint.y = point.y;
    return newPoint;
  }
}

export class Polygon {
  #vertices: Point[] = [];
  #color: [r: number, g: number, b: number, alpha: number] = [0, 0, 0, 0];

  constructor(vertices: number) {
    this.#vertices = range(0, vertices).map(() => new Point());
    this.#color = [Math.random(), Math.random(), Math.random(), 0.15];
  }

  get vertices() {
    return this.#vertices.map((v) => Point.clone(v));
  }

  set vertices(value: Point[]) {
    this.#vertices = value;
  }

  get color() {
    return [...this.#color];
  }

  set color(value: [number, number, number, number]) {
    this.#color = value.map((v) => (v < 0 || v > 1 ? Math.random() : v)) as [
      number,
      number,
      number,
      number
    ];
  }

  static clone(polygon: Polygon) {
    const newPolygon = new Polygon(polygon.vertices.length);
    newPolygon.color = polygon.color;
    newPolygon.vertices = polygon.vertices;
    return newPolygon;
  }
}

export class Chromo {
  static refImageData: Uint8ClampedArray = new Uint8ClampedArray();
  static refChromoCanvas = document.createElement("canvas");
  static imgScale = 1;

  static polyCount = 0;
  static verticesCount = 0;

  fitness: number = 0;
  polygons: Polygon[] = [];

  constructor() {
    this.polygons = range(0, Chromo.polyCount).map(
      () => new Polygon(Chromo.verticesCount)
    );
  }

  async calculateFitness() {
    drawChromo(this, Chromo.refChromoCanvas);
    const refChromoData = getCanvasData(Chromo.refChromoCanvas);

    const fitness = await workerCalculateFitness(
      refChromoData,
      Chromo.refImageData
    );
    this.fitness = fitness;
  }

  compare(compare: Chromo) {
    if (this.fitness === compare.fitness) return 0;
    if (this.fitness >= compare.fitness) return -1;
    return 1;
  }

  mutate(perturbation: number) {
    this.polygons.forEach((polygon) => {
      polygon.color = polygon.color.map((value) =>
        Math.random() < 0.25
          ? Math.random() < 0.5
            ? value + (10 * Math.random()) / perturbation
            : value - (10 * Math.random()) / perturbation
          : value
      ) as [number, number, number, number];

      polygon.vertices.forEach((vertex) => {
        const { x, y } = vertex;
        vertex.x =
          Math.random() < 0.5
            ? x + Math.random() / perturbation
            : x - Math.random() / perturbation;
        vertex.y =
          Math.random() < 0.5
            ? y + Math.random() / perturbation
            : y - Math.random() / perturbation;
      });
    });
  }
}
