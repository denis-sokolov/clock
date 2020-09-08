import { useEffect } from "react";
import { useCrash } from "@theorem/react";

export function useAsyncEffect(f: () => Promise<void>, deps: any[]) {
  const crash = useCrash();
  useEffect(function () {
    f().catch(crash);
  }, deps);
}
