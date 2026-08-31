import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import clsx from "clsx";

export default function Fieldset({
  legend,
  className,
  ...props
}: BaseFieldset.Root.Props & { legend: string }) {
  return (
    <BaseFieldset.Root {...props} className={clsx("border border-neutral-700")}>
      <BaseFieldset.Legend className="border-b border-inherit bg-neutral-800 px-4 py-1.5 text-xs text-neutral-400">
        {legend}
      </BaseFieldset.Legend>
      <div className="space-y-6 p-4">{props.children}</div>
    </BaseFieldset.Root>
  );
}
