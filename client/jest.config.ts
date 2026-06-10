import type { Config } from 'jest';

const config: Config = {
  // MSW v2 호환 jsdom — Fetch API globals (Request, Response, Headers) 노출 + conditional exports 처리
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
    // MSW 의존 ESM 패키지 (.mjs) 변환
    '^.+\\.m?js$': [
      '@swc/jest',
      {
        jsc: { parser: { syntax: 'ecmascript' } },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  // MSW v2 가 의존하는 ESM 패키지들을 swc 로 트랜스폼
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|@mswjs|until-async|outvariant|strict-event-emitter|@bundled-es-modules|headers-polyfill|rettime|@open-draft)/)',
  ],
  testMatch: ['**/?(*.)+(test).ts?(x)'],
};

export default config;
