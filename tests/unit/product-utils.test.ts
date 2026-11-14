import { describe, it, expect } from "vitest";
import { isValidProductPrice } from "../../src/lib/product-utils";

describe("Product utilities", () => {
  describe("isValidProductPrice", () => {
    it("accepts valid non-negative prices", () => {
      expect(isValidProductPrice(100)).toBe(true);
      expect(isValidProductPrice(0)).toBe(true);
      expect(isValidProductPrice(49.99)).toBe(true);
    });

    it("rejects negative prices", () => {
      expect(isValidProductPrice(-10)).toBe(false);
    });

    it("rejects non-number values", () => {
      expect(isValidProductPrice("100")).toBe(false);
      expect(isValidProductPrice(null)).toBe(false);
      expect(isValidProductPrice(undefined)).toBe(false);
    });

    it("rejects NaN and Infinity", () => {
      expect(isValidProductPrice(NaN)).toBe(false);
      expect(isValidProductPrice(Infinity)).toBe(false);
    });
  });
});