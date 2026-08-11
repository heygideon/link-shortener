import { Button as BaseButton } from "@base-ui/react/button";
import { createLink } from "@tanstack/react-router";
import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import type { Merge } from "type-fest";

export const button = cva({
  base: "block w-fit text-sm hover:text-black disabled:bg-transparent disabled:text-neutral-600",
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
    },
    color: {
      amber: "text-amber-300 hover:bg-amber-300",
      red: "text-red-300 hover:bg-red-300",
      neutral: "text-neutral-400 hover:bg-neutral-400",
    },
  },
  defaultVariants: {
    size: "sm",
    color: "amber",
  },
});

export function Button({
  size,
  color,
  className,
  ...props
}: Merge<BaseButton.Props, VariantProps<typeof button>>) {
  return (
    <BaseButton {...props} className={button({ size, color, className })} />
  );
}

function _LinkButton({
  size,
  color,
  className,
  ...props
}: Merge<ComponentProps<"a">, VariantProps<typeof button>>) {
  return <a {...props} className={button({ size, color, className })} />;
}
export const LinkButton = createLink(_LinkButton);
