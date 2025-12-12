import CTA from "@/components/sections/CTA";
import Navigation from "@/components/sections/Navigation";
import WhyUS from "@/components/sections/WhyUs";
import Featured from "@/components/sections/Featured";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";


export default function Home() {
  return (
    <div className="">
      <Navigation />
      <Hero />
      <About />
      <Featured />
      <CTA />
      <WhyUS />
      <Footer />
    </div>
  );
}
