"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  Search,
  FlaskConical,
  Heart,
} from "lucide-react";

const CHAT_HREF = "/chat";

const chatTopics = [
  {
    icon: Search,
    label: "Find my routine",
  },
  {
    icon: FlaskConical,
    label: "Check ingredients",
  },
  {
    icon: Heart,
    label: "Choose for my skin",
  },
];

export function AiChatCta() {
  return (
    <section className="my-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="group relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-primary-200/70 bg-linear-to-br from-primary-50 via-white to-accent-50/60"
      >
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-200/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-accent-200/15 blur-3xl"
        />

        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
          {/* Main content */}
          <div>
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-white shadow-sm">
                <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                Your personal beauty assistant
              </span>
            </div>

            {/* Heading */}
            <h2 className="max-w-2xl font-display text-2xl leading-tight text-primary-950 sm:text-3xl lg:text-4xl">
              Not sure what your skin needs?
              <span className="block text-primary-600">
                Let&apos;s figure it out together.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-800/75 sm:text-base">
              Get personalized guidance from our AI beauty assistant. Ask
              about products, ingredients, routines, or what might work best
              for your skin — anytime you need a little help choosing.
            </p>

            {/* Conversation topics */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {chatTopics.map((topic) => {
                const Icon = topic.icon;

                return (
                  <span
                    key={topic.label}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-white/80 px-3.5 py-2 text-xs font-medium text-primary-800 backdrop-blur-sm"
                  >
                    <Icon
                      className="h-3.5 w-3.5 text-primary-600"
                      strokeWidth={1.7}
                    />
                    {topic.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Link
              href={CHAT_HREF}
              className="group/button inline-flex items-center justify-center gap-2 rounded-full bg-primary-950 px-6 py-3.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <MessageCircle
                className="h-4 w-4"
                strokeWidth={1.8}
              />

              Chat with our assistant

              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>

            <p className="text-xs text-primary-600/70">
              Personalized guidance, whenever you need it.
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-linear-to-r from-transparent via-primary-300/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
