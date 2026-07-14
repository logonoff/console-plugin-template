import { defineConfig } from '@rstest/core';

const junitOutput = process.env.RSTEST_JUNIT_OUTPUT;

export default defineConfig({
  testEnvironment: 'jsdom',
  exclude: ['integration-tests'],
  setupFiles: ['./setup-tests.ts'],
  globals: true,
  ...(junitOutput && {
    reporters: ['default', ['junit', { outputPath: junitOutput }]],
  }),
  tools: {
    swc: {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    },
    rspack: (config) => {
      config.module ??= {};
      config.module.rules ??= [];
      config.module.rules.push({
        test: /\.scss$/,
        type: 'asset/source',
        generator: { emit: false },
      });
    },
  },
});
