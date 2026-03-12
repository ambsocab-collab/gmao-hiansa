/**
 * API Helpers for gmao-hiansa
 * GMAO (Gestión de Mantenimiento Asistido por Ordenador)
 *
 * Helper functions for API testing
 */

/**
 * API Error class
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public response?: any,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Parse API response
 */
export const parseAPIResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new APIError(response.status, error.message || response.statusText, error);
  }
  return response.json();
};

/**
 * Auth Helpers
 */
export const setAuthToken = (page: any, token: string) => {
  return page.addInitScript(({ authToken }) => {
    localStorage.setItem('auth-token', authToken);
  }, { authToken: token });
};

export const getAuthToken = (page: any): Promise<string | null> => {
  return page.evaluate(() => localStorage.getItem('auth-token'));
};

/**
 * Selector Helpers
 */
export const getByTestId = (testId: string) => {
  return `[data-testid="${testId}"]`;
};

export const getByRole = (role: string, _options = {}) => {
  return `[role="${role}"]`;
};

/**
 * Wait for SSE Event Helper
 * @param page - Playwright Page object
 * @param eventType - SSE event type to wait for
 * @param timeout - Timeout in milliseconds (default 5000ms)
 */
export const waitForSSEEvent = async (
  page: any,
  eventType: string,
  timeout = 5000,
): Promise<void> => {
  await page.waitForFunction(
    ({ eventType: evt }) => {
      return new Promise((resolve) => {
        const eventSource = new EventSource('/api/v1/sse');
        eventSource.addEventListener(evt, () => {
          eventSource.close();
          resolve(true);
        });
        setTimeout(() => {
          eventSource.close();
          resolve(false);
        }, timeout);
      });
    },
    { eventType },
  );
};

/**
 * Network Interception Helper
 * @param page - Playwright Page object
 * @param urlPattern - URL pattern to intercept
 */
export const interceptAPI = async (page: any, urlPattern: string) => {
  await page.route(urlPattern, async (route) => {
    await route.continue();
  });
};

/**
 * Helper: Fill form with data
 * @param page - Playwright Page object
 * @param formSelector - Form selector
 * @param data - Data to fill
 */
export const fillForm = async (
  page: any,
  formSelector: string,
  data: Record<string, string>,
) => {
  for (const [field, value] of Object.entries(data)) {
    await page.fill(`${formSelector} [name="${field}"]`, value);
  }
};

/**
 * Helper: Wait for navigation
 * @param page - Playwright Page object
 * @param url - Expected URL (optional)
 */
export const waitForNavigation = async (page: any, url?: string) => {
  await page.waitForURL(url ? `**${url}**` : '**');
};

/**
 * Helper: Take screenshot on failure
 * @param page - Playwright Page object
 * @param testName - Test name for screenshot
 */
export const screenshotOnFailure = async (page: any, testName: string) => {
  await page.screenshot({
    path: `test-results/screenshots/${testName}-failure.png`,
    fullPage: true,
  });
};
