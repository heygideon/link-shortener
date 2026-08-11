import { queryOptions } from "@tanstack/react-query";
import { getLink } from ".";

export const getLinkQuery = (data: { domain: string; key: string }) =>
  queryOptions({
    queryKey: ["edit", "getLink", data],
    queryFn: ({ signal }) => getLink({ data, signal }),
  });
