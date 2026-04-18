import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
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
    </>
  );
}
