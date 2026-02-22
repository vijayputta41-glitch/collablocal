export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`skeleton ${className}`} {...props} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" style={{ height: '16px' }} />
      <Skeleton className="h-3 w-1/2" style={{ height: '12px' }} />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" style={{ height: '12px' }} />
        <Skeleton className="h-3 w-5/6" style={{ height: '12px' }} />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" style={{ height: '24px', borderRadius: '9999px' }} />
        <Skeleton className="h-6 w-16" style={{ height: '24px', borderRadius: '9999px' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
