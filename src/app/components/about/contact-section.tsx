"use client";

import Link from "next/link";
import { MotionConfig } from "framer-motion";
import { ArrowUpRight, MapPin, MessageCircle, Phone, Store } from "lucide-react";
import { COMPANY_ADDRESS, COMPANY_MAP_EMBED_URL, COMPANY_MAP_URL, COMPANY_PHONES } from "@/lib/company";
import { Reveal } from "../reveal";
import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    // reducedMotion="user": people who turn animations off in their device settings get none here.
    <MotionConfig reducedMotion="user">
      <section id="contact" aria-labelledby="contact-heading" className="relative scroll-mt-24 overflow-hidden bg-white py-20 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full bg-accent-100/60 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 bottom-0 h-[22rem] w-[22rem] rounded-full bg-primary-100/50 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[5fr_7fr] lg:gap-x-16 lg:gap-y-10 lg:px-10">
          {/* Intro: first on every screen size. */}
          <Reveal once className="lg:col-start-1 lg:row-start-1">
            <span className="font-accent text-lg italic text-accent-600">Get in touch</span>
            <h2 id="contact-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
              We&apos;d love to hear from you.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-600 sm:text-base lg:text-[17px]">
              A question about a product, your routine, an order or working with us? Send a message and our team will reply by email.
            </p>
          </Reveal>

          {/* Form: second on phones, right-hand column on large screens. */}
          <Reveal once delay={120} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="rounded-3xl border border-primary-100 bg-white/90 p-5 shadow-[0_24px_60px_-28px_rgba(46,32,50,0.25)] backdrop-blur sm:p-8 lg:p-10">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <MessageCircle size={18} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-primary-950 sm:text-xl">Send us a message</h3>
                  <p className="text-xs text-primary-500 sm:text-sm">All fields are required unless marked optional.</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </Reveal>

          {/* Address, stores and map: last on phones, under the intro on large screens. */}
          <div className="space-y-4 lg:col-start-1 lg:row-start-2">
            <Reveal once delay={80}>
              <a
                href={COMPANY_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-primary-100 bg-[#F7F3EF] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_16px_40px_-24px_rgba(46,32,50,0.35)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent-600 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Visit us</span>
                  <address className="mt-1.5 text-sm not-italic leading-relaxed text-primary-950 sm:text-base">
                    {COMPANY_ADDRESS.street},<br />
                    {COMPANY_ADDRESS.city}, {COMPANY_ADDRESS.region}, {COMPANY_ADDRESS.country}
                  </address>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-700">
                    Get directions
                    <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    <span className="sr-only">(opens Google Maps in a new tab)</span>
                  </span>
                </span>
              </a>
            </Reveal>

            <Reveal once delay={120}>
              <div className="flex items-start gap-4 rounded-2xl border border-primary-100 bg-[#F7F3EF] p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent-600">
                  <Phone size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">WhatsApp or call</span>
                  <ul className="mt-1.5 space-y-2">
                    {COMPANY_PHONES.map((phone) => (
                      <li key={phone.international} className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {phone.whatsappOnly ? (
                          <span className="text-sm text-primary-600 sm:text-base">
                            WhatsApp only:{" "}
                            <a href={phone.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-950 transition-colors hover:text-accent-700">
                              {phone.display}
                              <span className="sr-only"> (opens WhatsApp in a new tab)</span>
                            </a>
                          </span>
                        ) : (<>
                        <a href={phone.telUrl} className="text-sm font-medium text-primary-950 transition-colors hover:text-accent-700 sm:text-base">
                          {phone.display}
                        </a>
                        <a
                          href={phone.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 transition-colors hover:text-accent-800"
                        >
                          <MessageCircle size={15} aria-hidden="true" />
                          WhatsApp
                          <span className="sr-only">{phone.display} (opens in a new tab)</span>
                        </a>
                        </>)}
                      </li>
                    ))}
                  </ul>
                </span>
              </div>
            </Reveal>

            <Reveal once delay={160}>
              <Link
                href="/stores"
                className="group flex items-start gap-4 rounded-2xl border border-primary-100 bg-[#F7F3EF] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_16px_40px_-24px_rgba(46,32,50,0.35)]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-accent-600 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  <Store size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Looking to buy?</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-primary-950 sm:text-base">Find a store or online retailer near you.</span>
                </span>
                <ArrowUpRight size={18} className="mt-1 shrink-0 text-accent-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Reveal>

            <Reveal once delay={240}>
              <div className="overflow-hidden rounded-2xl border border-primary-100 bg-[#F7F3EF]">
                <iframe
                  src={COMPANY_MAP_EMBED_URL}
                  title={`Map showing Caring Chemistry at ${COMPANY_ADDRESS.street}, ${COMPANY_ADDRESS.city}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block aspect-[4/3] w-full border-0 grayscale-[35%] transition-[filter] duration-500 hover:grayscale-0 sm:aspect-[16/9] lg:aspect-[4/3]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
