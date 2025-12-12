import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your Trusted Source for Tech, Tailored to You.
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Our Mission
              </h3>
              <p className="mt-4 text-gray-600">
                In a world overflowing with tech gadgets, finding the right one can be overwhelming. Our mission is to cut through the noise. We are an e-commerce platform dedicated to bringing you the best tech products, curated and matched to your specific interests.
              </p>
              <p className="mt-4 text-gray-600">
                We believe that the best recommendations come from real-world experience. That's why we obsessively analyze market reviews, user feedback, and expert opinions. This data-driven approach allows us to understand what makes a product truly great and who it's perfect for.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                How It Works
              </h3>
              <p className="mt-4 text-gray-600">
                Instead of just listing endless products, we provide personalized recommendations. Whether you're a gamer looking for the perfect headset, a professional seeking a productivity-boosting keyboard, or a fitness enthusiast in search of the latest smartwatch, we've done the homework for you.
              </p>
              <p className="mt-4 text-gray-600">
                Our product pages feature in-depth summaries of customer sentiment, highlighting the pros and cons that matter most. We connect you with products that are not just popular, but are the right fit for your needs and passions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;