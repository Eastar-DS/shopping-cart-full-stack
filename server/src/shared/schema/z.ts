import { ZodNumber, ZodString } from './primitives.js';
import { ZodObject, type ZodShape } from './object.js';

export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  object: (shape: ZodShape) => new ZodObject(shape),
};
