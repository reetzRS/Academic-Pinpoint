export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 w-20 rounded-full bg-slate-200" />
        <div className="h-5 w-5 rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-3/5 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-2/5 rounded bg-slate-100" />
    </div>
  );
}

export function TableRowSkeleton({ isFirst = false }: { isFirst?: boolean }) {
  return (
    <div
      className={`flex animate-pulse items-center gap-3 px-4 py-3 ${
        isFirst ? "" : "border-t border-slate-100"
      }`}
    >
      <div className="h-5 w-16 shrink-0 rounded-full bg-slate-200" />
      <div className="min-w-0 flex-1">
        <div className="h-3.5 w-2/3 rounded bg-slate-200" />
        <div className="mt-2 h-3 w-1/4 rounded bg-slate-100" />
      </div>
      <div className="flex shrink-0 gap-2">
        <div className="h-6 w-12 rounded-lg bg-slate-100" />
        <div className="h-6 w-16 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

export function OpportunityDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-40 rounded-2xl bg-slate-200 md:h-48" />

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-20 rounded-2xl bg-slate-100" />
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-full rounded bg-slate-100" />
        <div className="mt-2 h-3 w-full rounded bg-slate-100" />
        <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}
