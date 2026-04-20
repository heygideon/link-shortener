import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { MousePointerClickIcon } from "lucide-react";
import { withoutProtocol } from "ufo";
import { getLinksQuery } from "#/actions/home/queries";
import Input from "#/components/Input";

import SortSelect from "#/components/SortSelect";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getLinksQuery());
  },
  component: App,
});

function App() {
  const { data: links } = useSuspenseQuery(getLinksQuery());

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="font-bold">link shortener</h1>
      <p className="mt-1 text-sm text-neutral-400">
        a radically simple link shortener.
      </p>
      <div className="mt-8">
        <div className="flex justify-between gap-2">
          <h1 className="font-bold">your urls</h1>
          <span className="text-amber-300 hover:bg-amber-300 hover:text-black">
            [+ shorten]
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <Input placeholder="search..." className="min-w-0 flex-1" />
          <SortSelect />
        </div>
        <div className="mt-2 border-t border-neutral-700">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex gap-3 border-b border-inherit py-3"
            >
              <div className="grid size-5 place-items-center border border-neutral-700">
                <span className="text-xs leading-none text-neutral-400">x</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex text-sm">
                  <p>
                    {link.domain}/{link.key}
                  </p>
                  <div className="flex-1"></div>
                  <p className="bg-pink-700 px-1.5 font-bold text-white">
                    tag-1
                  </p>
                  <div className="ml-1.5 flex h-5 items-center gap-1 border border-neutral-700 px-1 text-neutral-400">
                    <MousePointerClickIcon className="size-4" />
                    <span>{link.clicks}</span>
                  </div>
                </div>
                <div className="mt-1.5 flex text-xs">
                  <p className="text-neutral-400">
                    -&gt; {withoutProtocol(link.url)} {"//"} created{" "}
                    {dayjs(link.createdAt).format("YYYY-MM-DD")}
                  </p>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 hover:bg-amber-300 hover:text-black">
                      [view]
                    </span>
                    <span className="text-amber-300 hover:bg-amber-300 hover:text-black">
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
