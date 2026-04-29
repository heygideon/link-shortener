import { getUser } from "#/actions/auth";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

const nav = [
  { label: "links", value: "/app/links" },
  { label: "domains", value: "/app/domains" },
  { label: "analytics", value: "/app/analytics" },
] as const;

export const Route = createFileRoute("/app")({
  async beforeLoad({ abortController }) {
    try {
      const user = await getUser({ signal: abortController.signal });
      return { user };
    } catch (_e) {
      if (abortController.signal.aborted) return;
      throw redirect({ to: "/", search: { auth_error: "Not logged in" } });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <header className="h-10 border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto flex h-full max-w-4xl px-8">
          <div className="flex min-w-0 flex-1 gap-4">
            {nav.map((item) => (
              <Link
                key={item.value}
                to={item.value}
                className="-mb-0.5 flex items-center border-b-[3px] text-sm"
                activeProps={{
                  className: "border-white",
                }}
                inactiveProps={{
                  className:
                    "border-transparent text-neutral-500 hover:border-neutral-700",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">{user.firstName}</span>
            <button
              type="button"
              className="grid size-6 place-items-center hover:bg-neutral-700"
            >
              <img
                src={`https://cachet.dunkirk.sh/users/${user.slackId}/r`}
                alt=""
                className="size-5"
              />
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl">
        <Outlet />
      </div>
    </>
  );
}
