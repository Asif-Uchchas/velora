export function formatPrice(price: number | string) {
    // Convert to Taka (assuming price is in dollars, multiply by 110 for approximate conversion)
    // If you want to store prices directly in Taka in the database, remove the * 110
    const priceInTaka = Number(price) * 110;
    
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(priceInTaka);
}

export function formatPriceWithoutSymbol(price: number | string) {
    const priceInTaka = Number(price) * 110;
    
    return new Intl.NumberFormat("en-BD", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(priceInTaka);
}

export function formatPriceFromCents(cents: number) {
    return formatPrice(cents / 100);
}
