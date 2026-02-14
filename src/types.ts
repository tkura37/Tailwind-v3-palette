export type ColorEntry = {
  key: string;
  hex: string;
};

export type ColorGroup = {
  name: string;
  entries: ColorEntry[];
  comment?: string;
};

export type ColorSection = {
  name: string;
  groups: ColorGroup[];
};
