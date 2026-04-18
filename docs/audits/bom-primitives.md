# Bill of Materials — DS primitives (locked)

Primitives NEW in src/components/ui/ (F3):

| Name | Purpose | Replaces |
|---|---|---|
| Eyebrow | Mono uppercase label + left-rule + optional pulse dot | 59 hand-rolled eyebrows |
| IconBox | Rounded colored square with icon inside | 4+ ad-hoc icon tiles |
| SegmentedControl | Accessible radiogroup w/ chip styling | WaitlistForm type, QuestionStep |
| Card | Border + radius-card + surface + padding | ~30 ad-hoc card divs |
| FormSection | Numbered form section wrapper | Private ListingForm helper |
| Pill | Non-interactive pill (vs Chip which is interactive) | ListingCard overlays, Hero hint |
| StatusPill | Listing lifecycle pill | Private ListingForm helper |
| Callout | Tip/warn/info colored box | bg-blue-50 in ListingForm, 3 other spots |
| NumField | Numeric input with +/- buttons | Private ListingForm helper |
| Prose | Typography prose wrapper for legal/blog | New — needed for /legal Stripe-level |

Extensions to existing (F3):

- Button: +variant outline-light, +variant coral-outline, +shortcut trailing='arrow'
- Badge: +variant outline-light, +size sm|md, remove raw bg-green-50/bg-red-50
- IconButton: +variant primary|secondary|ghost|subtle
- Skeleton: +shape rect|circle|text|card, +size sm|md|lg|xl

No more primitives added mid-plan. This list is locked.
