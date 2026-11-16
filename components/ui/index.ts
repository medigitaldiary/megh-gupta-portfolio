// Single export surface for shared UI primitives. Add a new primitive here
// and import it as `@/components/ui`. Keep the folder flat; one file per
// primitive. Full spec lives in `design-system/02-components.md`.

export type { ButtonSize, ButtonVariant } from "./button";
export { Button, ButtonLink, buttonStyles } from "./button";
export type { IconButtonSize, IconButtonVariant } from "./icon-button";
export { IconButton } from "./icon-button";
export type { TagVariant } from "./tag";
export { Tag } from "./tag";
export type {
  TextLinkDirection,
  TextLinkSize,
  TextLinkWeight,
} from "./text-link";
export { CtaArrow, TextLink, TextLinkButton } from "./text-link";
