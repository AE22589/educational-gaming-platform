"use client";

import { useCallback, useEffect, useRef } from "react";

export function usePronunciation() {
  const current = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    current.current?.pause();
    current.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback((path?: string) => {
    if (!path) return;
    stop();
    const clip = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`);
    current.current = clip;
    void clip.play().catch(() => {});
  }, [stop]);

  return { play, stop };
}
