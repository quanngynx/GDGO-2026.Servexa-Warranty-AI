"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@servexa-warranty-ai/ui/lib/utils"
import { Button } from "@servexa-warranty-ai/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@servexa-warranty-ai/ui/components/input-group"
import { ChevronDownIcon, XIcon, CheckIcon } from "lucide-react"

type ComboboxContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  value?: any
  onValueChange?: (val: any) => void
  inputValue?: string
  onInputValueChange?: (val: string) => void
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useComboboxContext() {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error("Combobox components must be used within a <Combobox>")
  }
  return context
}

const Combobox = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> & {
    value?: any
    onValueChange?: (val: any) => void
    inputValue?: string
    onInputValueChange?: (val: string) => void
    shouldFilter?: boolean
  }
>(({ value, onValueChange, inputValue, onInputValueChange, open: openProp, onOpenChange, shouldFilter = false, children, ...props }, _ref) => {
  const [open, setOpen] = React.useState(false)
  const isOpen = openProp ?? open
  const setIsOpen = onOpenChange ?? setOpen

  return (
    <ComboboxContext.Provider
      value={{
        open: isOpen,
        setOpen: setIsOpen,
        value,
        onValueChange,
        inputValue,
        onInputValueChange,
      }}
    >
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setIsOpen} {...props}>
        <CommandPrimitive
          value={value}
          onValueChange={onValueChange}
          shouldFilter={shouldFilter}
          className="relative"
        >
          {children}
        </CommandPrimitive>
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  )
})
Combobox.displayName = "Combobox"

function ComboboxValue({ className, ...props }: React.ComponentProps<"span">) {
  const { value } = useComboboxContext()
  return (
    <span data-slot="combobox-value" className={cn("truncate", className)} {...props}>
      {value}
    </span>
  )
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-3.5", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className="pointer-events-none size-3.5 text-muted-foreground" />
    </PopoverPrimitive.Trigger>
  )
}

function ComboboxClear({ className, disabled, size, variant, ...props }: React.ComponentProps<typeof Button>) {
  const { onValueChange, onInputValueChange } = useComboboxContext()
  return (
    <InputGroupButton
      variant="ghost"
      size="icon-xs"
      data-slot="combobox-clear"
      className={cn(className)}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onValueChange?.("")
        onInputValueChange?.("")
      }}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </InputGroupButton>
  )
}

const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    showTrigger?: boolean
    showClear?: boolean
  }
>(({ className, children, disabled = false, showTrigger = true, showClear = false, ...props }, ref) => {
  const { inputValue, onInputValueChange, setOpen } = useComboboxContext()

  return (
    <PopoverPrimitive.Anchor asChild>
      <InputGroup className={cn("w-auto bg-transparent", className)}>
        <CommandPrimitive.Input
          ref={ref}
          value={inputValue}
          onValueChange={onInputValueChange}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
        <InputGroupAddon align="inline-end">
          {showTrigger && (
            <InputGroupButton
              size="icon-xs"
              variant="ghost"
              asChild
              data-slot="input-group-button"
              className="data-pressed:bg-transparent"
              disabled={disabled}
            >
              <ComboboxTrigger />
            </InputGroupButton>
          )}
          {showClear && <ComboboxClear disabled={disabled} />}
        </InputGroupAddon>
        {children}
      </InputGroup>
    </PopoverPrimitive.Anchor>
  )
})
ComboboxInput.displayName = "ComboboxInput"

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { anchor?: any }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        data-slot="combobox-content"
        className={cn(
          "group/combobox-content z-50 relative max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] min-w-[calc(var(--radix-popover-trigger-width)+--spacing(7))] origin-[var(--radix-popover-content-transform-origin)] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-[var(--radix-popover-trigger-width)] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-7 *:data-[slot=input-group]:border-none *:data-[slot=input-group]:bg-input/20 *:data-[slot=input-group]:shadow-none dark:bg-popover data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--radix-popover-content-available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  const { value: contextValue, onValueChange, setOpen } = useComboboxContext()
  const isSelected = contextValue === value

  return (
    <CommandPrimitive.Item
      data-slot="combobox-item"
      value={value}
      onSelect={(currentValue) => {
        onValueChange?.(currentValue)
        setOpen(false)
      }}
      className={cn(
        "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground not-data-[variant=destructive]:data-[selected='true']:**:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {children}
      {isSelected && (
        <span className="pointer-events-none absolute right-2 flex items-center justify-center">
          <CheckIcon className="pointer-events-none" />
        </span>
      )}
    </CommandPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="combobox-group"
      className={cn("overflow-hidden p-1 text-foreground", className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}
      {...props}
    />
  )
}

function ComboboxCollection({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="combobox-collection" className={className} {...props} />
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "w-full justify-center py-2 text-center text-xs/relaxed text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border/50", className)}
      {...props}
    />
  )
}

function ComboboxChips({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-7 flex-wrap items-center gap-1 rounded-md border border-input bg-input/20 bg-clip-padding px-2 py-0.5 text-xs/relaxed transition-colors",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: React.ComponentProps<"div"> & { showRemove?: boolean }) {
  return (
    <div
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(4.75))] w-fit items-center justify-center gap-1 rounded-[calc(var(--radius-sm)-2px)] bg-muted-foreground/10 px-1.5 text-xs/relaxed font-medium whitespace-nowrap text-foreground",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <Button variant="ghost" size="icon-xs" className="-ml-1 opacity-50 hover:opacity-100">
          <XIcon className="pointer-events-none" />
        </Button>
      )}
    </div>
  )
}

function ComboboxChipsInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 bg-transparent outline-none", className)}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
