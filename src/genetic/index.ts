import { range } from 'ramda'

import { Chromo } from './chromo'
import { eliteScheme } from './evolveScheme/eliteScheme'
// import { randomScheme } from "./evolveScheme/randomScheme";
import { drawImg, getCanvasData } from './utils'

export let generation = 0
export let population: Chromo[] = []
export let start = false

export const init = async ({
  refImage,
  popSize,
  polyCount: pCount,
  vertices: vCount,
}: {
  refImage: string
  popSize: number
  polyCount: number
  vertices: number
}) => {
  generation = 0
  Chromo.polyCount = pCount
  Chromo.verticesCount = vCount

  const canvasHeight = 100
  const canvasWidth = 100

  Chromo.refChromoCanvas.width = canvasWidth
  Chromo.refChromoCanvas.height = canvasHeight

  const refImageCanvas = document.createElement('canvas')
  refImageCanvas.width = canvasWidth
  refImageCanvas.height = canvasHeight

  const imgScale = await drawImg(refImage, refImageCanvas)
  Chromo.imgScale = imgScale

  Chromo.refImageData = getCanvasData(refImageCanvas)

  refImageCanvas.remove()

  const newPopulation = range(0, popSize).map(() => new Chromo())
  await Promise.all(newPopulation.map((chromo) => chromo.calculateFitness()))
  population = newPopulation
}

const mainLoop = async () => {
  while (start) {
    generation = generation + 1

    // population = await randomScheme(population);
    const newPopulation = await eliteScheme(population)
    population = newPopulation
  }
}

export const startLoop = () => {
  start = true
  mainLoop()
}

export const stopLoop = () => {
  start = false
}
