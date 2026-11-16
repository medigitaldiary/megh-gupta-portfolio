import { useSyncExternalStore } from "react";

// One company picked in the Experience fold, read by the work shelf.
// A module-level value is enough: both folds live on the same page and
// nothing here needs to survive a navigation.

let current: string | null = null;
const listeners = new Set<() => void>();

export function setCompanyFocus(company: string | null) {
  if (company === current) return;
  current = company;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useCompanyFocus() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
