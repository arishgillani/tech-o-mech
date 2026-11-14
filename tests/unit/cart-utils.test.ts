
import { describe, it, expect } from "vitest";
import {calculateCartCount,calculateSubtotal,isValidQuantity} from "../../src/lib/cart-utils";

describe("Cart utilities", () => {
  describe("calculateCartCount", () => {
    it("calculates the total quantity of all products", () => {
      const items = [
        { quantity: 2 },
        { quantity: 3 },
      ];

      expect(calculateCartCount(items)).toBe(5);
    });
  });

  describe("calculateSubtotal", () => {
    it("calculates the total price of all products", () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];

      expect(calculateSubtotal(items)).toBe(250);
    });
  });

  describe("isValidQuantity", () => {
    it("accepts positive integers", () => {
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(5)).toBe(true);
    });

    it("rejects zero, negative numbers, and decimals", () => {
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-1)).toBe(false);
      expect(isValidQuantity(1.5)).toBe(false);
    });
  });
});
