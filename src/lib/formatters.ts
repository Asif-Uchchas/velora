// All prices are stored in Bangladeshi Taka (BDT).
const plain = new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

/** "৳32,999" — Intl's "BDT" currency style prints "BDT 32,999" in most browsers. */
export function formatPrice(price: number | string) {
    return `৳${plain.format(Number(price))}`;
}

export function formatPriceWithoutSymbol(price: number | string) {
    return plain.format(Number(price));
}

export const formatTaka = formatPrice;

export function computeDiscountPercent(price: number, comparePrice?: number | null) {
    if (!comparePrice || comparePrice <= price || comparePrice <= 0) return 0;
    return Math.floor(((comparePrice - price) / comparePrice) * 100);
}
