import { getDomainsQuery } from "#/actions/domains/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { LinkIcon } from "lucide-react";

export const Route = createFileRoute("/app/domains/")({
  async loader({ context: { queryClient } }) {
    await queryClient.ensureQueryData(getDomainsQuery());
  },
  component: App,
});

function App() {
  const { data: domains } = useSuspenseQuery(getDomainsQuery());

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="font-bold">domains</h1>

      <div className="mt-2 border-t border-neutral-700">
        {domains.map((domain) => (
          <div
            key={domain.domain}
            className="flex gap-3 border-b border-inherit py-3"
          >
            <div className="grid size-5 place-items-center border border-neutral-700">
              <span className="text-xs leading-none text-neutral-400">x</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex text-sm">
                <p>{domain.domain}</p>
                <div className="flex-1"></div>
                <div className="ml-1.5 flex h-5 items-center gap-1 border border-neutral-700 px-1 text-neutral-400">
                  <LinkIcon className="size-4" />
                  <span>{domain.links}</span>
                </div>
              </div>
              <div className="mt-1.5 flex text-xs">
                <p className="text-neutral-400">
                  created {dayjs(domain.createdAt).format("YYYY-MM-DD")}
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
  );
}
