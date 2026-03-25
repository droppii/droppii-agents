---
name: ck:better-auth
description: Add authentication with Better Auth (TypeScript). Use for email/password, OAuth providers (Google, GitHub), 2FA/MFA, passkeys/WebAuthn, sessions, RBAC, rate limiting.
license: MIT
version: 2.0.0
argument-hint: "[auth-method or feature]"
---

# Better Auth Skill

Better Auth is comprehensive, framework-agnostic authentication/authorization framework for TypeScript with built-in email/password, social OAuth, and powerful plugin ecosystem for advanced features.

## When to Use

- Implementing auth in TypeScript/JavaScript applications
- Adding email/password or social OAuth authentication
- Setting up 2FA, passkeys, magic links, advanced auth features
- Building multi-tenant apps with organization support
- Managing sessions and user lifecycle
- Working with any framework (Next.js, Nuxt, SvelteKit, Remix, Astro, Hono, Express, etc.)

## Quick Start

### Installation

```bash
npm install better-auth
# or pnpm/yarn/bun add better-auth
```

### Environment Setup

Create `.env`:
```env
BETTER_AUTH_SECRET=<generated-secret-32-chars-min>
BETTER_AUTH_URL=http://localhost:3000
```

### Basic Server Setup

Create `auth.ts` (root, lib/, utils/, or under src/app/server/):

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // See references/database-integration.md
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  }
});
```

### Database Schema

```bash
npx @better-auth/cli generate  # Generate schema/migrations
npx @better-auth/cli migrate   # Apply migrations (Kysely only)
```

### Mount API Handler

**Next.js App Router:**
```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

**Other frameworks:** See references/email-password-auth.md#framework-setup

### Client Setup

Create `auth-client.ts`:

```ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});
```

### Basic Usage

```ts
// Sign up
await authClient.signUp.email({
  email: "user@example.com",
  password: "secure123",
  name: "John Doe"
});

// Sign in
await authClient.signIn.email({
  email: "user@example.com",
  password: "secure123"
});

// OAuth
await authClient.signIn.social({ provider: "github" });

// Session
const { data: session } = authClient.useSession(); // React/Vue/Svelte
const { data: session } = await authClient.getSession(); // Vanilla JS
```

## Feature Selection Matrix

