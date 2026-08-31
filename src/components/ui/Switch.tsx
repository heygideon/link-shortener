import { Switch as BaseSwitch } from "@base-ui/react/switch";
import clsx from "clsx";

export default function Switch({ className, ...props }: BaseSwitch.Root.Props) {
  return (
    <BaseSwitch.Root
      className={clsx(
        "flex h-5 w-9 border border-neutral-700 p-0.5 transition data-checked:border-amber-300 data-checked:bg-amber-300",
        className,
      )}
      {...props}
    >
      <BaseSwitch.Thumb className="size-3.5 bg-white transition data-checked:translate-x-4 data-checked:bg-neutral-900" />
    </BaseSwitch.Root>
  );
}
