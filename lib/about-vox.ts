export type AboutVoxChapter = {
  id: string;
  kicker: string;
  headline: string;
  highlight: string;
  caption: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  cut: string;
};

// Six life-moments. Captions are first-pass and meant to be swapped
// if Megh sends tighter lines. Images are walk-style illustrations.
export const ABOUT_VOX_CHAPTERS: AboutVoxChapter[] = [
  {
    id: "bike",
    kicker: "01",
    headline: "The GT650.",
    highlight: "GT650",
    caption: "Not a collection. A way to see a new city at my own pace.",
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
    caption: "Building a hybrid athlete. Noida is next.",
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
    caption: "Horse riding through trees and tea hills. No itinerary.",
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
    caption: "Other instruments when I can. This one I keep coming back to.",
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
    caption: "Shooting the ones I actually want to remember.",
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
    caption: "The quieter side of the state. A two-wheeler and no fixed plan.",
    src: "/images/about/goa-convocation.webp",
    alt: "Illustrated cut-out of Megh in BITS Pilani Goa convocation robes, smiling in front of campus.",
    width: 1024,
    height: 1024,
    cut: "f",
  },
];
