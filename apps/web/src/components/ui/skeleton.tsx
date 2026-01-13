export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-stone-200 rounded-lg ${className}`} />
  );
}

export function CondominioCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
      </div>
      
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mt-4" />
      <Skeleton className="h-4 w-2/3 mt-2" />
    </div>
  );
}