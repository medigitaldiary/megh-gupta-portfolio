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
};

// Append an entry here to add a print to the About desk. Layout is computed
// from the array length, so the center slip stays put.
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
];
