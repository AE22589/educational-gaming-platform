"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { EMPTY_CONTENT_BUNDLE, ValidatedProfileCatalog } from "../catalog";
import { BrowserSnapshotStore } from "../browser-store";
import { BrowserWriterCoordinator } from "../browser-writer";
import { ProfileService } from "../service";
import type { ProfileStatus } from "../ports";

type ContextValue = { service: ProfileService | null; state: ProfileStatus };
const serverState: ProfileStatus = { status: "loading" };
const noSubscribe = () => () => undefined;
const loading = () => serverState;
const unavailable: ProfileStatus = {
  status: "recovery",
  reason: "unavailable",
  raw: null,
};

const ProfileContext = createContext<ContextValue>({ service: null, state: serverState });

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [service, setService] = useState<ProfileService | null>(null);
  const [bootstrapFailed, setBootstrapFailed] = useState(false);
  const getBootstrapState = () => (bootstrapFailed ? unavailable : serverState);
  const state = useSyncExternalStore(
    service?.subscribe ?? noSubscribe,
    service?.getState ?? getBootstrapState,
    loading,
  );
  useEffect(() => {
    let active = true;
    let next: ProfileService | null = null;
    try {
      // Storage and browser locking APIs are accessed only after hydration.
      const storage = window.localStorage;
      next = new ProfileService(
        new BrowserSnapshotStore(storage),
        new BrowserWriterCoordinator(storage),
        new ValidatedProfileCatalog(EMPTY_CONTENT_BUNDLE),
      );
      void Promise.resolve().then(() => {
        if (!active) return;
        setService(next);
        return next?.initialize();
      });
    } catch {
      void Promise.resolve().then(() => {
        if (active) setBootstrapFailed(true);
      });
    }
    return () => {
      active = false;
      next?.dispose();
    };
  }, []);
  const value = useMemo(() => ({ service, state }), [service, state]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ContextValue {
  return useContext(ProfileContext);
}
