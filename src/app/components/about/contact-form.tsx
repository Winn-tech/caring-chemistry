"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { CONTACT_LIMITS, CONTACT_TOPICS, contactMessageSchema, type ContactField } from "@/lib/contact";

type Values = Record<ContactField, string>;
type Errors = Partial<Record<ContactField, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", topic: "", message: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "phone", "topic", "message"];
const EASE = [0.16, 1, 0.3, 1] as const;

function validate(values: Values): Errors {
  const result = contactMessageSchema.safeParse(values);
  if (result.success) return {};
  const errors: Errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    errors[field] ??= issue.message;
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const [sentName, setSentName] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  function update(field: ContactField, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // After the first submit attempt, errors clear as soon as a field becomes valid.
    if (submitted) setErrors(validate(next));
  }

  function focusField(field: ContactField) {
    const element = formRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`);
    element?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    setFormError("");

    const found = validate(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "" }),
      });
      const data = (await response.json().catch(() => null)) as { success?: boolean; message?: string; field?: string } | null;
      if (!response.ok || !data?.success) {
        const field = FIELD_ORDER.find((name) => name === data?.field);
        if (field && data?.message) {
          setErrors({ [field]: data.message });
          focusField(field);
        } else {
          setFormError(data?.message ?? "We couldn't send your message. Please try again in a moment.");
        }
        setStatus("idle");
        return;
      }
      setSentName(values.name.trim().split(/\s+/)[0] ?? "");
      setValues(EMPTY);
      setErrors({});
      setSubmitted(false);
      setStatus("sent");
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      setStatus("idle");
    }
  }

  const sending = status === "sending";
  const remaining = CONTACT_LIMITS.message - values.message.length;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[28rem] flex-col items-center justify-center px-2 py-10 text-center"
            role="status"
          >
            <motion.svg viewBox="0 0 64 64" className="h-20 w-20 text-accent-600" aria-hidden="true">
              <motion.circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: EASE }} />
              <motion.path d="M20 33.5l8 8 16-17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: 0.55, ease: EASE }} />
            </motion.svg>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75, ease: EASE }}>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-primary-950 sm:text-3xl">
                Thank you{sentName ? `, ${sentName}` : ""}.
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-primary-600 sm:text-base">
                Your message is with our team. We&apos;ll reply to the email address you gave us.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 rounded-full border border-primary-950 px-6 py-3 text-sm font-semibold text-primary-950 transition-colors hover:bg-primary-950 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
              >
                Send another message
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="space-y-6"
            aria-describedby={formError ? `${id}-form-error` : undefined}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField id={`${id}-name`} field="name" label="Your name" autoComplete="name" maxLength={CONTACT_LIMITS.name} value={values.name} error={errors.name} onChange={update} disabled={sending} />
              <TextField id={`${id}-email`} field="email" label="Email address" type="email" inputMode="email" autoComplete="email" maxLength={CONTACT_LIMITS.email} value={values.email} error={errors.email} onChange={update} disabled={sending} />
            </div>
            <TextField id={`${id}-phone`} field="phone" label="Phone number" optional type="tel" inputMode="tel" autoComplete="tel" maxLength={CONTACT_LIMITS.phone} value={values.phone} error={errors.phone} onChange={update} disabled={sending} />

            <fieldset aria-describedby={errors.topic ? `${id}-topic-error` : undefined}>
              <legend className="text-sm font-medium text-primary-800">What is it about?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {CONTACT_TOPICS.map((topic, index) => {
                  const selected = values.topic === topic;
                  return (
                    <label key={topic} className={`relative isolate cursor-pointer select-none rounded-full border px-4 py-2 text-sm transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-400 has-[:focus-visible]:ring-offset-2 ${selected ? "border-primary-950 text-white" : errors.topic ? "border-red-300 text-primary-700 hover:border-primary-400" : "border-primary-200 text-primary-700 hover:border-primary-400"} ${sending ? "pointer-events-none opacity-60" : ""}`}>
                      <input
                        type="radio"
                        name="topic"
                        value={topic}
                        checked={selected}
                        onChange={() => update("topic", topic)}
                        disabled={sending}
                        data-field={index === 0 ? "topic" : undefined}
                        className="sr-only"
                      />
                      {selected && <motion.span layoutId={`${id}-topic-pill`} className="absolute inset-0 -z-10 rounded-full bg-primary-950" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden="true" />}
                      <span className="relative">{topic}</span>
                    </label>
                  );
                })}
              </div>
              <FieldError id={`${id}-topic-error`} message={errors.topic} />
            </fieldset>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-message`} className="text-sm font-medium text-primary-800">Your message</label>
                <span className={`text-xs tabular-nums transition-colors ${remaining < 100 ? "text-accent-700" : "text-primary-400"}`} aria-live="polite">
                  {remaining < 200 ? `${remaining} characters left` : ""}
                </span>
              </div>
              <div className="mt-2">
                <textarea
                  id={`${id}-message`}
                  data-field="message"
                  name="message"
                  rows={6}
                  maxLength={CONTACT_LIMITS.message}
                  value={values.message}
                  onChange={(event) => update("message", event.target.value)}
                  disabled={sending}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? `${id}-message-error` : undefined}
                  placeholder="Tell us how we can help."
                  className={`block w-full resize-y rounded-xl border bg-[#FBF9F7] px-4 py-3.5 text-base text-primary-950 outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-primary-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.03)] disabled:opacity-60 sm:text-sm ${errors.message ? "border-red-300 focus:border-red-400" : "border-primary-200 focus:border-accent-500"}`}
                />
              </div>
              <FieldError id={`${id}-message-error`} message={errors.message} />
            </div>

            {/* Spam trap: hidden from people and screen readers; bots that fill it in are ignored. */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={`${id}-website`}>Website</label>
              <input ref={honeypot} id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <AnimatePresence initial={false}>
              {formError && (
                <motion.p
                  key="form-error"
                  id={`${id}-form-error`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                  role="alert"
                >
                  <span className="flex items-start gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {formError}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-primary-500 sm:max-w-[16rem]">
                We only use your details to reply to this message.
              </p>
              <motion.button
                type="submit"
                disabled={sending}
                whileTap={sending ? undefined : { scale: 0.97 }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-950 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-80 sm:w-auto"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type TextFieldProps = {
  id: string;
  field: ContactField;
  label: string;
  value: string;
  error?: string;
  optional?: boolean;
  type?: "text" | "email" | "tel";
  inputMode?: "text" | "email" | "tel";
  autoComplete: string;
  maxLength: number;
  disabled: boolean;
  onChange: (field: ContactField, value: string) => void;
};

function TextField({ id, field, label, value, error, optional, type = "text", inputMode, autoComplete, maxLength, disabled, onChange }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-primary-800">
        {label}
        {optional && <span className="ml-1.5 font-normal text-primary-400">(optional)</span>}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          data-field={field}
          name={field}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`peer block w-full rounded-xl border bg-[#FBF9F7] px-4 py-3.5 text-base text-primary-950 outline-none transition-[border-color,background-color] duration-300 focus:bg-white disabled:opacity-60 sm:text-sm ${error ? "border-red-300 focus:border-red-400" : "border-primary-200 focus:border-accent-500"}`}
        />
        {/* Underline that grows from the left while the field has focus. */}
        <span aria-hidden="true" className={`pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100 ${error ? "bg-red-400" : "bg-accent-500"}`} />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key={message}
          id={id}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="overflow-hidden"
        >
          <span className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            {message}
          </span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}
