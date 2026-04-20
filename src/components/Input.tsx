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
				"h-8 w-full border border-dim input px-2 text-sm",
				className,
			)}
		/>
	);
}
