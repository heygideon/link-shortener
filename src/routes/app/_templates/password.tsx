import { KeyIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setCookie } from "@tanstack/react-start/server";
import { useState } from "react";
import z from "zod";
import { Button } from "#/components/ui/Button";
import { Field } from "#/components/ui/Field";
import db from "#/db";
import { verifyPlainPassword } from "#/routes/(redirect)/$";

export const Route = createFileRoute("/app/_templates/password")({
  validateSearch: z.object({
    key: z.string(),
    to: z.string().optional(),
  }),
  component: RouteComponent,
});

export const submitPassword = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      key: z.string(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    if (!data.password) {
      throw new Error("Password is required");
    }

    const request = getRequest();
    const domain = new URL(request.url).hostname;

    const link = await db.query.links.findFirst({
      where: {
        domain,
        key: data.key,
      },
    });
    if (!link) {
      throw new Error("Link not found");
    }

    if (!link.password) return;

    if (!(await verifyPlainPassword(link.password, data.password))) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      throw new Error("Invalid password");
    }

    setCookie(`${link.key}-password`, link.password, {
      path: "/",
      httpOnly: true,
    });
  });

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [password, setPassword] = useState("");
  const { mutate, isPending, error } = useMutation({
    mutationFn: submitPassword,
    onSuccess: () => {
      navigate({
        to: "/$",
        params: { _splat: search.to || search.key },
        reloadDocument: true,
      });
      return new Promise(() => {});
    },
  });

  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <div className="relative isolate overflow-clip border border-neutral-700 p-4">
        <div className="absolute inset-0 -top-2 -z-10 h-4 rounded-b-[50%] bg-amber-300 blur-3xl"></div>
        <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full border border-neutral-700 bg-neutral-800">
          <KeyIcon className="size-6 text-neutral-400" />
        </div>
        <h1 className="font-bold">password required</h1>
        <p className="mt-1.5 text-xs text-neutral-400">
          this link is password protected. please enter the password to
          continue.
        </p>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            if (!password) return;
            mutate({ data: { key: search.key, password } });
          }}
        >
          <Field.Root className="mt-4 text-left">
            <Field.Label>password</Field.Label>
            <Field.Control
              type="password"
              value={password}
              onValueChange={setPassword}
              placeholder="••••••••"
            />
            {error && <Field.Error>{error.message}</Field.Error>}
          </Field.Root>
          <Button
            type="submit"
            disabled={!password || isPending}
            className="mx-auto mt-4"
          >
            [submit]
          </Button>
        </form>
      </div>
      <p className="mx-auto mt-3 max-w-fit truncate text-xs text-neutral-600 transition hover:text-neutral-400">
        {search.key}
      </p>
    </div>
  );
}
