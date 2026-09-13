import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import OrdersList from "./OrdersList";

export const metadata = {
  title: "My Orders | KonnectTech",
  description: "Track your KonnectTech orders.",
};

export default function OrdersPage() {
  return (
    <div>
      <Navigation />
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <OrdersList />
      </main>
      <Footer />
    </div>
  );
}
