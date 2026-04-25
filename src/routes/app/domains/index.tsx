import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/domains/")({
  component: App,
});

function App() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="font-bold">domains</h1>
      <p className="mt-1 text-sm text-neutral-400">
        a radically simple link shortener.
      </p>
    </div>
  );
}