| Feature | Plugin Required | Use Case | Reference |
|---------|----------------|----------|-----------|
| Email/Password | No (built-in) | Basic auth | [email-password-auth.md](./references/email-password-auth.md) |
| OAuth (GitHub, Google, etc.) | No (built-in) | Social login | [oauth-providers.md](./references/oauth-providers.md) |
| Email Verification | No (built-in) | Verify email addresses | [email-password-auth.md](./references/email-password-auth.md#email-verification) |
| Password Reset | No (built-in) | Forgot password flow | [email-password-auth.md](./references/email-password-auth.md#password-reset) |
| Two-Factor Auth (2FA/TOTP) | Yes (`twoFactor`) | Enhanced security | [advanced-features.md](./references/advanced-features.md#two-factor-authentication) |
| Passkeys/WebAuthn | Yes (`passkey`) | Passwordless auth | [advanced-features.md](./references/advanced-features.md#passkeys-webauthn) |
| Magic Link | Yes (`magicLink`) | Email-based login | [advanced-features.md](./references/advanced-features.md#magic-link) |
| Username Auth | Yes (`username`) | Username login | [email-password-auth.md](./references/email-password-auth.md#username-authentication) |
| Organizations/Multi-tenant | Yes (`organization`) | Team/org features | [advanced-features.md](./references/advanced-features.md#organizations) |
| Rate Limiting | No (built-in) | Prevent abuse | [advanced-features.md](./references/advanced-features.md#rate-limiting) |
| Session Management | No (built-in) | User sessions | [advanced-features.md](./references/advanced-features.md#session-management) |

## Auth Method Selection Guide

**Choose Email/Password when:**
- Building standard web app with traditional auth
- Need full control over user credentials
- Targeting users who prefer email-based accounts

**Choose OAuth when:**
- Want quick signup with minimal friction
- Users already have social accounts
- Need access to social profile data

**Choose Passkeys when:**
- Want passwordless experience
- Targeting modern browsers/devices
- Security is top priority

**Choose Magic Link when:**
- Want passwordless without WebAuthn complexity
- Targeting email-first users
- Need temporary access links

**Combine Multiple Methods when:**
- Want flexibility for different user preferences
- Building enterprise apps with various auth requirements
- Need progressive enhancement (start simple, add more options)

## Core Architecture

Better Auth uses client-server architecture:
1. **Server** (`better-auth`): Handles auth logic, database ops, API routes
2. **Client** (`better-auth/client`): Provides hooks/methods for frontend
3. **Plugins**: Extend both server/client functionality

## Implementation Checklist

- [ ] Install `better-auth` package
- [ ] Set environment variables (SECRET, URL)
- [ ] Create auth server instance with database config
- [ ] Run schema migration (`npx @better-auth/cli generate`)
- [ ] Mount API handler in framework
- [ ] Create client instance
- [ ] Implement sign-up/sign-in UI
- [ ] Add session management to components
- [ ] Set up protected routes/middleware
- [ ] Add plugins as needed (regenerate schema after)
- [ ] Test complete auth flow
- [ ] Configure email sending (verification/reset)
- [ ] Enable rate limiting for production
- [ ] Set up error handling

## Reference Documentation

### Core Authentication
- [Email/Password Authentication](./references/email-password-auth.md) - Email/password setup, verification, password reset, username auth
- [OAuth Providers](./references/oauth-providers.md) - Social login setup, provider configuration, token management
- [Database Integration](./references/database-integration.md) - Database adapters, schema setup, migrations

### Advanced Features
- [Advanced Features](./references/advanced-features.md) - 2FA/MFA, passkeys, magic links, organizations, rate limiting, session management

## Scripts

- `scripts/better_auth_init.py` - Initialize Better Auth configuration with interactive setup

## Resources

- Docs: https://www.better-auth.com/docs
- GitHub: https://github.com/better-auth/better-auth
- Plugins: https://www.better-auth.com/docs/plugins
- Examples: https://www.better-auth.com/docs/examples


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### advanced features

# Advanced Features

Better Auth plugins extend functionality beyond basic authentication.

## Two-Factor Authentication

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    twoFactor({
      issuer: "YourAppName", // TOTP issuer name
      otpOptions: {
        period: 30, // OTP validity period (seconds)
        digits: 6, // OTP length
      }
    })
  ]
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient({
      twoFactorPage: "/two-factor", // Redirect to 2FA verification page
      redirect: true // Auto-redirect if 2FA required
    })
  ]
});
```

### Enable 2FA for User

```ts
// Enable TOTP
const { data } = await authClient.twoFactor.enable({
  password: "userPassword" // Verify user identity
});

// data contains QR code URI for authenticator app
const qrCodeUri = data.totpURI;
const backupCodes = data.backupCodes; // Save these securely
```

### Verify TOTP Code

```ts
await authClient.twoFactor.verifyTOTP({
  code: "123456",
  trustDevice: true // Skip 2FA on this device for 30 days
});
```

### Disable 2FA

```ts
await authClient.twoFactor.disable({
  password: "userPassword"
});
```

### Backup Codes

```ts
// Generate new backup codes
const { data } = await authClient.twoFactor.generateBackupCodes({
  password: "userPassword"
});

// Use backup code instead of TOTP
await authClient.twoFactor.verifyBackupCode({
  code: "backup-code-123"
});
```

## Passkeys (WebAuthn)

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { passkey } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    passkey({
      rpName: "YourApp", // Relying Party name
      rpID: "yourdomain.com" // Your domain
    })
  ]
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/client";
import { passkeyClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [passkeyClient()]
});
```

### Register Passkey

```ts
// User must be authenticated first
await authClient.passkey.register({
  name: "My Laptop" // Optional: name for this passkey
});
```

### Sign In with Passkey

```ts
await authClient.passkey.signIn();
```

### List User Passkeys

```ts
const { data } = await authClient.passkey.list();
// data contains array of registered passkeys
```

### Delete Passkey

```ts
await authClient.passkey.delete({
  id: "passkey-id"
});
```

## Magic Link

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        await sendEmail({
          to: email,
          subject: "Sign in to YourApp",
          html: `Click <a href="${url}">here</a> to sign in.`
        });
      },
      expiresIn: 300, // Link expires in 5 minutes (seconds)
    })
  ]
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [magicLinkClient()]
});
```

### Send Magic Link

```ts
await authClient.magicLink.sendMagicLink({
  email: "user@example.com",
  callbackURL: "/dashboard"
});
```

### Verify Magic Link

```ts
// Called automatically when user clicks link
// Token in URL query params handled by Better Auth
await authClient.magicLink.verify({
  token: "token-from-url"
});
```

## Organizations (Multi-Tenancy)

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5, // Max orgs per user
      creatorRole: "owner" // Role for org creator
    })
  ]
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()]
});
```

