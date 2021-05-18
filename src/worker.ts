import * as Comlink from "comlink";

const calculateFitness = (
  chromoImage: Uint8ClampedArray,
  refImage: Uint8ClampedArray
) => {
  return chromoImage.reduce((acc, value, index) => {
    const valueDiff = value - refImage[index];
    return acc + (valueDiff ^ 2);
  }, 0);
};

Comlink.expose(calculateFitness);
