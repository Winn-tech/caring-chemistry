"use client";

import { useActionState } from "react";
import { PostStatus } from "@/generated/prisma/enums";
import { createPost, updatePost, type PostFormState } from "../actions";
import { CoverImageUpload } from "./cover-image-upload";

type Post = { id: string; title: string; slug: string; excerpt: string | null; category: string; content: string; coverUrl: string | null; status: PostStatus };
const initialState: PostFormState = {};
const CATEGORIES = ["Skincare", "Ingredients", "Routines", "Beauty tips", "Wellness"];

export function PostEditor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(post ? updatePost : createPost, initialState);
  return <form action={action} className="mt-8 space-y-7">{post && <input name="id" type="hidden" value={post.id} />}<fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6"><legend className="px-1 font-display text-xl font-semibold">Article details</legend><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="Title" name="title" defaultValue={post?.title ?? ""} required /><Field label="Slug" name="slug" defaultValue={post?.slug ?? ""} hint="Lowercase words separated by hyphens." required /><label className="text-sm font-medium text-primary-800">Category<select className="input mt-2" defaultValue={post?.category ?? "Skincare"} name="category">{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label className="sm:col-span-2 text-sm font-medium text-primary-800">Excerpt<textarea className="input mt-2 min-h-24" defaultValue={post?.excerpt ?? ""} name="excerpt" /></label></div><CoverImageUpload initialUrl={post?.coverUrl} /></fieldset><fieldset className="rounded-xl border border-primary-100 bg-white p-5 sm:p-6"><legend className="px-1 font-display text-xl font-semibold">Article content</legend><label className="mt-4 block text-sm font-medium text-primary-800">Content<textarea className="input mt-2 min-h-80 leading-relaxed" defaultValue={post?.content ?? ""} name="content" required /></label><label className="mt-5 block max-w-64 text-sm font-medium text-primary-800">Publishing status<select className="input mt-2" defaultValue={post?.status ?? PostStatus.DRAFT} name="status"><option value={PostStatus.DRAFT}>Save as draft</option><option value={PostStatus.PUBLISHED}>Publish now</option></select></label></fieldset>{state.error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p>}<button className="rounded-lg bg-primary-950 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-60" disabled={pending} type="submit">{pending ? "Saving…" : post ? "Save article" : "Create article"}</button></form>;
}
function Field({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) { return <label className="text-sm font-medium text-primary-800">{label}<input className="input mt-2" {...props} />{hint && <span className="mt-1 block text-xs font-normal text-primary-500">{hint}</span>}</label>; }