### Create Organization

```ts
await authClient.organization.create({
  name: "Acme Corp",
  slug: "acme", // Unique slug
  metadata: {
    industry: "Technology"
  }
});
```

### Invite Members

```ts
await authClient.organization.inviteMember({
  organizationId: "org-id",
  email: "user@example.com",
  role: "member", // owner, admin, member
  message: "Join our team!" // Optional
});
```

### Accept Invitation

```ts
await authClient.organization.acceptInvitation({
  invitationId: "invitation-id"
});
```

### List Organizations

```ts
const { data } = await authClient.organization.list();
// Returns user's organizations
```

### Update Member Role

```ts
await authClient.organization.updateMemberRole({
  organizationId: "org-id",
  userId: "user-id",
  role: "admin"
});
```

### Remove Member

```ts
await authClient.organization.removeMember({
  organizationId: "org-id",
  userId: "user-id"
});
```

### Delete Organization

```ts
await authClient.organization.delete({
  organizationId: "org-id"
});
```

## Session Management

### Configure Session Expiration

```ts
export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (seconds)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache for 5 minutes
    }
  }
});
```

### Server-Side Session

```ts
// Next.js
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers()
});

if (!session) {
  // Not authenticated
}
```

### Client-Side Session

```tsx
// React
import { authClient } from "@/lib/auth-client";

function UserProfile() {
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  if (!session) return <div>Not logged in</div>;

  return <div>Hello, {session.user.name}!</div>;
}
```

### List Active Sessions

```ts
const { data: sessions } = await authClient.listSessions();
// Returns all active sessions for current user
```

### Revoke Session

```ts
await authClient.revokeSession({
  sessionId: "session-id"
});
```

### Revoke All Sessions

```ts
await authClient.revokeAllSessions();
```

## Rate Limiting

### Server Configuration

```ts
export const auth = betterAuth({
  rateLimit: {
    enabled: true,
    window: 60, // Time window in seconds
    max: 10, // Max requests per window
    storage: "memory", // "memory" or "database"
    customRules: {
      "/api/auth/sign-in": {
        window: 60,
        max: 5 // Stricter limit for sign-in
      },
      "/api/auth/sign-up": {
        window: 3600,
        max: 3 // 3 signups per hour
      }
    }
  }
});
```

### Custom Rate Limiter

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  rateLimit: {
    enabled: true,
    customLimiter: async ({ request, limit }) => {
      // Custom rate limiting logic
      const ip = request.headers.get("x-forwarded-for");
      const key = `ratelimit:${ip}`;

      // Use Redis, etc.
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, limit.window);
      }

      if (count > limit.max) {
        throw new Error("Rate limit exceeded");
      }
    }
  }
});
```

## Anonymous Sessions

Track users before they sign up.

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [anonymous()]
});
```

### Client Usage

```ts
// Create anonymous session
const { data } = await authClient.signIn.anonymous();

// Convert to full account
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  linkAnonymousSession: true // Link anonymous data
});
```

## Email OTP

One-time password via email (passwordless).

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await sendEmail({
          to: email,
          subject: "Your verification code",
          text: `Your code is: ${otp}`
        });
      },
      expiresIn: 300, // 5 minutes
      length: 6 // OTP length
    })
  ]
});
```

### Client Usage

```ts
// Send OTP to email
await authClient.emailOTP.sendOTP({
  email: "user@example.com"
});

// Verify OTP
await authClient.emailOTP.verifyOTP({
  email: "user@example.com",
  otp: "123456"
});
```

## Phone Number Authentication

Requires phone number plugin.

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { phoneNumber } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, otp }) => {
        // Use Twilio, AWS SNS, etc.
        await sendSMS(phoneNumber, `Your code: ${otp}`);
      }
    })
  ]
});
```

### Client Usage

