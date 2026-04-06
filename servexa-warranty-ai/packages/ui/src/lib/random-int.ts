import { randomValue } from "./random-value";

export function randomInt(min: number, max: number): number {
  return Math.floor(randomValue(min, max));
}
