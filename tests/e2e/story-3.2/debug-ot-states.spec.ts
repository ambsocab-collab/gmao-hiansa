import { test } from '../../fixtures/test.fixtures';

test.describe('DEBUG - OT States', () => {
  test.use({ storageState: 'playwright/.auth/tecnico.json' });

  test('debug: print all OT states', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL || 'http://localhost:3000'}/mis-ots`);
    await page.waitForLoadState('domcontentloaded');

    const misOtsList = page.getByTestId('mis-ots-lista');
    const cards = misOtsList.locator('[data-testid^="my-ot-card-"]');
    const cardCount = await cards.count();

    console.log(`\n=== Total OT cards: ${cardCount} ===\n`);

    for (let i = 0; i < Math.min(cardCount, 5); i++) {
      const card = cards.nth(i);
      const otNumero = await card.locator('[data-testid="ot-numero"]').textContent();
      const estadoBadge = card.locator('[data-testid="ot-estado-badge"]');
      const estadoText = await estadoBadge.textContent();
      const estadoTextUpper = estadoText ? estadoText.toUpperCase() : '';

      console.log(`OT ${i + 1}: ${otNumero} - Estado: "${estadoText}" - Includes ASIGNADA: ${estadoTextUpper.includes('ASIGNADA')}`);
    }
  });
});
