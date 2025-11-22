import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - The Book Haven",
  description: "Learn about The Book Haven, a curated collection of timeless books.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[var(--wood-brown)]">
          About The Book Haven
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-[rgba(78,59,49,0.8)] mb-6">
            Welcome to The Book Haven, where we believe in the timeless power of books 
            to inspire, educate, and transform lives.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[var(--wood-brown)]">
            Our Mission
          </h2>
          <p className="text-[rgba(78,59,49,0.8)] mb-6">
            We are dedicated to curating a collection of books chosen for their craft, 
            story, and soul. Every book in our catalog has been carefully selected to 
            ensure you find your next treasured read.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[var(--wood-brown)]">
            What We Offer
          </h2>
          <p className="text-[rgba(78,59,49,0.8)] mb-6">
            From classic literature to contemporary bestsellers, from fiction to 
            non-fiction, our catalog spans genres and generations. We take pride in 
            offering both physical books and digital editions, ensuring that great 
            stories are accessible to everyone.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[var(--wood-brown)]">
            Our Commitment
          </h2>
          <p className="text-[rgba(78,59,49,0.8)] mb-6">
            At The Book Haven, we are committed to providing exceptional service, 
            carefully curated selections, and a seamless shopping experience. We 
            believe that every book has a story, and we're here to help you discover 
            yours.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-[var(--wood-brown)]">
            Contact Us
          </h2>
          <p className="text-[rgba(78,59,49,0.8)] mb-6">
            Have questions or suggestions? We'd love to hear from you. Reach out to 
            us at{" "}
            <a 
              href="mailto:hello@bookhaven.example" 
              className="text-[var(--wood-brown)] hover:underline"
            >
              hello@bookhaven.example
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

