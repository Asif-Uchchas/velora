export const ORDER_STATUS_LABEL: Record<string, string> = {
    PENDING: "Awaiting confirmation",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    CONFIRMED: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    PROCESSING: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    SHIPPED: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    DELIVERED: "bg-green-500/10 text-green-700 dark:text-green-400",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export const ORDER_CHANNEL_LABEL: Record<string, string> = {
    WHATSAPP: "WhatsApp",
    EMAIL: "Email",
    WEB: "Website",
};
