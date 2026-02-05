import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { faqs } from '../mock';

const FAQSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Emergent
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`item-${faq.id}`}
              className="bg-gray-50 rounded-xl px-6 border-none"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-black hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
