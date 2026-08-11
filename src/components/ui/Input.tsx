import { Input as BaseInput } from "@base-ui/react/input";
import { cva } from "cva";

export const input = cva({
  base: "h-8 w-full border border-neutral-700 px-2 text-sm ring-amber-300 outline-none placeholder:text-neutral-400 focus:border-amber-300 focus:ring-1",
});

export default function Input({ className, ...props }: BaseInput.Props) {
  return <BaseInput {...props} className={input({ className })} />;
}
