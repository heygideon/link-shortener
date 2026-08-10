import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/")({
  validateSearch: z.object({
    auth_error: z.string().optional(),
  }),
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/app" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth_error } = Route.useSearch();

  return (
    <div className="mx-auto max-w-4xl p-8">
      {auth_error && (
        <div className="mb-4 bg-red-900 p-2 px-2.5 text-sm">
          <p>[!] {auth_error}</p>
        </div>
      )}
      <h1 className="font-bold">link shortener</h1>
      <p className="mt-1 text-sm text-neutral-400">
        a radically simple link shortener.
      </p>
    </div>
  );
}
