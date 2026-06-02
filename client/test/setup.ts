import '@testing-library/jest-dom';
import { server } from './mocks/server';

// env.ts 의 import.meta 접근을 Jest 환경에서 우회 — __mocks__/env.ts 사용
jest.mock('../src/shared/api/env');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());