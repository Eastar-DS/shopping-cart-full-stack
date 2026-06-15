export interface Issue {
  path: (string | number)[];
  message: string;
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: { issues: Issue[] } };

export abstract class ZodType<T> {
  abstract safeParse(input: unknown): ParseResult<T>;
}
