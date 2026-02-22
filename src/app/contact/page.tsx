import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="font-bold text-gray-900 font-['Orbitron']">
                            Get in Touch
                        </h1>
                        <p className="max-w-xl mx-auto text-gray-500">
                            Have questions about our products? Need support? We&apos;re here to help!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900 font-['Orbitron']">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF4500]/10 text-[#FF4500]">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Address</p>
                                        <p className="mt-1 text-gray-500">
                                            123 Tech Boulevard,<br />
                                            Silicon Valley, CA 94025
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF4500]/10 text-[#FF4500]">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Phone</p>
                                        <p className="mt-1 text-gray-500">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[#FF4500]/10 text-[#FF4500]">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-medium text-gray-900">Email</p>
                                        <p className="mt-1 text-gray-500">support@konnecttech.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
