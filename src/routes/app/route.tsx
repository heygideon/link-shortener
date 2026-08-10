import UserDropdown from "#/components/app/UserDropdown";
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
  async beforeLoad({ context }) {
    if (!context.user) {
      throw redirect({ to: "/" });
    }
    return { user: context.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
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
          <UserDropdown />
        </div>
      </header>
      <div className="mx-auto max-w-4xl">
        <Outlet />
      </div>
    </>
  );
}
