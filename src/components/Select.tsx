import { Select as SelectPrimitive } from "@base-ui/react/select";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";

const Select = SelectPrimitive.Root;

function SelectTrigger({ className, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={clsx(
        "flex h-8 w-44 items-center justify-between border border-neutral-700 px-2 text-neutral-400 ring-amber-300 outline-none focus:border-amber-300 focus:ring-1",
        className,
      )}
    >
      <SelectPrimitive.Value className="text-sm" />
      <ChevronDownIcon className="size-3" />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Popup
          {...props}
          className={clsx(
            "relative min-w-(--anchor-width) border border-neutral-700 bg-neutral-900 outline-4 outline-neutral-900 data-[side=none]:min-w-[calc(var(--anchor-width)+1.5rem)]",
            className,
          )}
        >
          <SelectPrimitive.ScrollUpArrow className="inset-x-0 top-0 z-1 flex h-4 w-full items-center justify-center bg-inherit" />
          <SelectPrimitive.List className="scroll-py-6 overflow-y-auto p-1 text-sm">
            {children}
          </SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow className="inset-x-0 top-0 z-1 flex h-4 w-full items-center justify-center bg-inherit" />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={clsx(
        "flex items-center gap-1.5 p-1 outline-none data-highlighted:bg-white data-highlighted:text-neutral-900",
        className,
      )}
    >
      <div className="grid size-4 place-items-center">
        <SelectPrimitive.ItemIndicator className="contents">
          <div className="size-1.5 bg-current"></div>
        </SelectPrimitive.ItemIndicator>
      </div>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectTrigger, SelectContent, SelectItem };
