import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import clsx from "clsx";
import { cva } from "cva";
import type { ComponentProps } from "react";
import RenderLinkKey from "../app/RenderLinkKey";

export const input = cva({
  base: "h-8 w-full border border-neutral-700 px-2 text-sm ring-amber-300 outline-none placeholder:text-neutral-400 disabled:text-neutral-400 disabled:bg-neutral-800 focus:border-amber-300 focus:ring-1",
});

export default function Input({ className, ...props }: BaseInput.Props) {
  return <BaseInput {...props} className={input({ className })} />;
}

interface ParamsInputProps extends ComponentProps<"div"> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

export function ParamsInput({
  value,
  onValueChange,
  className,
  placeholder,
  ...props
}: ParamsInputProps) {
  return (
    <div
      {...props}
      className={clsx(
        "relative h-8 w-full border border-neutral-700 px-2 text-sm ring-amber-300 outline-none focus-within:border-amber-300 focus-within:ring-1 disabled:bg-neutral-800 disabled:text-neutral-400",
        className,
      )}
    >
      <div className="scrollbar-hidden relative isolate size-full overflow-x-auto">
        <Field.Control
          value={value}
          onValueChange={onValueChange}
          placeholder={placeholder}
          className="field-sizing-content h-full min-w-full text-transparent caret-white outline-none placeholder:text-neutral-400"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 flex h-full items-center whitespace-nowrap">
          <RenderLinkKey>{value || ""}</RenderLinkKey>
        </div>
      </div>
    </div>
  );
}
