export function toSelectedIdsArray(set: Set<string>): string[] {
  return Array.from(set).sort();
}

export function fromSelectedIdsArray(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set();
  const validStrings = value.filter((v): v is string => typeof v === "string");
  return new Set(validStrings);
}
