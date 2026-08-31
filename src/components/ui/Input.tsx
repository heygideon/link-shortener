import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import clsx from "clsx";
import { cva } from "cva";
import DOMPurify from "isomorphic-dompurify";
import { type ComponentProps, useMemo } from "react";

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
  const __html = useMemo(() => {
    const highlighted = (value || "")
      .split("/")
      .map((part) => {
        if (part.includes(":")) {
          if (/^:[A-Za-z0-9_-]+\*?$/.test(part)) {
            return `<span class="text-cyan-300">${part}</span>`;
          }
        }

        return part;
      })
      .join("/");
    return DOMPurify.sanitize(highlighted);
  }, [value]);

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
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: expected usage
          dangerouslySetInnerHTML={{ __html }}
          className="pointer-events-none absolute inset-0 -z-10 flex h-full items-center whitespace-nowrap"
        ></div>
      </div>
    </div>
  );
}
