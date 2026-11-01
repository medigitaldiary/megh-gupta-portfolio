export type AboutPrintFrame = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type AboutVoxChapter = {
  id: string;
  kicker: string;
  headline: string;
  highlight: string;
  // Hover slip. Keep at or under 18 words. Center About copy does not change.
  tip: string;
  caption: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  cut: string;
  // Extra shots for this slot. Layout stays at 12 frames; new photos go here.
  frames?: AboutPrintFrame[];
};

export function framesFor(chapter: AboutVoxChapter): AboutPrintFrame[] {
  const primary: AboutPrintFrame = {
    src: chapter.src,
    alt: chapter.alt,
    width: chapter.width,
    height: chapter.height,
  };
  if (!chapter.frames?.length) return [primary];
  return [primary, ...chapter.frames];
}

// Layout is locked at 12 desk slots. Do not append chapters for extra photos —
// add them to `frames` on an existing slot so they fade in place.
export const ABOUT_VOX_CHAPTERS: AboutVoxChapter[] = [
  {
    id: "bike",
    kicker: "01",
    headline: "The GT650.",
    highlight: "GT650",
    tip: "The GT650. Not a collection. New cities at my own pace.",
    caption: "The GT650. Not a collection. New cities at my own pace.",
    src: "/images/about/gt650.webp",
    alt: "Illustrated cut-out of Megh standing over a green GT650 motorcycle in front of a gated house.",
    width: 819,
    height: 1024,
    cut: "a",
  },
  {
    id: "hyrox",
    kicker: "02",
    headline: "HYROX Delhi.",
    highlight: "HYROX",
    tip: "HYROX Delhi. Training as a hybrid athlete. Noida is next.",
    caption: "HYROX Delhi. Training as a hybrid athlete. Noida is next.",
    src: "/images/about/hyrox.webp",
    alt: "Illustrated cut-out of Megh smiling and flexing in a HYROX Delhi shirt after the race.",
    width: 819,
    height: 1024,
    cut: "b",
  },
  {
    id: "horse",
    kicker: "03",
    headline: "A slower afternoon.",
    highlight: "slower",
    tip: "A slower afternoon in the hills. No itinerary.",
    caption: "A slower afternoon in the hills. No itinerary.",
    src: "/images/about/horse.webp",
    alt: "Illustrated cut-out of Megh laughing while riding a horse through tall trees and green hills.",
    width: 819,
    height: 1024,
    cut: "c",
  },
  {
    id: "guitar",
    kicker: "04",
    headline: "Guitar first.",
    highlight: "Guitar",
    tip: "Musician at heart. Guitar first, other instruments when I can.",
    caption: "Musician at heart. Guitar first, other instruments when I can.",
    src: "/images/about/guitar.webp",
    alt: "Illustrated cut-out of Megh playing an acoustic guitar on stage, leaning into a microphone.",
    width: 819,
    height: 1024,
    cut: "d",
  },
  {
    id: "camera",
    kicker: "05",
    headline: "Keep the days.",
    highlight: "days",
    tip: "Shooting the days I actually want to keep.",
    caption: "Shooting the days I actually want to keep.",
    src: "/images/about/camera.webp",
    alt: "Illustrated cut-out of Megh taking a mirror self-portrait with a camera, wearing a red bandana.",
    width: 819,
    height: 1024,
    cut: "e",
  },
  {
    id: "convocation",
    kicker: "06",
    headline: "BITS Goa, 2025.",
    highlight: "Goa",
    tip: "BITS Goa, 2025. Quieter roads. A two-wheeler, no fixed plan.",
    caption: "BITS Goa, 2025. Quieter roads. A two-wheeler, no fixed plan.",
    src: "/images/about/goa-convocation.webp",
    alt: "Illustrated cut-out of Megh in BITS Pilani Goa convocation robes, smiling in front of campus.",
    width: 1024,
    height: 1024,
    cut: "f",
  },
  {
    id: "gym",
    kicker: "07",
    headline: "The other hours.",
    highlight: "hours",
    tip: "Gym selfie. Headphones on. The other product I ship every week.",
    caption: "Gym selfie. Headphones on. The other product I ship every week.",
    src: "/images/about/gym.webp",
    alt: "Illustrated cut-out of Megh in a gym taking a phone mirror selfie, headphones on, striped trousers.",
    width: 818,
    height: 1024,
    cut: "a",
  },
  {
    id: "studio",
    kicker: "08",
    headline: "Studio light.",
    highlight: "Studio",
    tip: "Studio light. Training hours that aren't HYROX.",
    caption: "Studio light. Training hours that aren't HYROX.",
    src: "/images/about/studio-tank.webp",
    alt: "Illustrated cut-out of Megh in a black tank and beige trousers, looking up under studio light.",
    width: 819,
    height: 1024,
    cut: "b",
    frames: [
      {
        src: "/images/about/studio-tank-down.webp",
        alt: "Illustrated cut-out of Megh in a black tank, looking down under studio light.",
        width: 819,
        height: 1024,
      },
      {
        src: "/images/about/studio-tank-over.webp",
        alt: "Illustrated cut-out of Megh in a black tank, glancing over his shoulder.",
        width: 819,
        height: 1024,
      },
      {
        src: "/images/about/studio-tank-back.webp",
        alt: "Illustrated cut-out of Megh from behind in a black tank, studio backdrop.",
        width: 819,
        height: 1024,
      },
    ],
  },
  {
    id: "festive",
    kicker: "09",
    headline: "Festive night.",
    highlight: "Festive",
    tip: "Festive night. Green kurta. I actually showed up to dance.",
    caption: "Festive night. Green kurta. I actually showed up to dance.",
    src: "/images/about/festive-kurta-crop.webp",
    alt: "Illustrated cut-out of Megh in a green kurta, cropped closer against the firework backdrop.",
    width: 819,
    height: 1024,
    cut: "c",
  },
  {
    id: "nehru",
    kicker: "10",
    headline: "Fairy lights.",
    highlight: "lights",
    tip: "Fairy lights and a nehru jacket. Family functions done right.",
    caption: "Fairy lights and a nehru jacket. Family functions done right.",
    src: "/images/about/evening-nehru.webp",
    alt: "Illustrated cut-out of Megh smiling in a blue kurta and patterned nehru jacket under outdoor fairy lights.",
    width: 819,
    height: 1024,
    cut: "d",
  },
  {
    id: "mandap",
    kicker: "11",
    headline: "Wedding season.",
    highlight: "Wedding",
    tip: "Wedding season. Sunglasses. I'm someone's plus-one.",
    caption: "Wedding season. Sunglasses. I'm someone's plus-one.",
    src: "/images/about/wedding-tent.webp",
    alt: "Illustrated cut-out of Megh in a beige kurta and sunglasses, arms crossed under a yellow-green wedding tent.",
    width: 819,
    height: 1024,
    cut: "e",
  },
  {
    id: "lilac-suit",
    kicker: "12",
    headline: "Lilac suit.",
    highlight: "Lilac",
    tip: "Lilac suit, stone stairs. Dressing up is also a craft.",
    caption: "Lilac suit, stone stairs. Dressing up is also a craft.",
    src: "/images/about/lilac-suit.webp",
    alt: "Illustrated cut-out of Megh in a lilac suit on a decorated stone staircase, hands in pockets.",
    width: 819,
    height: 1024,
    cut: "f",
    frames: [
      {
        src: "/images/about/lilac-suit-adjust.webp",
        alt: "Illustrated cut-out of Megh in a lilac suit adjusting his jacket on the stairs.",
        width: 819,
        height: 1024,
      },
    ],
  },
];
