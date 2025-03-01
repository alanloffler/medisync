import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@lib/utils"

const badgeVariants = cva(
  // "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  "inline-flex items-center rounded-md px-2 py-1 space-x-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          // "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          "border-transparent bg-amber-100 text-amber-700 text-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        success: 
          "border-transparent bg-green-500 text-destructive-foreground hover:bg-green-500/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        attended: "bg-emerald-200 !text-xxs text-emerald-700",
        not_attended: "bg-rose-200 !text-xxs text-rose-700",
        not_status: 'bg-slate-200 !text-xxs text-slate-700',
        waiting: 'bg-amber-200 !text-xxs text-amber-700',
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
