import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md shadow-primary/30",
        outline:
          "border border-border bg-background hover:bg-muted rounded-xl",
        glow:
          "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(66,125,106,0.55)] hover:shadow-[0_0_25px_rgba(66,125,106,0.7)] rounded-xl",
        hero: "bg-primary text-primary-foreground font-medium tracking-wide rounded-xl shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] active:scale-95 transition-all duration-200",
        elegant: "bg-transparent border-2 border-foreground/20 text-foreground rounded-xl hover:border-primary hover:text-primary transition-colors duration-300",
        danger: "bg-destructive text-white  rounded-xl hover:bg-destructive/90 shadow-md shadow-destructive/30",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
