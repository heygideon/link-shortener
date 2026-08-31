import { createFileRoute } from "@tanstack/react-router";
import { ClockFadingIcon } from "lucide-react";
import z from "zod";

export const Route = createFileRoute("/app/_templates/expired")({
  validateSearch: z.object({
    key: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <div className="relative isolate overflow-clip border border-neutral-700 p-4">
        <div className="absolute inset-0 -top-2 -z-10 h-4 rounded-b-[50%] bg-red-300 blur-3xl"></div>
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full border border-neutral-700 bg-neutral-800">
          <ClockFadingIcon className="size-6 text-neutral-400" />
        </div>
        <h1 className="font-bold">link expired</h1>
        <p className="mt-1.5 text-xs text-neutral-400">
          this link has expired. you should contact the owner of the link to get
          a new one.
        </p>
      </div>
      <p className="mt-3 text-xs text-neutral-600 transition hover:text-neutral-400">
        {search.key}
      </p>
    </div>
  );
}
