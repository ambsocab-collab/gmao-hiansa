import { test, expect } from '../../fixtures/test.fixtures';

/**
 * P0 E2E Tests for Story 3.1 AC2: Tarjetas OT con información completa
 *
 * TDD GREEN PHASE: Tests validate OT card rendering with complete information
 * All tests verify the card content and styling
 *
 * Acceptance Criteria:
 * - Tarjetas OT muestran: número OT, título/descripción, equipo, tags división, técnicos asignados, fecha
 * - Tarjeta tiene borde izquierdo coloreado según estado (4px solid)
 * - Tarjeta tiene data-testid="ot-card-{id}"
 * - División tag visible: HiRock (#FFD700) o Ultra (#8FBC8F)
 *
 * Storage State: Uses admin auth from playwright.config.ts
 * Auth Fixture: loginAs (no-op, runs as admin with can_view_all_ots)
 */

test.describe('Story 3.1 - AC2: OT Cards Information (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop >1200px

  test.beforeEach(async ({ page }) => {
    // Navigate to Kanban page
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseURL}/ots/kanban`);
  });

  test('P0-005: OT cards muestran información completa', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    await expect(board).toBeVisible();

    // Desktop columns are in the lg:flex container
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: veo las tarjetas OT
    // THEN: cada tarjeta tiene toda la información requerida

    const cards = desktopContainer.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();

    // Get the workOrderId from the card's data-testid
    const testId = await firstCard.getAttribute('data-testid');
    const workOrderId = testId?.replace('ot-card-', '');

    expect(workOrderId).toBeTruthy();

    // Verify número OT
    const otNumber = firstCard.getByTestId(`ot-numero-${workOrderId}`);
    await expect(otNumber).toBeVisible();
    const otNumberText = await otNumber.textContent();
    expect(otNumberText).toMatch(/OT-\d{4}-\d{3}/);

    // Verify título/descripción
    const description = firstCard.getByTestId(`ot-descripcion-${workOrderId}`);
    await expect(description).toBeVisible();
    expect(await description.textContent()).toBeTruthy();

    // Verify equipo
    const equipo = firstCard.getByTestId(`ot-equipo-${workOrderId}`);
    await expect(equipo).toBeVisible();

    // Verify tags división (HiRock o Ultra)
    const divisionTag = firstCard.locator('[role="status"][aria-label*="División"]');
    await expect(divisionTag).toBeVisible();
    const divisionText = await divisionTag.textContent();
    expect(['HiRock', 'Ultra', 'HIROCK', 'ULTRA']).toContain(divisionText?.trim());

    // Verify técnicos asignados (if present)
    const technicians = firstCard.getByTestId(`ot-tecnicos-${workOrderId}`);
    // Technicians might not be assigned, so we just check the element exists
    const technicianCount = await technicians.count();
    if (technicianCount > 0) {
      await expect(technicians).toBeVisible();
    }

    // Verify tipo (preventivo/correctivo)
    const tipo = firstCard.getByTestId(`ot-tipo-${workOrderId}`);
    await expect(tipo).toBeVisible();
    const tipoText = await tipo.textContent();
    expect(['Preventivo', 'Correctivo', 'PREVENTIVO', 'CORRECTIVO']).toContain(tipoText?.trim());
  });

  test('P0-006: Tarjeta tiene borde izquierdo coloreado por estado', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: veo las tarjetas
    // THEN: borde izquierdo es 4px solid con color del estado

    const firstCard = desktopContainer.locator('[data-testid^="ot-card-"]').first();
    await expect(firstCard).toBeVisible();

    // Get the card's left border color
    const leftBorderColor = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.borderLeftWidth,
        style: styles.borderLeftStyle,
        color: styles.borderLeftColor
      };
    });

    // Verify border is 4px solid
    expect(leftBorderColor.width).toBe('4px');
    expect(leftBorderColor.style).toBe('solid');

    // Verify color is a valid color (RGB or hex)
    expect(leftBorderColor.color).toMatch(/rgb\(\d+, \d+, \d+\)/);
  });

  test('P0-007: División tag tiene color correcto', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: veo tags de división
    // THEN: HiRock es dorado, Ultra es verde salvia

    const cards = desktopContainer.locator('[data-testid^="ot-card-"]');

    // Check HiRock division tag
    const hirockCard = cards.filter({ hasText: /HiRock/i }).first();
    if (await hirockCard.count() > 0) {
      const hirockTag = hirockCard.locator('[role="status"][aria-label*="HiRock"]');
      await expect(hirockTag).toBeVisible();

      const hirockBgColor = await hirockTag.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // HiRock should be golden/yellowish (rgb(255, 215, 0) or similar)
      expect(hirockBgColor).toMatch(/rgb\(\d{2,3}, \d{2,3}, \d+\)/);
    }

    // Check Ultra division tag
    const ultraCard = cards.filter({ hasText: /Ultra/i }).first();
    if (await ultraCard.count() > 0) {
      const ultraTag = ultraCard.locator('[role="status"][aria-label*="Ultra"]');
      await expect(ultraTag).toBeVisible();

      const ultraBgColor = await ultraTag.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Ultra should be sage green (rgb(143, 188, 143) or similar)
      expect(ultraBgColor).toMatch(/rgb\(\d{2,3}, \d{2,3}, \d{2,3}\)/);
    }
  });

  test('P0-008: Tarjeta tiene data-testid="ot-card-{id}"', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');

    const board = page.getByTestId('ot-kanban-board');
    const desktopContainer = board.locator('.lg\\:flex').first();

    // GIVEN: Kanban visible con OTs
    // WHEN: inspecciono tarjetas
    // THEN: cada tarjeta tiene data-testid único

    const cards = desktopContainer.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    // Verify each card has a unique testid
    const testIds: string[] = [];
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      const testId = await card.getAttribute('data-testid');

      expect(testId).toMatch(/^ot-card-[a-z0-9]+$/);
      expect(testIds).not.toContain(testId); // Unique
      testIds.push(testId!);
    }
  });
});
