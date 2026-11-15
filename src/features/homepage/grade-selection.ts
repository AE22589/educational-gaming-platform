"use client";

import { useSyncExternalStore } from "react";

const storageKey = "chispitas-primary-grade";
const changeEvent = "chispitas-grade-change";
let currentGrade: number | null = null;

function subscribe(onChange: () => void) {
  window.addEventListener(changeEvent, onChange);
  return () => window.removeEventListener(changeEvent, onChange);
}

function readGrade() {
  try {
    const saved = window.sessionStorage.getItem(storageKey);
    if (saved) return Number(saved);
  } catch {
    // The choice still works in memory when browser storage is unavailable.
  }
  return currentGrade;
}

export function useSelectedGrade() {
  return useSyncExternalStore(subscribe, readGrade, () => null);
}

export function chooseGrade(grade: number) {
  currentGrade = grade;
  try {
    window.sessionStorage.setItem(storageKey, String(grade));
  } catch {
    // Keep the in-memory choice for the current page session.
  }
  window.dispatchEvent(new Event(changeEvent));
}
