import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { LinkIcon } from "lucide-react";
import { useMemo } from "react";
import type { getDomains } from "#/actions/domains";
import { getDomainsQuery } from "#/actions/domains/queries";
import { LinkButton } from "#/components/ui/Button";

export const Route = createFileRoute("/app/_app/domains/")({
  async loader({ context: { queryClient } }) {
    await queryClient.ensureQueryData(getDomainsQuery());
  },
  head: () => ({
    meta: [
      {
        title: "domains - link shortener",
      },
    ],
  }),
  component: App,
});

function DomainsList({
  title,
  domains,
}: {
  title: string;
  domains: Awaited<ReturnType<typeof getDomains>>;
}) {
  return (
    <section>
      <h1 className="font-bold">{title}</h1>

      <div className="mt-2 border-t border-neutral-700">
        {domains.map((domain) => (
          <div
            key={domain.domain}
            className="flex gap-3 border-b border-inherit py-3"
          >
            {/* <div className="grid size-5 place-items-center border border-neutral-700">
              <span className="text-xs leading-none text-neutral-400">x</span>
            </div> */}
            <div className="min-w-0 flex-1">
              <div className="flex text-sm">
                <p>{domain.domain}</p>
                <div className="flex-1"></div>
                <div className="ml-1.5 flex h-5 items-center gap-1 border border-neutral-700 px-1.5 text-neutral-400">
                  <LinkIcon className="size-4" />
                  <span>{domain.links}</span>
                </div>
              </div>
              <div className="mt-1.5 flex gap-2 text-xs">
                <p
                  title={dayjs(domain.createdAt).format("YYYY-MM-DD")}
                  className="flex-none text-neutral-400 underline decoration-dotted underline-offset-2"
                >
                  {dayjs(domain.createdAt).fromNow()}
                </p>
                <div className="flex-1"></div>
                <div className="flex items-center gap-1">
                  <LinkButton
                    to="/app/links"
                    search={{ search: domain.domain }}
                    size="xs"
                  >
                    [view]
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const { data: domains } = useSuspenseQuery(getDomainsQuery());
  const { userDomains, publicDomains } = useMemo(() => {
    return domains.reduce(
      (acc, domain) => {
        if (domain.public) {
          acc.publicDomains.push(domain);
        } else {
          acc.userDomains.push(domain);
        }
        return acc;
      },
      {
        userDomains: [] as typeof domains,
        publicDomains: [] as typeof domains,
      },
    );
  }, [domains]);

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      {userDomains.length > 0 && (
        <DomainsList title="your domains" domains={userDomains} />
      )}
      {publicDomains.length > 0 && (
        <DomainsList title="public domains" domains={publicDomains} />
      )}
    </div>
  );
}
