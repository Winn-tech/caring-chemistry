import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
// Prisma error codes that describe the request, not a server fault.
const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  P2025: { status: 404, message: "The record was not found." },
  P2002: { status: 409, message: "A record with that value already exists." },
  P2003: { status: 409, message: "This record is still in use by other records and cannot be changed that way." },
};

function prismaErrorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" ? error.code : null;
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", details: error.flatten() }, { status: 422 });
  const known = PRISMA_ERRORS[prismaErrorCode(error) ?? ""];
  if (known) return NextResponse.json({ error: known.message }, { status: known.status });
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
export function ok(data: unknown, status = 200) { return NextResponse.json({ data }, { status }); }
