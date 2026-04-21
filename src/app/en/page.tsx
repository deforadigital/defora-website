import AboutSystem from "@/components/AboutSystem";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import GrowthSystem from "@/components/GrowthSystem";
import Navbar from "@/components/Navbar";
import NarrativeHighlight from "@/components/NarrativeHighlight";
import { createLocalizedMetadata } from "@/lib/metadata";

export const metadata = createLocalizedMetadata({
  locale: "en",
  pathname: "/",
  title: "Defora Digital",
  description: "Premium digital experiences by Defora.",
});

export default function EnglishHome() {
  return (
    <>
      <Navbar locale="en" />
      <Hero locale="en" />
      <NarrativeHighlight />
      <GrowthSystem locale="en" />
      <AboutSystem locale="en" />
      <FinalCta locale="en" />
    </>
  );
}
