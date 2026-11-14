import { describe, it, expect } from "vitest";
import { isValidOrderItem, combineOrderItems } from "../../src/lib/order-utils";

describe("Order utilities", () => {
    describe("isValidOrderItem", () => {
        it("accepts valid product IDs and quantities", () => {
            expect(isValidOrderItem({ productId: 1, quantity: 1 })).toBe(true);
            expect(isValidOrderItem({ productId: 25, quantity: 5 })).toBe(true);
            expect(isValidOrderItem({ productId: 100, quantity: 99 })).toBe(true);
        });

        it("rejects invalid product IDs", () => {
            expect(isValidOrderItem({ productId: 0, quantity: 1 })).toBe(false);
            expect(isValidOrderItem({ productId: -1, quantity: 1 })).toBe(false);
            expect(isValidOrderItem({ productId: 1.5, quantity: 1 })).toBe(false);
        });

        it("rejects invalid quantities", () => {
            expect(isValidOrderItem({ productId: 1, quantity: 0 })).toBe(false);
            expect(isValidOrderItem({ productId: 1, quantity: -1 })).toBe(false);
            expect(isValidOrderItem({ productId: 1, quantity: 100 })).toBe(false);
            expect(isValidOrderItem({ productId: 1, quantity: 1.5 })).toBe(false);
        });
    });

    describe("combineOrderItems", () => {
        it("combines quantities for duplicate products", () => {
            const items = [
                { productId: 1, quantity: 2 },
                { productId: 1, quantity: 3 },
                { productId: 2, quantity: 1 },
            ];

            const result = combineOrderItems(items);

            expect(result).toEqual(
                new Map([
                    [1, 5],
                    [2, 1],
                ])
            );
        });

        it("accepts a combined quantity of exactly 99", () => {
            const items = [
                { productId: 1, quantity: 50 },
                { productId: 1, quantity: 49 },
            ];

            expect(combineOrderItems(items)).toEqual(
                new Map([[1, 99]])
            );
        });

        it("rejects a combined quantity above 99", () => {
            const items = [
                { productId: 1, quantity: 50 },
                { productId: 1, quantity: 50 },
            ];

            expect(combineOrderItems(items)).toBeNull();
        });
    });
});