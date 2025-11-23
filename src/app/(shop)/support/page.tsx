import { getSession } from "@/lib/session";
import { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 5-7 business days. Express shipping is available for 2-3 business day delivery.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase. Books must be in original condition. Please contact support to initiate a return.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive an email with tracking information. You can also view order status in your account under 'My Orders'.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to most countries worldwide. International shipping rates and delivery times vary by location.",
  },
  {
    question: "Can I change or cancel my order?",
    answer: "Orders can be modified or cancelled within 1 hour of placement. After that, please contact support for assistance.",
  },
  {
    question: "Are ebooks available?",
    answer: "Currently we only offer physical books. We're working on adding ebook options in the future.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-neutral-200 py-4">
      <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 hover:text-[var(--wood-brown)]">
        {question}
        <span className="ml-4 text-xl group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="mt-3 text-gray-600">{answer}</p>
    </details>
  );
}

function ContactInfo() {
  return (
    <div className="bg-[var(--warm-white)] p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4 text-[var(--wood-brown)]">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <EnvelopeIcon className="w-6 h-6 text-[var(--wood-brown)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Email</p>
            <a href="mailto:support@thebookhaven.com" className="text-gray-600 hover:underline">
              support@thebookhaven.com
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <PhoneIcon className="w-6 h-6 text-[var(--wood-brown)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Phone</p>
            <a href="tel:+1234567890" className="text-gray-600 hover:underline">
              +1 (234) 567-890
            </a>
            <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPinIcon className="w-6 h-6 text-[var(--wood-brown)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">Address</p>
            <p className="text-gray-600">
              123 Book Street<br />
              Ho Chi Minh City, Vietnam
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SupportPage() {
  const session = await getSession();

  return (
    <div className="container max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-2 text-[var(--wood-brown)]">Contact Support</h1>
      <p className="text-gray-600 mb-8">We're here to help! Check our FAQs or reach out to us directly.</p>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--wood-brown)]">Frequently Asked Questions</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-[var(--wood-brown)]">Send Us a Message</h2>
          <ContactForm user={session.user} />
        </div>
        <div>
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Contact Support - The Book Haven",
  description: "Get help with your orders or account at The Book Haven.",
};