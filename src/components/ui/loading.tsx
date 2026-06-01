import { LoaderCircle } from "lucide-react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type LoadingSpinnerProps = {
  className?: string
}

export const LoadingSpinner = ({ className }: LoadingSpinnerProps) => (
  <LoaderCircle className={cn("size-4 animate-spin", className)} aria-hidden="true" />
)

export const SkeletonBlock = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("loading-shimmer rounded-md bg-slate-200", className)} {...props} />
)
