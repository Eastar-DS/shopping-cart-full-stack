// Vite 의 import.meta.env 접근을 단일 파일로 캡슐화.
// Jest 환경에선 __mocks__/env.ts 로 대체됨 (import.meta 가 ESM 전용이라 Jest 가 파싱 불가).
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'http://localhost:3000';
