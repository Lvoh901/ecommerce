import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Profile Settings | KonnectTech",
  description: "Manage your KonnectTech profile, avatar and password.",
};

export default function ProfilePage() {
  return (
    <div>
      <Navigation />
      <main className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none"></div>
        <div className="relative">
          <ProfileForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
