import { Field as BaseField } from "@base-ui/react/field";
import clsx from "clsx";
import { input } from "./Input";
import type { Merge } from "type-fest";
import type { StandardSchemaV1Issue } from "@tanstack/react-form";

const Root = BaseField.Root;

function Label({ className, ...props }: BaseField.Label.Props) {
  return (
    <BaseField.Label
      {...props}
      className={clsx("mb-1.5 block max-w-fit text-xs", className)}
    />
  );
}
function Control({ className, ...props }: BaseField.Control.Props) {
  return <BaseField.Control {...props} className={input({ className })} />;
}
function Description({ className, ...props }: BaseField.Description.Props) {
  return (
    <BaseField.Description
      {...props}
      className={clsx("mt-1.5 text-xs text-neutral-400", className)}
    />
  );
}

type FieldApiLike = {
  state: {
    meta: {
      errors: (StandardSchemaV1Issue | undefined)[];
    };
  };
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: intentional
function Error({
  match = true,
  field,
  className,
  children,
  ...props
}: Merge<BaseField.Error.Props, { field?: FieldApiLike }>) {
  const error = field ? field.state.meta.errors[0]?.message : children;
  if (!error) return null;

  return (
    <BaseField.Error
      {...props}
      match={match}
      className={clsx("mt-1.5 text-xs text-red-300", className)}
    >
      {error}
    </BaseField.Error>
  );
}

export const Field = {
  Root,
  Label,
  Control,
  Description,
  Error,
};
