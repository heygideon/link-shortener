import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from ".";

export const getCurrentUserQuery = () =>
  queryOptions({
    queryKey: ["auth", "getCurrentUser"],
    queryFn: ({ signal }) => getCurrentUser({ signal }),
  });
