import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MousePointerClickIcon } from "lucide-react";
import { useMemo } from "react";
import { withoutProtocol } from "ufo";
import { z } from "zod";
import type { getLinks } from "#/actions/home";
import { getLinksQuery } from "#/actions/home/queries";
import RenderLinkKey from "#/components/app/RenderLinkKey";
import { Button, LinkButton } from "#/components/ui/Button";
import Input from "#/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "#/components/ui/Select";

dayjs.extend(relativeTime);

type LinkItem = Awaited<ReturnType<typeof getLinks>>[number];
interface SortOption {
  value: string;
  label: string;
  sort: (a: LinkItem, b: LinkItem) => number;
}

const sortOptions = [
  {
    value: "newest-first",
    label: "newest first",
    sort(a, b) {
      return dayjs(b.createdAt).diff(a.createdAt);
    },
  },
  {
    value: "oldest-first",
    label: "oldest first",
    sort(a, b) {
      return dayjs(a.createdAt).diff(b.createdAt);
    },
  },
  {
    value: "a-z",
    label: "a-z",
    sort(a, b) {
      return a.domain.localeCompare(b.domain) || a.key.localeCompare(b.key);
    },
  },
  {
    value: "z-a",
    label: "z-a",
    sort(a, b) {
      return b.domain.localeCompare(a.domain) || b.key.localeCompare(a.key);
    },
  },
  {
    value: "most-clicks",
    label: "most clicks",
    sort(a, b) {
      return b.clicks - a.clicks;
    },
  },
  {
    value: "least-clicks",
    label: "least clicks",
    sort(a, b) {
      return a.clicks - b.clicks;
    },
  },
] as const satisfies SortOption[];
const sortValues = sortOptions.map((opt) => opt.value);

export const Route = createFileRoute("/app/_app/links/")({
  validateSearch: z.object({
    sort: z.enum(sortValues).default("newest-first").catch("newest-first"),
    search: z.string().optional().catch(undefined),
  }),
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(getLinksQuery());
  },
  component: App,
});

function App() {
  const { data: links } = useSuspenseQuery(getLinksQuery());
  const { sort, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const sortedLinks = useMemo(() => {
    const sortOption =
      sortOptions.find((opt) => opt.value === sort) || sortOptions[0];

    return links
      .filter((link) => {
        if (!search) return true;
        return [link.domain, "/", link.key].join("").includes(search);
      })
      .sort(sortOption.sort);
  }, [links, sort, search]);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="font-bold">link shortener</h1>
      <p className="mt-1 text-sm text-neutral-400">
        a radically simple link shortener.
      </p>
      <div className="mt-8">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="font-bold">your urls</h1>
          <LinkButton to="/app/links/new">[+ shorten]</LinkButton>
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            defaultValue={search}
            onValueChange={(v) => {
              navigate({
                search: (s) => ({ ...s, search: v }),
                resetScroll: false,
              });
            }}
            placeholder="search..."
            className="min-w-0 flex-1"
          />
          <Select<(typeof sortOptions)[number]>
            items={sortOptions}
            value={sortOptions.find((opt) => opt.value === sort)}
            onValueChange={(opt) => {
              if (!opt) return;
              navigate({
                search: (s) => ({ ...s, sort: opt.value }),
                resetScroll: false,
              });
            }}
          >
            <SelectTrigger className="w-44" />
            <SelectContent>
              {sortOptions.map((item) => (
                <SelectItem key={item.value} value={item}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 border-t border-neutral-700">
          {sortedLinks.map((link) => (
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
                    {link.domain}/<RenderLinkKey>{link.key}</RenderLinkKey>
                  </p>
                  <div className="flex-1"></div>
                  <p className="bg-pink-700 px-1.5 font-bold text-white">
                    tag-1
                  </p>
                  <div
                    className={clsx(
                      "ml-1.5 flex h-5 items-center gap-1 border border-neutral-700 px-1.5 text-neutral-400",
                      !link.clicks && "opacity-50",
                    )}
                  >
                    <MousePointerClickIcon className="size-4" />
                    <span>{link.clicks}</span>
                  </div>
                </div>
                <div className="mt-1.5 flex gap-2 text-xs">
                  <p className="min-w-0 flex-1 truncate text-neutral-400">
                    -&gt;{" "}
                    {link.pattern ? (
                      <RenderLinkKey>{withoutProtocol(link.url)}</RenderLinkKey>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        className="transition hover:text-white hover:underline"
                      >
                        {withoutProtocol(link.url)}
                      </a>
                    )}
                  </p>
                  <p
                    title={dayjs(link.createdAt).format("YYYY-MM-DD")}
                    className="flex-none text-neutral-400 underline decoration-dotted underline-offset-2"
                  >
                    {dayjs(link.createdAt).fromNow()}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button size="xs">[view]</Button>
                    <LinkButton
                      to="/app/links/$domain/$"
                      params={{
                        domain: link.domain,
                        _splat: link.key,
                      }}
                      size="xs"
                    >
                      [edit]
                    </LinkButton>
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
