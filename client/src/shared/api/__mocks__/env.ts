// Jest 환경 전용 — env.ts 의 import.meta 접근을 우회.
// test/setup.ts 의 jest.mock('./shared/api/env') 호출로 자동 적용.
export const API_BASE_URL = 'http://localhost:3000';