```ts
// Sign up with phone
await authClient.signUp.phoneNumber({
  phoneNumber: "+1234567890",
  password: "password123"
});

// Send OTP
await authClient.phoneNumber.sendOTP({
  phoneNumber: "+1234567890"
});

// Verify OTP
await authClient.phoneNumber.verifyOTP({
  phoneNumber: "+1234567890",
  otp: "123456"
});
```

## Best Practices

1. **2FA**: Offer 2FA as optional, make mandatory for admin users
2. **Passkeys**: Implement as progressive enhancement (fallback to password)
3. **Magic Links**: Set short expiration (5-15 minutes)
4. **Organizations**: Implement RBAC for org permissions
5. **Sessions**: Use short expiration for sensitive apps
6. **Rate Limiting**: Enable in production, adjust limits based on usage
7. **Anonymous Sessions**: Clean up old anonymous sessions periodically
8. **Backup Codes**: Force users to save backup codes before enabling 2FA
9. **Multi-Device**: Allow users to manage trusted devices
10. **Audit Logs**: Track sensitive operations (role changes, 2FA changes)

## Regenerate Schema After Plugins

After adding any plugin:

```bash
npx @better-auth/cli generate
npx @better-auth/cli migrate # if using Kysely
```

Or manually apply migrations for your ORM (Drizzle, Prisma).


### database integration

# Database Integration

Better Auth supports multiple databases and ORMs for flexible data persistence.

## Supported Databases

- SQLite
- PostgreSQL
- MySQL/MariaDB
- MongoDB
- Any database with adapter support

## Direct Database Connection

### SQLite

```ts
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  // or
  database: new Database(":memory:") // In-memory for testing
});
```

### PostgreSQL

```ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // or explicit config
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "myapp"
});

export const auth = betterAuth({
  database: pool
});
```

### MySQL

```ts
import { betterAuth } from "better-auth";
import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "myapp",
  waitForConnections: true,
  connectionLimit: 10
});

export const auth = betterAuth({
  database: pool
});
```

## ORM Adapters

### Drizzle ORM

**Install:**
```bash
npm install drizzle-orm better-auth
```

**Setup:**
```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // "pg" | "mysql" | "sqlite"
    schema: {
      // Optional: custom table names
      user: "users",
      session: "sessions",
      account: "accounts",
      verification: "verifications"
    }
  })
});
```

**Generate Schema:**
```bash
npx @better-auth/cli generate --adapter drizzle
```

### Prisma

**Install:**
```bash
npm install @prisma/client better-auth
```

**Setup:**
```ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // "postgresql" | "mysql" | "sqlite"
  })
});
```

**Generate Schema:**
```bash
npx @better-auth/cli generate --adapter prisma
```

**Apply to Prisma:**
```bash
# Add generated schema to schema.prisma
npx prisma migrate dev --name init
npx prisma generate
```

### Kysely

**Install:**
```bash
npm install kysely better-auth
```

**Setup:**
```ts
import { betterAuth } from "better-auth";
import { kyselyAdapter } from "better-auth/adapters/kysely";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const db = new Kysely({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
});

export const auth = betterAuth({
  database: kyselyAdapter(db, {
    provider: "pg"
  })
});
```

**Auto-migrate with Kysely:**
```bash
npx @better-auth/cli migrate --adapter kysely
```

### MongoDB

**Install:**
```bash
npm install mongodb better-auth
```

**Setup:**
```ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
await client.connect();

export const auth = betterAuth({
  database: mongodbAdapter(client, {
    databaseName: "myapp"
  })
});
```

**Generate Collections:**
```bash
npx @better-auth/cli generate --adapter mongodb
```

## Core Database Schema

Better Auth requires these core tables/collections:

### User Table

```sql
CREATE TABLE user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  emailVerified BOOLEAN DEFAULT FALSE,
  name TEXT,
  image TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Session Table

```sql
CREATE TABLE session (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
);
```

### Account Table

```sql
CREATE TABLE account (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  accessToken TEXT,
  refreshToken TEXT,
  expiresAt TIMESTAMP,
  scope TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE(providerId, accountId)
);
```

### Verification Table

```sql
CREATE TABLE verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Schema Generation

### Using CLI

```bash
# Generate schema files
npx @better-auth/cli generate

# Specify adapter
npx @better-auth/cli generate --adapter drizzle
npx @better-auth/cli generate --adapter prisma

# Specify output
npx @better-auth/cli generate --output ./db/schema.ts
```

### Auto-migrate (Kysely only)

```bash
npx @better-auth/cli migrate
```

