import * as Comlink from "comlink";

const calculateFitness = (
  chromoImage: Uint8ClampedArray,
  refImage: Uint8ClampedArray
) =>
  chromoImage.reduce((acc, value, index) => {
    const valueDiff = Math.abs(255 - (value - refImage[index]));
    return acc + valueDiff;
  }, 0);

Comlink.expose(calculateFitness);
