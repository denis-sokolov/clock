import { useEffect } from "react";
import { useCrash } from "@theorem/react";

export function useAsyncEffect(
  f: (params: { cancelled: () => boolean }) => Promise<void>,
  deps: any[]
) {
  const crash = useCrash();
  useEffect(function () {
    let cancelled = false;
    f({ cancelled: () => cancelled }).catch(crash);
    return () => {
      cancelled = true;
    };
  }, deps);
}
