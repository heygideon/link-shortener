import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/_app/analytics/")({
  head: () => ({
    meta: [
      {
        title: "analytics - link shortener",
      },
    ],
  }),
  component: App,
});

function App() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <p className="text-sm text-neutral-600">coming soon!</p>
    </div>
  );
}
