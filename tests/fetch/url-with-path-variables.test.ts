import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';

import { urlWithPathVariables } from '../../src/fetch/url-with-path-variables.ts';

describe('urlWithPathVariables', () => {
  it('should build path with correct variables', () => {
    const result = urlWithPathVariables(
      'user/:userId',
      { userId: '2' },
      z.object({ userId: z.string() }),
    );

    expect(result).toBe('user/2');
  });

  it('should build path with optional variables', () => {
    const result = urlWithPathVariables(
      'user/:userId/dashboard(/:dashboardId)',
      {
        userId: '2',
      },
      z.object({ dashboardId: z.string().optional(), userId: z.string() }),
    );

    expect(result).toBe('user/2/dashboard');
  });

  it('should be a type error when missing userId', () => {
    const result = urlWithPathVariables(
      'user/:userId/dashboard(/:dashboardId)',
      // @ts-expect-error allow for test
      { dashboardId: '2' },
      z.object({ dashboardId: z.string().optional(), userId: z.string() }),
    );

    expect(result).toBeInstanceOf(ZodError);
  });
});
