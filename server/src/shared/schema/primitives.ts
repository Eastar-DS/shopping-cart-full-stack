import { ZodType, type ParseResult } from './core.js';

export class ZodString extends ZodType<string> {
  safeParse(input: unknown): ParseResult<string> {
    if (typeof input === 'string') {
      return { success: true, data: input };
    }

    return { success: false, error: { issues: [{ path: [], message: 'string 타입이어야 합니다' }] } };
  }
}

export class ZodNumber extends ZodType<number> {
  safeParse(input: unknown): ParseResult<number> {
    if (typeof input === 'number') {
      return { success: true, data: input };
    }

    return { success: false, error: { issues: [{ path: [], message: 'number 타입이어야 합니다' }] } };
  }
}
