import { revalidateLogic, useForm } from "@tanstack/react-form";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "#/components/ui/Select";
import { getDomainsQuery } from "#/actions/domains/queries";
import FormMessage from "#/components/form/FormMessage";
import { Field } from "#/components/ui/Field";
import { getLinkQuery } from "#/actions/edit/queries";
import { editLinkSchema } from "#/actions/edit/schema";
import { deleteLink, editLink } from "#/actions/edit";
import { Button, LinkButton } from "#/components/ui/Button";

export const Route = createFileRoute("/app/links/$domain/$")({
  async loader({ params, context: { queryClient } }) {
    await Promise.all([
      queryClient.ensureQueryData(getDomainsQuery()),
      queryClient.ensureQueryData(
        getLinkQuery({ domain: params.domain, key: params._splat || "" }),
      ),
    ]);
  },
  component: App,
});

function DeleteButton() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();

  const { data: link } = useSuspenseQuery(
    getLinkQuery({ domain: params.domain, key: params._splat || "" }),
  );

  const { mutate, isPending } = useMutation({
    mutationFn: deleteLink,
    async onSuccess() {
      await navigate({
        to: "/app/links",
        search: {
          sort: "newest-first",
        },
      });
    },
  });

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          confirm(
            "This will delete this link and any analytics data, which could break existing links. Are you sure?",
          )
        ) {
          mutate({ data: { id: link.id } });
        }
      }}
      color="red"
    >
      [delete]
    </Button>
  );
}

function App() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();

  const { data: domains } = useSuspenseQuery(getDomainsQuery());
  const { data: link } = useSuspenseQuery(
    getLinkQuery({ domain: params.domain, key: params._splat || "" }),
  );

  const { mutateAsync, error } = useMutation({
    mutationFn: editLink,
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
      domain: link.domain,
      key: link.key,
      url: link.url,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: editLinkSchema,
    },
    async onSubmit({ value }) {
      await mutateAsync({
        data: { ...value, id: link.id },
      });
    },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-1.5 flex justify-between">
        <LinkButton from={Route.fullPath} to="../.." color="neutral">
          [back]
        </LinkButton>
        <DeleteButton />
      </div>
      <h1 className="font-bold">
        editing {link.domain}/{link.key}
      </h1>

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
