import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import type { Merge } from "type-fest";

const formMessage = cva({
  base: "p-2 px-2.5 text-sm",
  variants: {
    state: {
      error: "border-red-900 bg-red-950 text-red-300",
      success: "border-green-900 bg-green-950 text-green-300",
      warning: "border-yellow-900 bg-yellow-950 text-yellow-300",
    },
  },
  defaultVariants: {
    state: "error",
  },
});

export default function FormMessage({
  state,
  className,
  children,
  ...props
}: Merge<ComponentProps<"div">, VariantProps<typeof formMessage>>) {
  return (
    <div {...props} className={formMessage({ state, className })}>
      [!] {children}
    </div>
  );
}
