import { range } from "ramda";

let population: Chromo[] = [];

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
    this.calculateFitness();
  }

  calculateFitness() {
    // TODO: calc fitness
    this.fitness = 0;
  }

  isBetterThan(compare: Chromo) {
    if (this.fitness === compare.fitness) return 0;
    if (this.fitness >= compare.fitness) return 1;
    return -1;
  }
}

export const init = ({
  popSize,
  polyCount,
  vertices,
}: {
  popSize: number;
  polyCount: number;
  vertices: number;
}) => {
  population = range(0, popSize).map(() => new Chromo({ polyCount, vertices }));
};

export const mainLoop = () => {
  return population.sort((a, b) => a.isBetterThan(b));
};
