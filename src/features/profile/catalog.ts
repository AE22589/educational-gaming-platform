import {
  contentBundleSchema,
  type ContentBundle,
  type LearningItem,
  type Mission,
} from "@/types/contracts";

export interface ProfileCatalog {
  getMission(id: string, version: string): Mission | null;
  getLearningItem(id: string): LearningItem | null;
}

/** Only validated bundled content may drive profile-side reward decisions. */
export class ValidatedProfileCatalog implements ProfileCatalog {
  private readonly bundle: ContentBundle;
  constructor(input: unknown) {
    this.bundle = contentBundleSchema.parse(input);
  }
  getMission(id: string, version: string): Mission | null {
    return this.bundle.missions.find((m) => m.id === id && m.version === version) ?? null;
  }
  getLearningItem(id: string): LearningItem | null {
    return this.bundle.learningItems.find((item) => item.id === id) ?? null;
  }
}

export const EMPTY_CONTENT_BUNDLE: ContentBundle = {
  contractVersion: 1,
  subjects: [],
  textbooks: [],
  units: [],
  skills: [],
  assets: [],
  learningItems: [],
  missions: [],
  shopItems: [],
};
