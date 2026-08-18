import { Instrument_Serif } from "next/font/google";
import { LandingPage } from "@/components/marketing/landing-page";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export default function HomePage() {
  return <LandingPage displayClassName={display.className} />;
}
