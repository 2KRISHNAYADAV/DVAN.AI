import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg px-3 py-2 text-sm transition-all duration-200",
          "bg-[rgba(14,41,49,0.65)] border border-[rgba(43,117,116,0.28)]",
          "text-offwhite placeholder:text-offwhite/35",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-offwhite",
          "focus-visible:outline-none focus-visible:border-teal focus-visible:ring-2 focus-visible:ring-[rgba(43,117,116,0.2)] focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

