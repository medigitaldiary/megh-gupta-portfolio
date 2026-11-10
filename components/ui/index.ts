// Single export surface for shared UI primitives. Add a new primitive here
// and import it as `@/components/ui`. Keep the folder flat; one file per
// primitive. Full spec lives in `design-system/02-components.md`.

export type { ButtonSize, ButtonVariant } from "./button";
export { Button, ButtonLink } from "./button";
export type { IconButtonSize, IconButtonVariant } from "./icon-button";
export { IconButton } from "./icon-button";
export type { TagVariant } from "./tag";
export { Tag } from "./tag";
