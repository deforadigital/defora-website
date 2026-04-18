import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
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
    </>
  );
}
