import { Role } from "@prisma/client";

// Role hierarchy - higher number = more permissions
export const roleHierarchy: Record<Role, number> = {
    [Role.CUSTOMER]: 0,
    [Role.MODERATOR]: 1,
    [Role.STORE_MANAGER]: 2,
    [Role.ADMIN]: 3,
};

// Permission types
export type Permission =
    | "view_dashboard"
    | "manage_products"
    | "manage_categories"
    | "manage_orders"
    | "manage_users"
    | "view_analytics"
    | "manage_reviews"
    | "manage_settings"
    | "full_access";

// Role-based permissions mapping
export const rolePermissions: Record<Role, Permission[]> = {
    [Role.CUSTOMER]: [
        "view_dashboard",
    ],
    [Role.MODERATOR]: [
        "view_dashboard",
        "manage_reviews",
        "view_analytics",
    ],
    [Role.STORE_MANAGER]: [
        "view_dashboard",
        "manage_products",
        "manage_categories",
        "manage_orders",
        "view_analytics",
        "manage_reviews",
    ],
    [Role.ADMIN]: [
        "full_access",
        "view_dashboard",
        "manage_products",
        "manage_categories",
        "manage_orders",
        "manage_users",
        "view_analytics",
        "manage_reviews",
        "manage_settings",
    ],
};

// Navigation items with required permissions
export interface NavItem {
    label: string;
    href: string;
    icon: string;
    requiredPermission: Permission;
    children?: NavItem[];
}

export const adminNavItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: "LayoutDashboard",
        requiredPermission: "view_dashboard",
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: "Package",
        requiredPermission: "manage_products",
    },
    {
        label: "Categories",
        href: "/admin/categories",
        icon: "Tags",
        requiredPermission: "manage_categories",
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: "ShoppingCart",
        requiredPermission: "manage_orders",
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: "Users",
        requiredPermission: "manage_users",
    },
    {
        label: "Analytics",
        href: "/admin/analytics",
        icon: "BarChart3",
        requiredPermission: "view_analytics",
    },
];

// Check if user has required permission
export function hasPermission(userRole: Role, requiredPermission: Permission): boolean {
    if (userRole === Role.ADMIN) return true; // Admin has all permissions
    
    const permissions = rolePermissions[userRole];
    return permissions.includes(requiredPermission) || permissions.includes("full_access");
}

// Check if user has required role level
export function hasRoleLevel(userRole: Role, minimumRole: Role): boolean {
    return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
}

// Get all navigation items accessible by role
export function getAccessibleNavItems(userRole: Role): NavItem[] {
    return adminNavItems.filter((item) => hasPermission(userRole, item.requiredPermission));
}

// Role display names
export const roleDisplayNames: Record<Role, string> = {
    [Role.ADMIN]: "Administrator",
    [Role.STORE_MANAGER]: "Store Manager",
    [Role.MODERATOR]: "Moderator",
    [Role.CUSTOMER]: "Customer",
};

// Role badge colors
export const roleBadgeColors: Record<Role, string> = {
    [Role.ADMIN]: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    [Role.STORE_MANAGER]: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    [Role.MODERATOR]: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    [Role.CUSTOMER]: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
};
