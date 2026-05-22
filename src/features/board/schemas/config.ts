import { z } from "zod";

export const AVAILABLE_SLIDES = [
  { id: "product_1", label: "Artisan Double Smash (Highlight)" },
  { id: "product_2", label: "Spicy Crispy Chicken (Highlight)" },
  { id: "drinks", label: "Signature House Drinks (Drinks Showcase)" },
  { id: "product_3", label: "Loaded Bacon Fries (Highlight)" },
  { id: "grid_sides", label: "Sides & Sharable Boards (Grid Showcase)" },
  { id: "desserts", label: "Artisanal Dessert Selections (Dessert Showcase)" },
  { id: "salads", label: "Garden Bowls & Greens (Salad Showcase)" },
  { id: "video", label: "YouTube Video Interstitial" },
];

export const boardConfigSchema = z.object({
  slideDuration: z.number().min(3, "Min 3s").max(120, "Max 120s"),
  youtubeUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  playlistOrder: z.array(z.string()).default(AVAILABLE_SLIDES.map(s => s.id)),
  enabledSlides: z.record(z.string(), z.boolean()).default(
    AVAILABLE_SLIDES.reduce((acc, s) => ({ ...acc, [s.id]: s.id !== "video" }), {})
  ),
  interleaveVideo: z.boolean().default(false),
});

export type BoardConfig = z.infer<typeof boardConfigSchema>;

