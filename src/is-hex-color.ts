const HEX_COLOR_RE = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/;

export function isHexColor(value: string): boolean {
  return HEX_COLOR_RE.test(value);
}
