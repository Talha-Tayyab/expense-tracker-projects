/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',           // use "jsdom" only if your tests touch the DOM
  roots: ['<rootDir>/test'],         // look for tests only in /test
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Used ONLY by ts-jest during tests (does not affect your browser build)
        tsconfig: {
          module: 'commonjs',
          target: 'ES2019',
          esModuleInterop: true,
          strict: true,
          skipLibCheck: true
        }
      }
    ]
  },
  collectCoverage: false,
  verbose: true
};