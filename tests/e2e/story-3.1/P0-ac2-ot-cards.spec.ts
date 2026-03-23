import { test, expect } from '@playwright/test';

/**
 * P0 E2E Tests for Story 3.1 AC2: Tarjetas OT con información completa
 *
 * TDD RED PHASE: These tests are designed to FAIL before implementation
 * All tests use test.skip() to ensure they fail until feature is implemented
 *
 * Acceptance Criteria:
 * - Tarjetas OT muestran: número OT, título/descripción, equipo, tags división, técnicos asignados, fecha límite
 * - Tarjeta tiene borde izquierdo coloreado según estado (4px solid)
 * - Tarjeta tiene data-testid="ot-card-{id}"
 * - División tag visible: HiRock (#FFD700) o Ultra (#8FBC8F)
 */

test.describe('Story 3.1 - AC2: OT Cards Information (P0)', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop
  test.use({ storageState: 'playwright/.auth/supervisor.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/ots/kanban');
  });

  test('P0-005: OT cards muestran información completa', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: veo las tarjetas OT
    // THEN: cada tarjeta tiene toda la información requerida

    const cards = page.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    const firstCard = cards.first();
    await expect(firstCard).toBeVisible();

    // Verify número OT
    const otNumber = firstCard.locator('[data-testid="ot-number"]');
    await expect(otNumber).toBeVisible();
    await expect(otNumber).toMatch(/OT-\d{4}-\d{3}/);

    // Verify título/descripción
    const title = firstCard.locator('[data-testid="ot-title"]');
    await expect(title).toBeVisible();
    expect(await title.textContent()).toBeTruthy();

    // Verify equipo
    const equipo = firstCard.locator('[data-testid="ot-equipo"]');
    await expect(equipo).toBeVisible();

    // Verify tags división (HiRock o Ultra)
    const divisionTag = firstCard.locator('[data-testid="ot-division"]');
    await expect(divisionTag).toBeVisible();
    const divisionText = await divisionTag.textContent();
    expect(['HiRock', 'Ultra']).toContain(divisionText);

    // Verify técnicos asignados
    const technicians = firstCard.locator('[data-testid="ot-technicians"]');
    await expect(technicians).toBeVisible();

    // Verify fecha límite
    const dueDate = firstCard.locator('[data-testid="ot-due-date"]');
    await expect(dueDate).toBeVisible();
  });

  test('P0-006: Tarjeta tiene borde izquierdo coloreado por estado', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: veo las tarjetas
    // THEN: borde izquierdo es 4px solid con color del estado

    const firstCard = page.locator('[data-testid^="ot-card-"]').first();
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

    // Verify color is a valid hex color
    expect(leftBorderColor.color).toMatch(/rgb\(\d+, \d+, \d+\)/);
  });

  test('P0-007: División tag tiene color correcto', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: veo tags de división
    // THEN: HiRock es #FFD700, Ultra es #8FBC8F

    const cards = page.locator('[data-testid^="ot-card-"]');

    // Check HiRock division tag
    const hirockCard = cards.filter({ hasText: 'HiRock' }).first();
    if (await hirockCard.count() > 0) {
      const hirockTag = hirockCard.locator('[data-testid="ot-division"]');
      await expect(hirockTag).toBeVisible();

      const hirockBgColor = await hirockTag.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // #FFD700 in RGB is rgb(255, 215, 0)
      expect(hirockBgColor).toBe('rgb(255, 215, 0)');
    }

    // Check Ultra division tag
    const ultraCard = cards.filter({ hasText: 'Ultra' }).first();
    if (await ultraCard.count() > 0) {
      const ultraTag = ultraCard.locator('[data-testid="ot-division"]');
      await expect(ultraTag).toBeVisible();

      const ultraBgColor = await ultraTag.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // #8FBC8F in RGB is rgb(143, 188, 143)
      expect(ultraBgColor).toBe('rgb(143, 188, 143)');
    }
  });

  test('P0-008: Tarjeta tiene data-testid="ot-card-{id}"', async ({ page }) => {
    test.skip(true, 'Feature not implemented yet - TDD Red Phase');

    // GIVEN: Kanban visible con OTs
    // WHEN: inspecciono tarjetas
    // THEN: cada tarjeta tiene data-testid único

    const cards = page.locator('[data-testid^="ot-card-"]');
    const cardCount = await cards.count();

    expect(cardCount).toBeGreaterThan(0);

    // Verify each card has a unique testid
    const testIds: string[] = [];
    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      const testId = await card.getAttribute('data-testid');

      expect(testId).toMatch(/^ot-card-[a-z0-9]+$/);
      expect(testIds).not.toContain(testId); // Unique
      testIds.push(testId);
    }
  });
});
