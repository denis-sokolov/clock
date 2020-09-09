import { useEffect } from "react";
import { useCrash } from "@theorem/react";

export function useAsyncEffect(
  f: (params: { cancelled: boolean }) => Promise<void | (() => void)>,
  deps: any[]
) {
  const crash = useCrash();
  useEffect(function () {
    const obj = {
      cancelled: false,
    };
    let queuedCancellation = () => {};
    f(obj)
      .then((res) => {
        if (!res) return;
        if (obj.cancelled) queuedCancellation();
        else queuedCancellation = res;
      })
      .catch(crash);
    return () => {
      obj.cancelled = true;
      queuedCancellation();
    };
  }, deps);
}
