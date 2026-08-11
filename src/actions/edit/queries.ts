import { queryOptions } from "@tanstack/react-query";
import { getLink } from ".";

export const getLinkQuery = (data: { domain: string; key: string }) =>
  queryOptions({
    queryKey: ["edit", "getLink"],
    queryFn: ({ signal }) => getLink({ data, signal }),
  });
