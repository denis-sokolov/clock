import { useEffect } from "react";
import { useCrash } from "@theorem/react";

export function useAsyncEffect(
  f: (params: { cancelled: () => boolean }) => Promise<void | (() => void)>,
  deps: any[]
) {
  const crash = useCrash();
  useEffect(function () {
    let cancelled = false;
    let queuedCancellation = () => {};
    f({ cancelled: () => cancelled })
      .then((res) => {
        if (!res) return;
        if (cancelled) queuedCancellation();
        else queuedCancellation = res;
      })
      .catch(crash);
    return () => {
      cancelled = true;
      queuedCancellation();
    };
  }, deps);
}
