import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@servexa-warranty-ai/ui/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",

        info: "bg-info text-white",
        success: "bg-success text-white",
        warning: "bg-warning text-white",
        focus: "bg-focus text-focus-foreground",
        invert: "bg-invert text-invert-foreground",
        "primary-light":
          "bg-primary/10 border-none text-primary dark:bg-primary/20",
        "warning-light":
          "bg-warning/10 border-none text-warning-foreground dark:bg-warning/20",
        "success-light":
          "bg-success/10 border-none text-success-foreground dark:bg-success/20",
        "info-light":
          "bg-info/10 border-none text-info-foreground dark:bg-info/20",
        "destructive-light":
          "bg-destructive/10 border-none text-destructive-foreground dark:bg-destructive/20",
        "invert-light":
          "bg-invert/10 border-none text-foreground dark:bg-invert/20",
        "focus-light":
          "bg-focus/10 border-none text-focus-foreground dark:bg-focus/20",
        "primary-outline":
          "bg-background border-border text-primary dark:bg-input/30",
        "warning-outline":
          "bg-background border-border text-warning-foreground dark:bg-input/30",
        "success-outline":
          "bg-background border-border text-success-foreground dark:bg-input/30",
        "info-outline":
          "bg-background border-border text-info-foreground dark:bg-input/30",
        "destructive-outline":
          "bg-background border-border text-destructive-foreground dark:bg-input/30",
        "invert-outline":
          "bg-background border-border text-invert-foreground dark:bg-input/30",
        "focus-outline":
          "bg-background border-border text-focus-foreground dark:bg-input/30",
      },
      size: {
        xs: "px-1 py-0.25 text-[0.6rem] leading-none h-4 min-w-4 gap-1",
        sm: "px-1 py-0.25 text-[0.625rem] leading-none h-4.5 min-w-4.5 gap-1",
        default: "px-1.25 py-0.5 text-xs h-5 min-w-5 gap-1",
        lg: "px-1.5 py-0.5 text-xs h-5.5 min-w-5.5 gap-1",
        xl: "px-2 py-0.75 text-sm h-6 min-w-6 gap-1.5",
      },
      /** `default`: per-theme radius. `full`: max radius per theme (Lyra stays `rounded-none`). */
      radius: {
        default:
          "rounded-sm",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