For other ORMs, apply generated schema manually.

## Custom Fields

Add custom fields to user table:

```ts
export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user"
      },
      phoneNumber: {
        type: "string",
        required: false
      },
      subscriptionTier: {
        type: "string",
        required: false
      }
    }
  }
});
```

After adding fields:
```bash
npx @better-auth/cli generate
```

Update user with custom fields:
```ts
await authClient.updateUser({
  role: "admin",
  phoneNumber: "+1234567890"
});
```

## Plugin Schema Extensions

Plugins add their own tables/fields. Regenerate schema after adding plugins:

```bash
npx @better-auth/cli generate
```

### Two-Factor Plugin Tables

- `twoFactor`: Stores TOTP secrets, backup codes

### Passkey Plugin Tables

- `passkey`: Stores WebAuthn credentials

### Organization Plugin Tables

- `organization`: Organization data
- `member`: Organization members
- `invitation`: Pending invitations

## Migration Strategies

### Development

```bash
# Generate schema
npx @better-auth/cli generate

# Apply migrations (Kysely)
npx @better-auth/cli migrate

# Or manual (Prisma)
npx prisma migrate dev

# Or manual (Drizzle)
npx drizzle-kit push
```

### Production

```bash
# Review generated migration
npx @better-auth/cli generate

# Test in staging
# Apply to production with your ORM's migration tool

# Prisma
npx prisma migrate deploy

# Drizzle
npx drizzle-kit push

# Kysely
npx @better-auth/cli migrate
```

## Connection Pooling

### PostgreSQL

```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### MySQL

```ts
import { createPool } from "mysql2/promise";

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## Database URLs

### PostgreSQL

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# Or with connection params
DATABASE_URL=postgresql://user:password@localhost:5432/dbname?schema=public&connection_limit=10
```

### MySQL

```env
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

### SQLite

```env
DATABASE_URL=file:./dev.db
# Or in-memory
DATABASE_URL=:memory:
```

### MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/dbname
# Or Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

## Performance Optimization

### Indexes

Better Auth CLI auto-generates essential indexes:
- `user.email` (unique)
- `session.userId`
- `account.userId`
- `account.providerId, accountId` (unique)

Add custom indexes for performance:
```sql
CREATE INDEX idx_session_expires ON session(expiresAt);
CREATE INDEX idx_user_created ON user(createdAt);
```

### Query Optimization

```ts
// Use connection pooling
// Enable query caching where applicable
// Monitor slow queries

export const auth = betterAuth({
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: true,
      httpOnly: true
    }
  }
});
```

## Backup Strategies

### PostgreSQL

```bash
# Backup
pg_dump dbname > backup.sql

# Restore
psql dbname < backup.sql
```

### MySQL

```bash
# Backup
mysqldump -u root -p dbname > backup.sql

# Restore
mysql -u root -p dbname < backup.sql
```

### SQLite

```bash
# Copy file
cp dev.db dev.db.backup

# Or use backup command
sqlite3 dev.db ".backup backup.db"
```

### MongoDB

```bash
# Backup
mongodump --db=dbname --out=./backup

# Restore
mongorestore --db=dbname ./backup/dbname
```

## Best Practices

1. **Environment Variables**: Store credentials in env vars, never commit
2. **Connection Pooling**: Use pools for PostgreSQL/MySQL in production
3. **Migrations**: Use ORM migration tools, not raw SQL in production
4. **Indexes**: Add indexes for frequently queried fields
5. **Backups**: Automate daily backups in production
6. **SSL**: Use SSL/TLS for database connections in production
7. **Schema Sync**: Keep schema in sync across environments
8. **Testing**: Use separate database for tests (in-memory SQLite ideal)
9. **Monitoring**: Monitor query performance and connection pool usage
10. **Cleanup**: Periodically clean expired sessions/verifications

## Troubleshooting

### Connection Errors

```ts
// Add connection timeout
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000
});
```

### Schema Mismatch

```bash
# Regenerate schema
npx @better-auth/cli generate

# Apply migrations
# For Prisma: npx prisma migrate dev
# For Drizzle: npx drizzle-kit push
```

### Migration Failures

- Check database credentials
- Verify database server is running
- Check for schema conflicts
- Review migration SQL manually

### Performance Issues

- Add indexes on foreign keys
- Enable connection pooling
- Monitor slow queries
- Consider read replicas for heavy read workloads


