import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import BookServiceForm from "./BookServiceForm";

export const metadata = {
  title: "Book a Repair | KonnectTech",
  description: "Book a device repair or service with KonnectTech.",
};

export default function BookServicePage() {
  return (
    <div>
      <Navigation />
      <main className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none"></div>
        <BookServiceForm />
      </main>
      <Footer />
    </div>
  );
}
