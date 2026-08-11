import { Menu } from "@base-ui/react/menu";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { logout } from "#/actions/auth";
import { getCurrentUserQuery } from "#/actions/auth/queries";

export default function UserDropdown() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery(getCurrentUserQuery());

  const { mutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/" });
    },
  });

  if (!user) return null;

  return (
    <Menu.Root>
      <Menu.Trigger className="group flex items-center outline-none">
        <div className="-mx-1.5 flex h-6 items-center gap-2 px-1.5 text-neutral-400 group-hover:bg-neutral-400 group-hover:text-black group-focus:bg-neutral-400 group-focus:text-black group-data-popup-open:bg-neutral-400 group-data-popup-open:text-black">
          <span className="text-xs">{user.firstName}</span>
          <img
            src={`https://cachet.dunkirk.sh/users/${user.slackId}/r`}
            alt=""
            className="size-4"
          />
        </div>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={4} alignOffset={-6}>
          <Menu.Popup className="relative w-64 border border-neutral-700 bg-neutral-900 p-3 outline-4 outline-neutral-900">
            <div className="flex items-center gap-3">
              <img
                src={`https://cachet.dunkirk.sh/users/${user.slackId}/r`}
                alt=""
                className="size-8 flex-none"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-neutral-400">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-3 border-t border-neutral-700 pt-3">
              <Menu.Item
                onClick={() => mutate()}
                disabled={isPending}
                closeOnClick={false}
                className="-m-1.5 flex items-center gap-2 p-1.5 outline-none data-disabled:opacity-50 data-highlighted:not-data-disabled:bg-amber-300 data-highlighted:not-data-disabled:text-black"
              >
                <LogOutIcon className="size-4" />
                <p className="text-xs">Logout</p>
              </Menu.Item>
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