### email password auth

# Email/Password Authentication

Email/password is built-in auth method in Better Auth. No plugins required for basic functionality.

## Server Configuration

### Basic Setup

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // Auto sign-in after signup (default: true)
    requireEmailVerification: false, // Require email verification before login
    sendResetPasswordToken: async ({ user, url }) => {
      // Send password reset email
      await sendEmail(user.email, url);
    }
  }
});
```

### Custom Password Requirements

```ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  }
});
```

## Client Usage

### Sign Up

```ts
import { authClient } from "@/lib/auth-client";

const { data, error } = await authClient.signUp.email({
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe",
  image: "https://example.com/avatar.jpg", // optional
  callbackURL: "/dashboard" // optional
}, {
  onSuccess: (ctx) => {
    // ctx.data contains user and session
    console.log("User created:", ctx.data.user);
  },
  onError: (ctx) => {
    alert(ctx.error.message);
  }
});
```

### Sign In

```ts
const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "securePassword123",
  callbackURL: "/dashboard",
  rememberMe: true // default: true
}, {
  onSuccess: () => {
    // redirect or update UI
  },
  onError: (ctx) => {
    console.error(ctx.error.message);
  }
});
```

### Sign Out

```ts
await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/login");
    }
  }
});
```

## Email Verification

### Server Setup

```ts
export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      // Send verification email
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `Click <a href="${url}">here</a> to verify your email.`
      });
    },
    sendOnSignUp: true, // Send verification email on signup
    autoSignInAfterVerification: true // Auto sign-in after verification
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true // Require verification before login
  }
});
```

### Client Usage

```ts
// Send verification email
await authClient.sendVerificationEmail({
  email: "user@example.com",
  callbackURL: "/verify-success"
});

// Verify email with token
await authClient.verifyEmail({
  token: "verification-token-from-email"
});
```

## Password Reset Flow

### Server Setup

```ts
export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    sendResetPasswordToken: async ({ user, url, token }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `Click <a href="${url}">here</a> to reset your password.`
      });
    }
  }
});
```

### Client Flow

```ts
// Step 1: Request password reset
await authClient.forgetPassword({
  email: "user@example.com",
  redirectTo: "/reset-password"
});

// Step 2: Reset password with token
await authClient.resetPassword({
  token: "reset-token-from-email",
  password: "newSecurePassword123"
});
```

### Change Password (Authenticated)

```ts
await authClient.changePassword({
  currentPassword: "oldPassword123",
  newPassword: "newPassword456",
  revokeOtherSessions: true // Optional: logout other sessions
});
```

## Username Authentication

Requires `username` plugin for username-based auth.

### Server Setup

```ts
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    username({
      // Allow sign in with username or email
      allowUsernameOrEmail: true
    })
  ]
});
```

### Client Setup

```ts
import { createAuthClient } from "better-auth/client";
import { usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient()]
});
```

### Client Usage

```ts
// Sign up with username
await authClient.signUp.username({
  username: "johndoe",
  password: "securePassword123",
  email: "john@example.com", // optional
  name: "John Doe"
});

// Sign in with username
await authClient.signIn.username({
  username: "johndoe",
  password: "securePassword123"
});

// Sign in with username or email (if allowUsernameOrEmail: true)
await authClient.signIn.username({
  username: "johndoe", // or "john@example.com"
  password: "securePassword123"
});
```

## Framework Setup

### Next.js (App Router)

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
```

### Next.js (Pages Router)

```ts
// pages/api/auth/[...all].ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export default toNextJsHandler(auth);
```

### Nuxt

```ts
// server/api/auth/[...all].ts
import { auth } from "~/utils/auth";
import { toWebRequest } from "better-auth/utils/web";

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});
```

### SvelteKit

```ts
// hooks.server.ts
import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
  return svelteKitHandler({ event, resolve, auth });
}
```

### Astro

```ts
// pages/api/auth/[...all].ts
import { auth } from "@/lib/auth";

export async function ALL({ request }: { request: Request }) {
  return auth.handler(request);
}
```

### Hono

```ts
import { Hono } from "hono";
import { auth } from "./auth";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});
```

### Express

```ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();

app.all("/api/auth/*", toNodeHandler(auth));
```

## Protected Routes

### Next.js Middleware

```ts
// middleware.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};
```

### SvelteKit Hooks

