import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        theme === 'dark' ? "bg-gray-700" : "bg-loan-gray-200"
      )}>
        <SliderPrimitive.Range className={cn(
          "absolute h-full",
          theme === 'dark' ? "bg-blue-600" : "bg-loan-blue"
        )} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={cn(
        "block h-5 w-5 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        theme === 'dark' 
          ? "border-blue-600 bg-gray-800 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900" 
          : "border-loan-blue bg-white focus-visible:ring-loan-blue focus-visible:ring-offset-white"
      )} />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
