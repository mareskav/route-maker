import { LoadingSpinner, SkeletonBlock } from "@/components/ui/loading"

export const MapLoadingState = () => (
  <div className="relative h-full w-full overflow-hidden bg-slate-100">
    <div className="absolute inset-0 opacity-90">
      <SkeletonBlock className="absolute -left-12 top-14 h-36 w-72 rotate-[-12deg] bg-slate-200/80" />
      <SkeletonBlock className="absolute left-24 top-72 h-28 w-96 rotate-[8deg] bg-slate-200/70" />
      <SkeletonBlock className="absolute right-16 top-24 h-44 w-80 rotate-[5deg] bg-slate-200/75" />
      <SkeletonBlock className="absolute bottom-10 left-1/3 h-36 w-96 rotate-[-7deg] bg-slate-200/70" />
      <div className="absolute left-[-8%] top-[34%] h-3 w-[116%] rotate-[-9deg] rounded-full bg-white/90 shadow-sm" />
      <div className="absolute left-[18%] top-[-10%] h-[120%] w-2 rotate-[18deg] rounded-full bg-white/80 shadow-sm" />
      <div className="absolute left-[64%] top-[-8%] h-[120%] w-2 rotate-[-21deg] rounded-full bg-white/75 shadow-sm" />
      <div className="absolute left-[-10%] top-[63%] h-2 w-[120%] rotate-[4deg] rounded-full bg-white/80 shadow-sm" />
    </div>

    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-slate-700 shadow-lg ring-1 ring-black/5">
      <LoadingSpinner className="text-blue-700" />
      Načítám mapu
    </div>
  </div>
)