```ts
// hooks.server.ts
import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers
  });

  if (event.url.pathname.startsWith("/dashboard") && !session) {
    throw redirect(303, "/login");
  }

  return resolve(event);
}
```

### Nuxt Middleware

```ts
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await useAuthSession();

  if (!session.value && to.path.startsWith("/dashboard")) {
    return navigateTo("/login");
  }
});
```

## User Profile Management

### Get Current User

```ts
const { data: session } = await authClient.getSession();
console.log(session.user);
```

### Update User Profile

```ts
await authClient.updateUser({
  name: "New Name",
  image: "https://example.com/new-avatar.jpg",
  // Custom fields if defined in schema
});
```

### Delete User Account

```ts
await authClient.deleteUser({
  password: "currentPassword", // Required for security
  callbackURL: "/" // Redirect after deletion
});
```

## Best Practices

1. **Password Security**: Enforce strong password requirements
2. **Email Verification**: Enable for production to prevent spam
3. **Rate Limiting**: Prevent brute force attacks (see advanced-features.md)
4. **HTTPS**: Always use HTTPS in production
5. **Error Messages**: Don't reveal if email exists during login
6. **Session Security**: Use secure, httpOnly cookies
7. **CSRF Protection**: Better Auth handles this automatically
8. **Password Reset**: Set short expiration for reset tokens
9. **Account Lockout**: Consider implementing after N failed attempts
10. **Audit Logs**: Track auth events for security monitoring


### oauth providers

# OAuth Providers

Better Auth provides built-in OAuth 2.0 support for social authentication. No plugins required.

## Supported Providers

GitHub, Google, Apple, Discord, Facebook, Microsoft, Twitter/X, Spotify, Twitch, LinkedIn, Dropbox, GitLab, and more.

## Basic OAuth Setup

### Server Configuration

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Optional: custom scopes
      scope: ["user:email", "read:user"]
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"]
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }
  }
});
```

### Client Usage

```ts
import { authClient } from "@/lib/auth-client";

// Basic sign in
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/dashboard"
});

// With callbacks
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
  errorCallbackURL: "/error",
  newUserCallbackURL: "/welcome", // For first-time users
});
```

## Provider Configuration

### GitHub OAuth

1. Create OAuth App at https://github.com/settings/developers
2. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Add credentials to `.env`:

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### Google OAuth

1. Create project at https://console.cloud.google.com
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add credentials to `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Discord OAuth

1. Create application at https://discord.com/developers/applications
2. Add OAuth2 redirect: `http://localhost:3000/api/auth/callback/discord`
3. Add credentials:

```env
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

### Apple Sign In

```ts
export const auth = betterAuth({
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      teamId: process.env.APPLE_TEAM_ID!,
      keyId: process.env.APPLE_KEY_ID!,
      privateKey: process.env.APPLE_PRIVATE_KEY!
    }
  }
});
```

### Microsoft/Azure AD

```ts
export const auth = betterAuth({
  socialProviders: {
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID, // Optional: for specific tenant
    }
  }
});
```

### Twitter/X OAuth

```ts
export const auth = betterAuth({
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }
  }
});
```

## Custom OAuth Provider

Add custom OAuth 2.0 provider:

```ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    customProvider: {
      clientId: process.env.CUSTOM_CLIENT_ID!,
      clientSecret: process.env.CUSTOM_CLIENT_SECRET!,
      authorizationUrl: "https://provider.com/oauth/authorize",
      tokenUrl: "https://provider.com/oauth/token",
      userInfoUrl: "https://provider.com/oauth/userinfo",
      scope: ["email", "profile"],
      // Map provider user data to Better Auth user
      mapProfile: (profile) => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        image: profile.avatar_url
      })
    }
  }
});
```

## Account Linking

Link multiple OAuth providers to same user account.

### Server Setup

```ts
export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"] // Auto-link these providers
    }
  }
});
```

### Client Usage

```ts
// Link new provider to existing account
await authClient.linkSocial({
  provider: "google",
  callbackURL: "/profile"
});

// List linked accounts
const { data: session } = await authClient.getSession();
const accounts = session.user.accounts;

// Unlink account
await authClient.unlinkAccount({
  accountId: "account-id"
});
```

## Token Management

### Access OAuth Tokens

```ts
// Server-side
const session = await auth.api.getSession({
  headers: request.headers
});

const accounts = await auth.api.listAccounts({
  userId: session.user.id
});

