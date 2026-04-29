import { queryOptions } from "@tanstack/react-query";
import { getUser } from ".";

export const getUserQuery = () =>
  queryOptions({
    queryKey: ["auth", "getUser"],
    queryFn: ({ signal }) => getUser({ signal }),
  });
