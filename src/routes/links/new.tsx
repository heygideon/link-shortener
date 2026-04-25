import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { createLink } from "#/actions/new";
import { createLinkSchema } from "#/actions/new/schema";
import Input from "#/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "#/components/Select";
import { genLinkKey } from "#/lib/link";

const domains = ["heya.gdn"];

export const Route = createFileRoute("/links/new")({
  loader() {
    return { defaultKey: genLinkKey() };
  },
  component: App,
});

function App() {
  const navigate = Route.useNavigate();
  const { defaultKey } = Route.useLoaderData();

  const { mutateAsync, error } = useMutation({
    mutationFn: createLink,
    async onSuccess() {
      await navigate({
        to: "/links",
        search: {
          sort: "newest-first",
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      domain: "",
      key: "",
      url: "",
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: createLinkSchema,
    },
    async onSubmit({ value }) {
      await mutateAsync({ data: { ...value, key: value.key || defaultKey } });
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link
        to="/links"
        className="mb-1.5 block w-fit text-sm text-neutral-400 hover:bg-neutral-400 hover:text-black"
      >
        [back]
      </Link>
      <h1 className="font-bold">new link</h1>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-6"
      >
        {error && (
          <div className="bg-red-900 p-2 px-2.5 text-sm">
            <p>[!] {error.message}</p>
          </div>
        )}
        <form.Field name="url">
          {(field) => (
            <div>
              <p className="text-sm">redirect url</p>
              <Input
                value={field.state.value}
                onChange={(ev) => field.handleChange(ev.target.value)}
                placeholder="https://google.com"
                className="mt-1.5"
              />
              {field.state.meta.errors[0] && (
                <p className="mt-1.5 text-xs text-red-300">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <div>
          <p className="text-sm">short link</p>
          <div className="mt-1.5 flex gap-2">
            <form.Field name="domain">
              {(field) => (
                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v || "")}
                >
                  <SelectTrigger className="w-44" />
                  <SelectContent>
                    {domains.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </form.Field>
            <form.Field name="key">
              {(field) => (
                <div className="relative min-w-0 flex-1">
                  <Input
                    value={field.state.value}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    placeholder={defaultKey}
                    className="pl-4"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-4 items-center justify-end text-sm text-neutral-400">
                    /
                  </div>
                </div>
              )}
            </form.Field>
          </div>
        </div>

        <form.Subscribe
          selector={(state) => !state.isSubmitting && state.canSubmit}
        >
          {(canSubmit) => (
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 block w-fit text-sm text-amber-300 hover:bg-amber-300 hover:text-black disabled:bg-transparent disabled:text-neutral-600"
            >
              [submit]
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
