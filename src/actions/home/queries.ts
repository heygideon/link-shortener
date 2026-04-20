import { queryOptions } from "@tanstack/react-query";
import { getLinks } from ".";

export const getLinksQuery = () =>
  queryOptions({
    queryKey: ["home", "getLinks"],
    queryFn: ({ signal }) => getLinks({ signal }),
  });
