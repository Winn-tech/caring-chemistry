# Caring Chemistry Admin API

## What is implemented

The API lives under `/api/v1` and uses Bearer JWT authentication. All write actions are validated, role-checked, rate-limited where credential abuse is possible, and written to `AuditLog`.

| Role | Access |
| --- | --- |
| `GENERAL_ADMIN` | Staff, products, categories, orders, carts, content, audit data |
| `SALES_TEAM` | Products/categories (including archive), paid orders, carts |
| `SOCIAL_TEAM` | Blog posts; read-only catalogue/categories |

## Local setup

1. Create a Neon project and copy its pooled connection string to `DATABASE_URL` and direct connection string to `DIRECT_URL` in a local `.env` file based on `.env.example`.
2. Use a unique 32+ character `JWT_SECRET`.
3. Run `npm run db:generate`, then `npm run db:migrate -- --name init`.
4. Provision the first General Admin locally with `ADMIN_INITIAL_PASSWORD="a-long-unique-password" npm run admin:provision -- --name "Platform Admin" --email admin@example.com`. It is not an API route.
5. Reset an existing admin or staff password locally with `ADMIN_RESET_PASSWORD="a-new-unique-password" npm run admin:reset -- --email admin@example.com`.
6. Authenticated staff can change their password with `PATCH /api/v1/auth/password` using a Bearer token and `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }`.
7. Run `npm run dev`, import `postman/Caring-Chemistry-Admin-API.postman_collection.json`, then use **Login**.

## Security notes

- Products are soft-deleted (archived); this preserves order history.
- The database rate limiter protects login attempts. At high traffic, replace it with a shared Redis/Upstash limiter before public launch.
- Never expose `DIRECT_URL`, `JWT_SECRET`, Resend key, or Cloudinary secret to the browser.
- The beauty assistant (`POST /api/chat`) uses Gemini via `GEMINI_API_KEY`. It is rate limited per IP, stateless (conversations are not stored) and grounded on active products and published journal articles; store policies live in `src/lib/chat/store-info.ts`. Enable Gemini billing before launch: free-tier content may be used by Google to improve its products.
- "Buy on <retailer>" buttons link to `/go/<productId>/<retailerId>`, which records a `RetailerClick` (bots skipped) and redirects to the retailer. Click counts for the last 30 days show on the admin Retailers page.
