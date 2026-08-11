import { Field as BaseField } from "@base-ui/react/field";
import clsx from "clsx";
import { input } from "./Input";

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
function Error({ match = true, className, ...props }: BaseField.Error.Props) {
  return (
    <BaseField.Error
      {...props}
      match={match}
      className={clsx("mt-1.5 text-xs text-red-300", className)}
    />
  );
}

export const Field = {
  Root,
  Label,
  Control,
  Description,
  Error,
};
