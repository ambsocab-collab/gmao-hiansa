import { Page, Locator } from '@playwright/test';

/**
 * Helper para buscar una OT card por estado a través de múltiples páginas
 *
 * @param page - Playwright Page object
 * @param targetState - Estado a buscar (ej: 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA')
 * @param maxPages - Máximo número de páginas a buscar (default: 10)
 * @returns Promise<{card: Locator, pageNumber: number} | null> - Card encontrada y número de página, o null
 */
export async function findOTCardByState(
  page: Page,
  targetState: string,
  maxPages: number = 10
): Promise<{ card: Locator; pageNumber: number } | null> {
  let currentPage = 1;

  // Normalize target state: convert underscores to spaces for matching
  const normalizedTarget = targetState.toUpperCase().replace(/_/g, ' ');

  while (currentPage <= maxPages) {
    const misOtsList = page.getByTestId('mis-ots-lista');
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    // Si no hay cards en esta página, parar búsqueda
    if (cardCount === 0) {
      break;
    }

    // Buscar card con el estado objetivo
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();

      if (estadoText && estadoText.toUpperCase().includes(normalizedTarget)) {
        return { card, pageNumber: currentPage };
      }
    }

    // Si no encontramos en esta página, ir a la siguiente
    currentPage++;
    if (currentPage <= maxPages) {
      const baseURL = process.env.BASE_URL || 'http://localhost:3000';
      await page.goto(`${baseURL}/mis-ots?page=${currentPage}`);
      await page.waitForLoadState('domcontentloaded');
    }
  }

  return null; // No se encontró
}
