import AboutSystem from "@/components/AboutSystem";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import GrowthSystem from "@/components/GrowthSystem";
import Navbar from "@/components/Navbar";
import NarrativeHighlight from "@/components/NarrativeHighlight";
import { createLocalizedMetadata } from "@/lib/metadata";

export const metadata = createLocalizedMetadata({
  locale: "tr",
  pathname: "/",
  title: "Defora Digital",
  description: "Defora tarafindan uretilen premium dijital deneyimler.",
});

export default function Home() {
  return (
    <>
      <Navbar locale="tr" />
      <Hero locale="tr" />
      <NarrativeHighlight />
      <GrowthSystem locale="tr" />
      <AboutSystem locale="tr" />
      <FinalCta locale="tr" />
    </>
  );
}
