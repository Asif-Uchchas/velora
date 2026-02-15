export function ProductSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <div className="aspect-square skeleton-shimmer" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-16 rounded skeleton-shimmer" />
                <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                <div className="h-4 w-20 rounded skeleton-shimmer" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
