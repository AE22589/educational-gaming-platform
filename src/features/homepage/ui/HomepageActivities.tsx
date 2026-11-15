"use client";

import type { ReactNode } from "react";
import { useSelectedGrade } from "../grade-selection";

export function HomepageActivities({ availableGrade, children }: { availableGrade: number; children: ReactNode }) {
  const locked = useSelectedGrade() !== availableGrade;
  return <div className="home-activities" hidden={locked}>{children}</div>;
}
