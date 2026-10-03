import {
    BookOpen,
    Dumbbell,
    Flower2,
    Headphones,
    Lamp,
    Shirt,
    Tag,
    type LucideIcon,
} from "lucide-react";

// Line icons per category. Matched on the slug so renamed categories keep their icon
// as long as the slug contains the keyword; anything else falls back to a tag.
const ICONS: Array<[RegExp, LucideIcon]> = [
    [/beauty|skin|care|cosmetic/, Flower2],
    [/book|media/, BookOpen],
    [/cloth|fashion|wear|apparel/, Shirt],
    [/electronic|gadget|tech/, Headphones],
    [/home|living|decor|kitchen/, Lamp],
    [/sport|outdoor|fitness/, Dumbbell],
];

export function categoryIcon(slug: string): LucideIcon {
    return ICONS.find(([re]) => re.test(slug))?.[1] ?? Tag;
}
