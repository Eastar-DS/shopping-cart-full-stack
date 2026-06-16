import type { Infer, ZodType } from './core.js';
import { ZodNumber, ZodString } from './primitives.js';
import { ZodObject, type ZodShape } from './object.js';

export const z = {
  string: () => new ZodString(),
  number: () => new ZodNumber(),
  object: <Shape extends ZodShape>(shape: Shape) => new ZodObject(shape),
};

export namespace z {
  export type infer<S extends ZodType<unknown>> = Infer<S>;
}
