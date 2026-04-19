import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { MousePointerClickIcon } from "lucide-react";
import { withoutProtocol } from "ufo";
import { getLinksQuery } from "#/actions/home/queries";

export const Route = createFileRoute("/")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(getLinksQuery());
	},
	component: App,
});

function App() {
	const { data: links } = useSuspenseQuery(getLinksQuery());

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="font-bold">link shortener</h1>
			<p className="mt-1 text-neutral-600 text-sm dark:text-neutral-400">
				a radically simple link shortener.
			</p>
			<div className="mt-8">
				<h1 className="font-bold">your urls</h1>
				<div className="mt-2 border-t border-neutral-300 dark:border-neutral-700">
					{links.map((link) => (
						<div
							key={link.id}
							className="py-3 border-b border-inherit flex gap-3"
						>
							<div className="size-5 grid place-items-center border border-neutral-300 dark:border-neutral-700">
								<span className="leading-none text-xs text-neutral-600 dark:text-neutral-400">
									x
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex text-sm">
									<p>
										{link.domain}/{link.key}
									</p>
									<div className="flex-1"></div>
									<p className="bg-pink-700 font-bold text-white px-1.5">
										tag-1
									</p>
									<div className="h-5 border border-neutral-300 flex items-center text-neutral-600 dark:text-neutral-400 dark:border-neutral-700 ml-1.5 px-1 gap-0.5">
										<MousePointerClickIcon className="size-4" />
										<span>{link.clicks}</span>
									</div>
								</div>
								<div className="flex text-xs mt-1.5">
									<p className="text-neutral-600 dark:text-neutral-400">
										-&gt; {withoutProtocol(link.url)} {"//"} created{" "}
										{dayjs(link.createdAt).format("YYYY-MM-DD")}
									</p>
									<div className="flex-1"></div>
									<div className="flex gap-1 items-center">
										<span className="text-amber-700 hover:text-white hover:bg-amber-700 dark:hover:bg-amber-300 dark:hover:text-black dark:text-amber-300">
											[view]
										</span>
										<span className="text-amber-700 hover:text-white hover:bg-amber-700 dark:hover:bg-amber-300 dark:hover:text-black dark:text-amber-300">
											[edit]
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
