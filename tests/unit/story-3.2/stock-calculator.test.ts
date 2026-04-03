/**
 * Unit Tests for Story 3.2 - Stock Calculator
 *
 * Pure business logic tests for stock calculations
 * No database dependencies - fast execution
 */

import { describe, it, expect } from 'vitest';

// Types
interface Repuesto {
  id: string;
  code: string;
  name: string;
  stock: number;
  stock_minimo: number;
  stock_maximo?: number;
  precio_unitario?: number;
}

interface UsedRepuesto {
  repuesto_id: string;
  cantidad: number;
  precio_unitario: number;
}

// Business logic functions to test
function calculateAvailableStock(repuesto: Repuesto): number {
  return Math.max(0, repuesto.stock);
}

function isStockLow(repuesto: Repuesto): boolean {
  return repuesto.stock <= repuesto.stock_minimo;
}

function isStockCritical(repuesto: Repuesto): boolean {
  return repuesto.stock <= 0;
}

function canUseStock(repuesto: Repuesto, cantidad: number): boolean {
  return repuesto.stock >= cantidad && cantidad > 0;
}

function calculateStockAfterUse(repuesto: Repuesto, cantidad: number): number {
  return repuesto.stock - cantidad;
}

function calculateStockAfterRestock(repuesto: Repuesto, cantidad: number): number {
  const max = repuesto.stock_maximo ?? Infinity;
  return Math.min(repuesto.stock + cantidad, max);
}

function calculateTotalCost(usedRepuestos: UsedRepuesto[]): number {
  return usedRepuestos.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
}

function needsRestock(repuesto: Repuesto): boolean {
  return repuesto.stock <= repuesto.stock_minimo;
}

function calculateRestockAmount(repuesto: Repuesto): number {
  const target = repuesto.stock_maximo ?? (repuesto.stock_minimo * 3);
  return Math.max(0, target - repuesto.stock);
}

function validateStockUsage(
  repuesto: Repuesto,
  cantidad: number
): { valid: boolean; error?: string } {
  if (cantidad <= 0) {
    return { valid: false, error: 'Cantidad debe ser mayor a 0' };
  }
  if (repuesto.stock < cantidad) {
    return {
      valid: false,
      error: `Stock insuficiente. Disponible: ${repuesto.stock}, Requerido: ${cantidad}`
    };
  }
  return { valid: true };
}

