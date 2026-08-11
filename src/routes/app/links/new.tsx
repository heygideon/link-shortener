import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createLink } from "#/actions/new";
import { createLinkSchema } from "#/actions/new/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "#/components/ui/Select";
import { genLinkKey } from "#/lib/link";
import { getDomainsQuery } from "#/actions/domains/queries";
import FormMessage from "#/components/form/FormMessage";
import { Field } from "#/components/ui/Field";
import { Button, LinkButton } from "#/components/ui/Button";

export const Route = createFileRoute("/app/links/new")({
  async loader({ context: { queryClient } }) {
    await queryClient.ensureQueryData(getDomainsQuery());
    return { defaultKey: genLinkKey() };
  },
  component: App,
});

function App() {
  const navigate = Route.useNavigate();
  const { defaultKey } = Route.useLoaderData();

  const { data: domains } = useSuspenseQuery(getDomainsQuery());

  const { mutateAsync, error } = useMutation({
    mutationFn: createLink,
    async onSuccess() {
      await navigate({
        to: "/app/links",
        search: {
          sort: "newest-first",
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      domain: domains[0]?.domain || "",
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
      <LinkButton
        from={Route.fullPath}
        to=".."
        color="neutral"
        className="mb-1.5"
      >
        [back]
      </LinkButton>
      <h1 className="font-bold">new link</h1>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-6"
      >
        {error && <FormMessage state="error">{error.message}</FormMessage>}

        <div className="flex gap-2">
          <form.Field name="domain">
            {(field) => (
              <Field.Root>
                <Field.Label>domain</Field.Label>

                <Select
                  value={field.state.value}
                  onValueChange={(v) => field.handleChange(v || "")}
                >
                  <SelectTrigger className="w-44" />
                  <SelectContent>
                    {domains.map(({ domain }) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Field.Error field={field} />
              </Field.Root>
            )}
          </form.Field>
          <form.Field name="key">
            {(field) => (
              <Field.Root className="min-w-0 flex-1">
                <Field.Label>short url</Field.Label>
                <div className="relative">
                  <Field.Control
                    value={field.state.value}
                    onValueChange={(v) => field.handleChange(v)}
                    placeholder={defaultKey}
                    className="pl-4"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex w-4 items-center justify-end text-sm text-neutral-400">
                    /
                  </div>
                </div>
                <Field.Error field={field} />
              </Field.Root>
            )}
          </form.Field>
        </div>

        <form.Field name="url">
          {(field) => (
            <Field.Root>
              <Field.Label>destination url</Field.Label>
              <Field.Control
                value={field.state.value}
                onValueChange={(v) => field.handleChange(v)}
                placeholder="https://google.com"
              />
              <Field.Error field={field} />
            </Field.Root>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => !state.isSubmitting && state.canSubmit}
        >
          {(canSubmit) => (
            <Button type="submit" disabled={!canSubmit} className="mt-6">
              [submit]
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
