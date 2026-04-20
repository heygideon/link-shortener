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
			<Select.Trigger className="h-8 w-44 flex items-center justify-between border border-dim input text-dim px-2">
				<Select.Value className="text-sm"></Select.Value>
				<ChevronDownIcon className="size-3" />
			</Select.Trigger>
			<Select.Portal>
				<Select.Positioner>
					<Select.Popup className="bg-page relative border outline-4 outline-neutral-900 border-dim min-w-(--anchor-width) data-[side=none]:min-w-[calc(var(--anchor-width)+1.5rem)]">
						<Select.ScrollUpArrow className="h-4 top-0 inset-x-0 w-full flex items-center justify-center z-1 bg-inherit" />
						<Select.List className="text-sm scroll-py-6 overflow-y-auto p-1">
							{sortOptions.map((opt) => (
								<Select.Item
									key={opt.value}
									value={opt}
									className="flex items-center p-1 outline-none data-highlighted:bg-white data-highlighted:text-neutral-900 gap-1.5"
								>
									<div className="size-4 grid place-items-center">
										<Select.ItemIndicator className="contents">
											<div className="size-1.5 bg-current"></div>
										</Select.ItemIndicator>
									</div>
									<Select.ItemText>{opt.label}</Select.ItemText>
								</Select.Item>
							))}
						</Select.List>
						<Select.ScrollDownArrow className="h-4 top-0 inset-x-0 w-full flex items-center justify-center  bg-inherit z-1" />
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}
