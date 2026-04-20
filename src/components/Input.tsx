import clsx from "clsx";
import type { ComponentProps } from "react";

export default function Input({
  className,
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={clsx(
        "h-8 w-full border border-neutral-700 px-2 text-sm ring-amber-300 outline-none focus:border-amber-300 focus:ring-1",
        className,
      )}
    />
  );
}
