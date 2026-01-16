import CTA from "@/components/sections/CTA";
import Navigation from "@/components/sections/Navigation";
import WhyUS from "@/components/sections/WhyUs";
import Featured from "@/components/sections/Featured";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const uiContent = await prisma.uIContent.findMany();
  
  const getContent = (key: string) => uiContent.find((c: any) => c.key === key)?.value || "";
  
  const heroContent = {
      title: getContent("hero_title"),
      subtitle: getContent("hero_subtitle"),
      description: getContent("hero_description"),
      btnExplore: getContent("btn_explore"),
      btnAbout: getContent("btn_about"),
  };

  return (
    <div className="">
      <Navigation />
      <Hero content={heroContent} />
      <About />
      <Featured />
      <CTA />
      <WhyUS />
      <Footer />
    </div>
  );
}