// Get specific provider token
const githubAccount = accounts.find(a => a.providerId === "github");
const accessToken = githubAccount.accessToken;
const refreshToken = githubAccount.refreshToken;
```

### Refresh Tokens

```ts
// Manually refresh OAuth token
const newToken = await auth.api.refreshToken({
  accountId: "account-id"
});
```

### Use Provider API

```ts
// Example: Use GitHub token to fetch repos
const githubAccount = accounts.find(a => a.providerId === "github");

const response = await fetch("https://api.github.com/user/repos", {
  headers: {
    Authorization: `Bearer ${githubAccount.accessToken}`
  }
});

const repos = await response.json();
```

## Advanced OAuth Configuration

### Custom Scopes

```ts
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: [
        "user:email",
        "read:user",
        "repo", // Access repositories
        "gist" // Access gists
      ]
    }
  }
});
```

### State Parameter

Better Auth automatically handles OAuth state parameter for CSRF protection.

```ts
// Custom state validation
export const auth = betterAuth({
  advanced: {
    generateState: async () => {
      // Custom state generation
      return crypto.randomUUID();
    },
    validateState: async (state: string) => {
      // Custom state validation
      return true;
    }
  }
});
```

### PKCE Support

Better Auth automatically uses PKCE (Proof Key for Code Exchange) for supported providers.

```ts
export const auth = betterAuth({
  socialProviders: {
    customProvider: {
      pkce: true, // Enable PKCE
      // ... other config
    }
  }
});
```

## Error Handling

### Client-Side

```ts
await authClient.signIn.social({
  provider: "github",
  errorCallbackURL: "/auth/error"
}, {
  onError: (ctx) => {
    console.error("OAuth error:", ctx.error);
    // Handle specific errors
    if (ctx.error.code === "OAUTH_ACCOUNT_ALREADY_LINKED") {
      alert("This account is already linked to another user");
    }
  }
});
```

### Server-Side

```ts
export const auth = betterAuth({
  callbacks: {
    async onOAuthError({ error, provider }) {
      console.error(`OAuth error with ${provider}:`, error);
      // Log to monitoring service
      await logError(error);
    }
  }
});
```

## Callback URLs

### Development

```
http://localhost:3000/api/auth/callback/{provider}
```

### Production

```
https://yourdomain.com/api/auth/callback/{provider}
```

**Important:** Add all callback URLs to OAuth provider settings.

## UI Components

### Sign In Button (React)

```tsx
import { authClient } from "@/lib/auth-client";

export function SocialSignIn() {
  const handleOAuth = async (provider: string) => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard"
    });
  };

  return (
    <div className="space-y-2">
      <button onClick={() => handleOAuth("github")}>
        Sign in with GitHub
      </button>
      <button onClick={() => handleOAuth("google")}>
        Sign in with Google
      </button>
      <button onClick={() => handleOAuth("discord")}>
        Sign in with Discord
      </button>
    </div>
  );
}
```

## Best Practices

1. **Callback URLs**: Add all environments (dev, staging, prod) to OAuth app
2. **Scopes**: Request minimum scopes needed
3. **Token Storage**: Better Auth stores tokens securely in database
4. **Token Refresh**: Implement automatic token refresh for long-lived sessions
5. **Account Linking**: Enable for better UX when user signs in with different providers
6. **Error Handling**: Provide clear error messages for OAuth failures
7. **Provider Icons**: Use official brand assets for OAuth buttons
8. **Mobile Deep Links**: Configure deep links for mobile OAuth flows
9. **Email Matching**: Consider auto-linking accounts with same email
10. **Privacy**: Inform users what data you access from OAuth providers

## Common Issues

### Redirect URI Mismatch

Ensure callback URL in OAuth app matches exactly:
```
http://localhost:3000/api/auth/callback/github
```

### Missing Scopes

Add required scopes for email access:
```ts
scope: ["user:email"] // GitHub
scope: ["email"] // Google
```

### HTTPS Required

Some providers (Apple, Microsoft) require HTTPS callbacks. Use ngrok for local development:
```bash
ngrok http 3000
```

### CORS Errors

Configure CORS if frontend/backend on different domains:
```ts
export const auth = betterAuth({
  advanced: {
    corsOptions: {
      origin: ["https://yourdomain.com"],
      credentials: true
    }
  }
});
```




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
