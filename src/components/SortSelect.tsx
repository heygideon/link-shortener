import { Select } from "@base-ui/react/select";
import { ChevronDownIcon } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

const sortOptions = [
  {
    value: "newest-first",
    label: "newest first",
  },
  {
    value: "oldest-first",
    label: "oldest first",
  },
  {
    value: "a-z",
    label: "a-z",
  },
  {
    value: "z-a",
    label: "z-a",
  },
  {
    value: "most-clicks",
    label: "most clicks",
  },
  {
    value: "least-clicks",
    label: "least clicks",
  },
] satisfies SortOption[];

export default function SortSelect() {
  return (
    <Select.Root
      defaultValue={sortOptions[0]}
      itemToStringValue={(opt) => opt.value}
    >
      <Select.Trigger className="flex h-8 w-44 items-center justify-between border border-neutral-700 px-2 text-neutral-400 ring-amber-300 outline-none focus:border-amber-300 focus:ring-1">
        <Select.Value className="text-sm"></Select.Value>
        <ChevronDownIcon className="size-3" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup className="relative min-w-(--anchor-width) border border-neutral-700 bg-neutral-900 outline-4 outline-neutral-900 data-[side=none]:min-w-[calc(var(--anchor-width)+1.5rem)]">
            <Select.ScrollUpArrow className="inset-x-0 top-0 z-1 flex h-4 w-full items-center justify-center bg-inherit" />
            <Select.List className="scroll-py-6 overflow-y-auto p-1 text-sm">
              {sortOptions.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt}
                  className="flex items-center gap-1.5 p-1 outline-none data-highlighted:bg-white data-highlighted:text-neutral-900"
                >
                  <div className="grid size-4 place-items-center">
                    <Select.ItemIndicator className="contents">
                      <div className="size-1.5 bg-current"></div>
                    </Select.ItemIndicator>
                  </div>
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
            <Select.ScrollDownArrow className="inset-x-0 top-0 z-1 flex h-4 w-full items-center justify-center bg-inherit" />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
