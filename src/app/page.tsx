import CTA from "@/components/CTA";
import Navigation from "@/components/Navigation";
import WhyUS from "@/components/WhyUs";
import Featured from "@/pages/Featured";
import Footer from "@/pages/Footer";
import Hero from "@/pages/Hero";


export default function Home() {
  return (
    <div className="">
      <Navigation />
      <Hero />
      <Featured />
      <CTA />
      <WhyUS />
      <Footer />
    </div>
  );
}
