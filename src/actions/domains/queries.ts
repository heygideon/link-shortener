import { queryOptions } from "@tanstack/react-query";
import { getDomains } from ".";

export const getDomainsQuery = () =>
  queryOptions({
    queryKey: ["domains", "getDomains"],
    queryFn: ({ signal }) => getDomains({ signal }),
  });
