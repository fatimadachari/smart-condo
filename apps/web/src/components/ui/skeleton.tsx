export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-stone-200/80 rounded-lg ${className}`} />
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-8 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="w-12 h-12 rounded-xl bg-stone-100" />
        <div className="flex gap-1">
          <Skeleton className="w-8 h-8 rounded-lg bg-stone-50" />
          <Skeleton className="w-8 h-8 rounded-lg bg-stone-50" />
        </div>
      </div>
      
      <Skeleton className="h-7 w-3/4 mb-2 bg-stone-200" />
      
      <div className="mt-4 pt-4 border-t border-stone-50 flex gap-2 items-center">
        <Skeleton className="w-4 h-4 rounded-full bg-stone-100 shrink-0" />
        <div className="flex-1 space-y-2">
           <Skeleton className="h-3 w-full bg-stone-100" />
           <Skeleton className="h-3 w-2/3 bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-stone-50 last:border-0">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-10 h-10 rounded-full bg-stone-100" />
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-stone-200" />
          <Skeleton className="h-3 w-48 bg-stone-100" />
        </div>
      </div>

      <div className="hidden md:block w-32 px-4">
        <Skeleton className="h-6 w-20 rounded-full bg-stone-50" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-lg bg-stone-50" />
        <Skeleton className="w-8 h-8 rounded-lg bg-stone-50" />
      </div>
    </div>
  );
}


export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 bg-stone-100" /> 
        <Skeleton className="h-12 w-full bg-stone-50" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-32 bg-stone-100" />
        <Skeleton className="h-12 w-full bg-stone-50" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-stone-100" />
        <Skeleton className="h-24 w-full bg-stone-50" /> 
      </div>
    </div>
  );
}