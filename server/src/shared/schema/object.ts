import { ZodType, type Issue, type ParseResult } from "./core.js";

export type ZodShape = Record<string, ZodType<unknown>>;

export class ZodObject extends ZodType<Record<string, unknown>> {
  constructor(private readonly shape: ZodShape) {
    super();
  }

  safeParse(input: unknown): ParseResult<Record<string, unknown>> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return {
        success: false,
        error: { issues: [{ path: [], message: "object 타입이어야 합니다" }] },
      };
    }

    const record = input as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    const issues: Issue[] = [];

    for (const [key, schema] of Object.entries(this.shape)) {
      const result = schema.safeParse(record[key]);
      if (result.success) {
        data[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          issues.push({ path: [key, ...issue.path], message: issue.message });
        }
      }
    }

    if (issues.length > 0) {
      return { success: false, error: { issues } };
    }

    return { success: true, data };
  }
}
