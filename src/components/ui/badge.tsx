import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-[rgba(43,117,116,0.35)] bg-[rgba(43,117,116,0.15)] text-[#7acac8]",
        secondary:
          "border-[rgba(18,72,76,0.6)] bg-[rgba(18,72,76,0.5)] text-offwhite/70",
        destructive:
          "border-[rgba(134,18,17,0.35)] bg-[rgba(134,18,17,0.15)] text-[#e07575]",
        outline: "text-offwhite/70 border-[rgba(226,226,224,0.2)]",
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

