import { rs } from '@rstest/core';
import { afterEach, expect } from '@rstest/core';
import { configure, cleanup } from '@testing-library/react';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';

// Auto mock modules in the __mocks__ directory
rs.mock('@openshift-console/dynamic-plugin-sdk');
rs.mock('react-i18next');

// Extend Rstest expect with jest-dom custom matchers
expect.extend(jestDomMatchers);

// Auto-cleanup after each test to prevent cross-contamination
afterEach(() => {
  cleanup();
});

configure({ testIdAttribute: 'data-test' });
