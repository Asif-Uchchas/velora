// Bangladeshi mobile numbers: 01[3-9] followed by 8 digits, optionally prefixed with +88 / 88.
const BD_MOBILE = /^(?:\+?88)?(01[3-9]\d{8})$/;

/** Returns "+8801XXXXXXXXX" or null if the input is not a valid BD mobile number. */
export function normalizeBdPhone(input: string): string | null {
    const compact = input.replace(/[\s\-()]/g, "");
    const match = compact.match(BD_MOBILE);
    return match ? `+88${match[1]}` : null;
}

/** Digits-only form that wa.me expects, e.g. "8801999398675". */
export function toWhatsAppNumber(phone: string): string {
    return phone.replace(/\D/g, "");
}

/** "+8801712345678" -> "+880 1712-345678" */
export function formatBdPhone(phone: string): string {
    const match = phone.match(/^\+880(\d{4})(\d{6})$/);
    return match ? `+880 ${match[1]}-${match[2]}` : phone;
}