describe('Story 3.2 - Unit: Stock Calculator', () => {
  // Test fixtures
  const createRepuesto = (overrides: Partial<Repuesto> = {}): Repuesto => ({
    id: 'rep-001',
    code: 'REP-001',
    name: 'Repuesto Test',
    stock: 10,
    stock_minimo: 2,
    stock_maximo: 50,
    precio_unitario: 100,
    ...overrides
  });

  describe('Stock Status', () => {
    /**
     * U2-STOCK-001: Calculate available stock
     */
    it('[U2-STOCK-001] should calculate available stock correctly', () => {
      const repuesto = createRepuesto({ stock: 15 });
      expect(calculateAvailableStock(repuesto)).toBe(15);
    });

    /**
     * U2-STOCK-002: Available stock is never negative
     */
    it('[U2-STOCK-002] should return 0 for negative stock', () => {
      const repuesto = createRepuesto({ stock: -5 });
      expect(calculateAvailableStock(repuesto)).toBe(0);
    });

    /**
     * U2-STOCK-003: Detect low stock
     */
    it('[U2-STOCK-003] should detect low stock when at minimum', () => {
      const repuesto = createRepuesto({ stock: 2, stock_minimo: 2 });
      expect(isStockLow(repuesto)).toBe(true);
    });

    /**
     * U2-STOCK-004: Detect low stock when below minimum
     */
    it('[U2-STOCK-004] should detect low stock when below minimum', () => {
      const repuesto = createRepuesto({ stock: 1, stock_minimo: 2 });
      expect(isStockLow(repuesto)).toBe(true);
    });

    /**
     * U2-STOCK-005: Stock not low when above minimum
     */
    it('[U2-STOCK-005] should NOT detect low stock when above minimum', () => {
      const repuesto = createRepuesto({ stock: 5, stock_minimo: 2 });
      expect(isStockLow(repuesto)).toBe(false);
    });

    /**
     * U2-STOCK-006: Detect critical stock (0)
     */
    it('[U2-STOCK-006] should detect critical stock at 0', () => {
      const repuesto = createRepuesto({ stock: 0 });
      expect(isStockCritical(repuesto)).toBe(true);
    });

    /**
     * U2-STOCK-007: Detect critical stock (negative)
     */
    it('[U2-STOCK-007] should detect critical stock when negative', () => {
      const repuesto = createRepuesto({ stock: -1 });
      expect(isStockCritical(repuesto)).toBe(true);
    });
  });

  describe('Stock Usage Validation', () => {
    /**
     * U2-USE-001: Can use stock when sufficient
     */
    it('[U2-USE-001] should allow stock usage when sufficient', () => {
      const repuesto = createRepuesto({ stock: 10 });
      expect(canUseStock(repuesto, 5)).toBe(true);
    });

    /**
     * U2-USE-002: Cannot use stock when insufficient
     */
    it('[U2-USE-002] should NOT allow stock usage when insufficient', () => {
      const repuesto = createRepuesto({ stock: 3 });
      expect(canUseStock(repuesto, 5)).toBe(false);
    });

    /**
     * U2-USE-003: Cannot use 0 or negative quantity
     */
    it('[U2-USE-003] should NOT allow 0 or negative quantity', () => {
      const repuesto = createRepuesto({ stock: 10 });
      expect(canUseStock(repuesto, 0)).toBe(false);
      expect(canUseStock(repuesto, -1)).toBe(false);
    });

    /**
     * U2-USE-004: Can use exact stock amount
     */
    it('[U2-USE-004] should allow using exact stock amount', () => {
      const repuesto = createRepuesto({ stock: 5 });
      expect(canUseStock(repuesto, 5)).toBe(true);
    });

    /**
     * U2-USE-005: Validate stock usage - valid
     */
    it('[U2-USE-005] should validate stock usage as valid', () => {
      const repuesto = createRepuesto({ stock: 10 });
      const result = validateStockUsage(repuesto, 5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    /**
     * U2-USE-006: Validate stock usage - insufficient
     */
    it('[U2-USE-006] should validate stock usage with insufficient error', () => {
      const repuesto = createRepuesto({ stock: 3 });
      const result = validateStockUsage(repuesto, 5);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Stock insuficiente');
      expect(result.error).toContain('3');
      expect(result.error).toContain('5');
    });

    /**
     * U2-USE-007: Validate stock usage - invalid quantity
     */
    it('[U2-USE-007] should validate stock usage with invalid quantity error', () => {
      const repuesto = createRepuesto({ stock: 10 });
      const result = validateStockUsage(repuesto, 0);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('mayor a 0');
    });
  });

  describe('Stock Calculations', () => {
    /**
     * U2-CALC-001: Calculate stock after use
     */
    it('[U2-CALC-001] should calculate stock after use', () => {
      const repuesto = createRepuesto({ stock: 10 });
      expect(calculateStockAfterUse(repuesto, 3)).toBe(7);
    });

    /**
     * U2-CALC-002: Calculate stock after use to zero
     */
    it('[U2-CALC-002] should calculate stock after use to zero', () => {
      const repuesto = createRepuesto({ stock: 5 });
      expect(calculateStockAfterUse(repuesto, 5)).toBe(0);
    });

    /**
     * U2-CALC-003: Calculate stock after restock
     */
    it('[U2-CALC-003] should calculate stock after restock', () => {
      const repuesto = createRepuesto({ stock: 10, stock_maximo: 50 });
      expect(calculateStockAfterRestock(repuesto, 20)).toBe(30);
    });

    /**
     * U2-CALC-004: Restock capped at maximum
     */
    it('[U2-CALC-004] should cap restock at stock_maximo', () => {
      const repuesto = createRepuesto({ stock: 40, stock_maximo: 50 });
      expect(calculateStockAfterRestock(repuesto, 20)).toBe(50);
    });

    /**
     * U2-CALC-005: Restock without maximum has no cap
     */
    it('[U2-CALC-005] should NOT cap restock when no stock_maximo', () => {
      const repuesto = createRepuesto({ stock: 10, stock_maximo: undefined });
      expect(calculateStockAfterRestock(repuesto, 100)).toBe(110);
    });
  });

  describe('Cost Calculations', () => {
    /**
     * U2-COST-001: Calculate total cost of used repuestos
     */
    it('[U2-COST-001] should calculate total cost of used repuestos', () => {
      const usedRepuestos: UsedRepuesto[] = [
        { repuesto_id: 'rep-001', cantidad: 2, precio_unitario: 100 },
        { repuesto_id: 'rep-002', cantidad: 3, precio_unitario: 50 }
      ];
      // 2*100 + 3*50 = 200 + 150 = 350
      expect(calculateTotalCost(usedRepuestos)).toBe(350);
    });

    /**
     * U2-COST-002: Empty array returns 0
     */
    it('[U2-COST-002] should return 0 for empty array', () => {
      expect(calculateTotalCost([])).toBe(0);
    });

    /**
     * U2-COST-003: Single item cost
     */
    it('[U2-COST-003] should calculate single item cost', () => {
      const usedRepuestos: UsedRepuesto[] = [
        { repuesto_id: 'rep-001', cantidad: 5, precio_unitario: 25 }
      ];
      expect(calculateTotalCost(usedRepuestos)).toBe(125);
    });

    /**
     * U2-COST-004: Large quantity calculation
     */
    it('[U2-COST-004] should handle large quantities', () => {
      const usedRepuestos: UsedRepuesto[] = [
        { repuesto_id: 'rep-001', cantidad: 1000, precio_unitario: 10 }
      ];
      expect(calculateTotalCost(usedRepuestos)).toBe(10000);
    });
  });

  describe('Restock Logic', () => {
    /**
     * U2-RESTOCK-001: Detect need for restock
     */
    it('[U2-RESTOCK-001] should detect need for restock', () => {
      const repuesto = createRepuesto({ stock: 2, stock_minimo: 2 });
      expect(needsRestock(repuesto)).toBe(true);
    });

    /**
     * U2-RESTOCK-002: No restock needed when above minimum
     */
    it('[U2-RESTOCK-002] should NOT need restock when above minimum', () => {
      const repuesto = createRepuesto({ stock: 10, stock_minimo: 2 });
      expect(needsRestock(repuesto)).toBe(false);
    });

    /**
     * U2-RESTOCK-003: Calculate restock amount with maximum
     */
    it('[U2-RESTOCK-003] should calculate restock amount with maximum', () => {
      const repuesto = createRepuesto({ stock: 10, stock_minimo: 5, stock_maximo: 50 });
      expect(calculateRestockAmount(repuesto)).toBe(40); // 50 - 10
    });

    /**
     * U2-RESTOCK-004: Calculate restock amount without maximum
     */
    it('[U2-RESTOCK-004] should calculate restock amount without maximum', () => {
      const repuesto = createRepuesto({ stock: 5, stock_minimo: 10, stock_maximo: undefined });
      // Target = stock_minimo * 3 = 30
      expect(calculateRestockAmount(repuesto)).toBe(25); // 30 - 5
    });

    /**
     * U2-RESTOCK-005: No restock needed when at maximum
     */
    it('[U2-RESTOCK-005] should return 0 when at maximum', () => {
      const repuesto = createRepuesto({ stock: 50, stock_minimo: 5, stock_maximo: 50 });
      expect(calculateRestockAmount(repuesto)).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    /**
     * U2-EDGE-001: Zero stock minimum
     */
    it('[U2-EDGE-001] should handle zero stock minimum', () => {
      const repuesto = createRepuesto({ stock: 0, stock_minimo: 0 });
      expect(isStockLow(repuesto)).toBe(true);
      expect(needsRestock(repuesto)).toBe(true);
    });

    /**
     * U2-EDGE-002: Large stock values
     */
    it('[U2-EDGE-002] should handle large stock values', () => {
      const repuesto = createRepuesto({ stock: 1000000, stock_minimo: 100 });
      expect(canUseStock(repuesto, 500000)).toBe(true);
      expect(calculateStockAfterUse(repuesto, 500000)).toBe(500000);
    });

    /**
     * U2-EDGE-003: Decimal quantities (should not happen but test anyway)
     */
    it('[U2-EDGE-003] should handle decimal quantities', () => {
      const repuesto = createRepuesto({ stock: 10.5 });
      expect(canUseStock(repuesto, 5.25)).toBe(true);
      expect(calculateStockAfterUse(repuesto, 5.25)).toBeCloseTo(5.25);
    });
  });
});
