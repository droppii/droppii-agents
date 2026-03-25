---
name: ck:devops
description: Deploy to Cloudflare (Workers, R2, D1), Docker, GCP (Cloud Run, GKE), Kubernetes (kubectl, Helm). Use for serverless, containers, CI/CD, GitOps, security audit.
license: MIT
version: 2.0.0
argument-hint: "[platform] [task]"
---

# DevOps Skill

Deploy and manage cloud infrastructure across Cloudflare, Docker, Google Cloud, and Kubernetes.

## When to Use

- Deploy serverless apps to Cloudflare Workers/Pages
- Containerize apps with Docker, Docker Compose
- Manage GCP with gcloud CLI (Cloud Run, GKE, Cloud SQL)
- Kubernetes cluster management (kubectl, Helm)
- GitOps workflows (Argo CD, Flux)
- CI/CD pipelines, multi-region deployments
- Security audits, RBAC, network policies

## Platform Selection

| Need | Choose |
|------|--------|
| Sub-50ms latency globally | Cloudflare Workers |
| Large file storage (zero egress) | Cloudflare R2 |
| SQL database (global reads) | Cloudflare D1 |
| Containerized workloads | Docker + Cloud Run/GKE |
| Enterprise Kubernetes | GKE |
| Managed relational DB | Cloud SQL |
| Static site + API | Cloudflare Pages |
| Container orchestration | Kubernetes |
| Package management for K8s | Helm |

## Quick Start

```bash
# Cloudflare Worker
wrangler init my-worker && cd my-worker && wrangler deploy

# Docker
docker build -t myapp . && docker run -p 3000:3000 myapp

# GCP Cloud Run
gcloud run deploy my-service --image gcr.io/project/image --region us-central1

# Kubernetes
kubectl apply -f manifests/ && kubectl get pods
```

## Reference Navigation

### Cloudflare Platform
- `cloudflare-platform.md` - Edge computing overview
- `cloudflare-workers-basics.md` - Handler types, patterns
- `cloudflare-workers-advanced.md` - Performance, optimization
- `cloudflare-workers-apis.md` - Runtime APIs, bindings
- `cloudflare-r2-storage.md` - Object storage, S3 compatibility
- `cloudflare-d1-kv.md` - D1 SQLite, KV store
- `browser-rendering.md` - Puppeteer automation

### Docker
- `docker-basics.md` - Dockerfile, images, containers
- `docker-compose.md` - Multi-container apps

### Google Cloud
- `gcloud-platform.md` - gcloud CLI, authentication
- `gcloud-services.md` - Compute Engine, GKE, Cloud Run

### Kubernetes
- `kubernetes-basics.md` - Core concepts, architecture, workloads
- `kubernetes-kubectl.md` - Essential commands, debugging workflow
- `kubernetes-helm.md` / `kubernetes-helm-advanced.md` - Helm charts, templates
- `kubernetes-security.md` / `kubernetes-security-advanced.md` - RBAC, secrets
- `kubernetes-workflows.md` / `kubernetes-workflows-advanced.md` - GitOps, CI/CD
- `kubernetes-troubleshooting.md` / `kubernetes-troubleshooting-advanced.md` - Debug

### Scripts
- `scripts/cloudflare-deploy.py` - Automate Worker deployments
- `scripts/docker-optimize.py` - Analyze Dockerfiles

## Best Practices

**Security:** Non-root containers, RBAC, secrets in env vars, image scanning
**Performance:** Multi-stage builds, edge caching, resource limits
**Cost:** R2 for large egress, caching, right-size resources
**Development:** Docker Compose local dev, wrangler dev, version control IaC

## Resources

- Cloudflare: https://developers.cloudflare.com
- Docker: https://docs.docker.com
- GCP: https://cloud.google.com/docs
- Kubernetes: https://kubernetes.io/docs
- Helm: https://helm.sh/docs


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### browser rendering

# Cloudflare Browser Rendering

Headless browser automation with Puppeteer/Playwright on Cloudflare Workers.

## Setup

**wrangler.toml:**
```toml
name = "browser-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

browser = { binding = "MYBROWSER" }
```

## Basic Screenshot Worker

```typescript
import puppeteer from '@cloudflare/puppeteer';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();

    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();

    return new Response(screenshot, {
      headers: { 'Content-Type': 'image/png' }
    });
  }
};
```

## Session Reuse (Cost Optimization)

```typescript
// Disconnect instead of close
await browser.disconnect();

// Retrieve and reconnect
const sessions = await puppeteer.sessions(env.MYBROWSER);
const freeSession = sessions.find(s => !s.connectionId);

if (freeSession) {
  const browser = await puppeteer.connect(env.MYBROWSER, freeSession.sessionId);
}
```

## PDF Generation

```typescript
const browser = await puppeteer.launch(env.MYBROWSER);
const page = await browser.newPage();

await page.setContent(`
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial; padding: 50px; }
        h1 { color: #2c3e50; }
      </style>
    </head>
    <body>
      <h1>Certificate</h1>
      <p>Awarded to: <strong>John Doe</strong></p>
    </body>
  </html>
`);

const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
});

await browser.close();

return new Response(pdf, {
  headers: { 'Content-Type': 'application/pdf' }
});
```

## Durable Objects for Persistent Sessions

```typescript
export class Browser {
  state: DurableObjectState;
  browser: any;
  lastUsed: number;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.lastUsed = Date.now();
  }

  async fetch(request: Request, env: Env) {
    if (!this.browser) {
      this.browser = await puppeteer.launch(env.MYBROWSER);
    }

    this.lastUsed = Date.now();
    await this.state.storage.setAlarm(Date.now() + 10000);

    const page = await this.browser.newPage();
    const url = new URL(request.url).searchParams.get('url');
    await page.goto(url);
    const screenshot = await page.screenshot();
    await page.close();

    return new Response(screenshot, {
      headers: { 'Content-Type': 'image/png' }
    });
  }

  async alarm() {
    if (Date.now() - this.lastUsed > 60000) {
      await this.browser?.close();
      this.browser = null;
    } else {
      await this.state.storage.setAlarm(Date.now() + 10000);
    }
  }
}
```

## AI-Powered Web Scraper

```typescript
import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com');
    const content = await page.content();
    await browser.close();

    const ai = new Ai(env.AI);
    const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'Extract top 5 article titles and URLs as JSON'
        },
        { role: 'user', content: content }
      ]
    });

    return Response.json(response);
  }
};
```

## Crawler with Queues

```typescript
export default {
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    const browser = await puppeteer.launch(env.MYBROWSER);

    for (const message of batch.messages) {
      const page = await browser.newPage();
      await page.goto(message.body.url);

      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(a => a.href);
      });

      for (const link of links) {
        await env.QUEUE.send({ url: link });
      }

      await page.close();
      message.ack();
    }

    await browser.close();
  }
};
```

## Configuration

### Timeout
```typescript
await page.goto(url, {
  timeout: 60000,  // 60 seconds max
  waitUntil: 'networkidle2'
});

await page.waitForSelector('.content', { timeout: 45000 });
```

### Viewport
```typescript
await page.setViewport({ width: 1920, height: 1080 });
```

### Screenshot Options
```typescript
const screenshot = await page.screenshot({
  type: 'png',       // 'png' | 'jpeg' | 'webp'
  quality: 90,       // JPEG/WebP only
  fullPage: true,    // Full scrollable page
  clip: {            // Crop
    x: 0, y: 0,
    width: 800,
    height: 600
  }
});
```

## Limits & Pricing

### Free Plan
- 10 minutes/day
- 3 concurrent browsers
- 3 new browsers/minute

### Paid Plan
- 10 hours/month included
- 30 concurrent browsers
- 30 new browsers/minute
- $0.09/hour overage
- $2.00/concurrent browser overage

### Cost Optimization
1. Use `disconnect()` instead of `close()`
2. Enable Keep-Alive (10 min max)
3. Pool tabs with browser contexts
4. Cache auth state with KV
5. Implement Durable Objects cleanup

## Best Practices

### Session Management
- Always use `disconnect()` for reuse
- Implement session pooling
- Track session IDs and states

### Performance
- Cache content in KV
- Use browser contexts vs multiple browsers
- Choose appropriate `waitUntil` strategy
- Set realistic timeouts

### Error Handling
- Handle timeout errors gracefully
- Check session availability before connecting
- Validate responses before caching

### Security
- Validate user-provided URLs
- Implement authentication
- Sanitize extracted content
- Set appropriate CORS headers

## Troubleshooting

**Timeout Errors:**
```typescript
await page.goto(url, {
  timeout: 60000,
  waitUntil: 'domcontentloaded'  // Faster than networkidle2
});
```

**Memory Issues:**
```typescript
await page.close();  // Close pages
await browser.disconnect();  // Reuse session
```

**Font Rendering:**
Use supported fonts (Noto Sans, Roboto, etc.) or inject custom:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins" rel="stylesheet">
```

## Key Methods

### Puppeteer
- `puppeteer.launch(binding)` - Start browser
- `puppeteer.connect(binding, sessionId)` - Reconnect
- `puppeteer.sessions(binding)` - List sessions
- `browser.newPage()` - Create page
- `browser.disconnect()` - Disconnect (keep alive)
- `browser.close()` - Close (terminate)
- `page.goto(url, options)` - Navigate
- `page.screenshot(options)` - Capture
- `page.pdf(options)` - Generate PDF
- `page.content()` - Get HTML
- `page.evaluate(fn)` - Execute JS

## Resources

- Docs: https://developers.cloudflare.com/browser-rendering/
- Puppeteer: https://pptr.dev/
- Examples: https://developers.cloudflare.com/workers/examples/


### cloudflare d1 kv

# Cloudflare D1 & KV

## D1 (SQLite Database)

### Setup
```bash
# Create database
wrangler d1 create my-database

# Add to wrangler.toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "YOUR_DATABASE_ID"

# Apply schema
wrangler d1 execute my-database --file=./schema.sql
```

### Usage

```typescript
// Query
const result = await env.DB.prepare(
  "SELECT * FROM users WHERE id = ?"
).bind(userId).first();

// Insert
await env.DB.prepare(
  "INSERT INTO users (name, email) VALUES (?, ?)"
).bind("Alice", "alice@example.com").run();

// Batch (atomic)
await env.DB.batch([
  env.DB.prepare("UPDATE accounts SET balance = balance - 100 WHERE id = ?").bind(user1),
  env.DB.prepare("UPDATE accounts SET balance = balance + 100 WHERE id = ?").bind(user2)
]);

// All results
const { results } = await env.DB.prepare("SELECT * FROM users").all();
```

### Features
- Global read replication (low-latency reads)
- Single-writer consistency
- Standard SQLite syntax
- 25GB database size limit
- ACID transactions with batch

## KV (Key-Value Store)

### Setup
```bash
# Create namespace
wrangler kv:namespace create MY_KV

# Add to wrangler.toml
[[kv_namespaces]]
binding = "KV"
id = "YOUR_NAMESPACE_ID"
```

### Usage

```typescript
// Put with TTL
await env.KV.put("session:token", JSON.stringify(data), {
  expirationTtl: 3600,
  metadata: { userId: "123" }
});

// Get
const value = await env.KV.get("session:token");
const json = await env.KV.get("session:token", "json");
const buffer = await env.KV.get("session:token", "arrayBuffer");
const stream = await env.KV.get("session:token", "stream");

// Get with metadata
const { value, metadata } = await env.KV.getWithMetadata("session:token");

// Delete
await env.KV.delete("session:token");

// List
const list = await env.KV.list({ prefix: "user:" });
```

### Features
- Sub-millisecond reads (edge-cached)
- Eventual consistency (~60 seconds globally)
- 25MB value size limit
- Automatic expiration (TTL)

## Use Cases

### D1
- Relational data
- Complex queries with JOINs
- ACID transactions
- User accounts, orders, inventory

### KV
- Cache
- Sessions
- Feature flags
- Rate limiting
- Real-time counters

## Decision Matrix

| Need | Choose |
|------|--------|
| SQL queries | D1 |
| Sub-millisecond reads | KV |
| ACID transactions | D1 |
| Large values (>25MB) | R2 |
| Strong consistency | D1 (writes), Durable Objects |
| Automatic expiration | KV |

## Resources

- D1: https://developers.cloudflare.com/d1/
- KV: https://developers.cloudflare.com/kv/


### cloudflare platform

# Cloudflare Platform Overview

Cloudflare Developer Platform: comprehensive edge computing ecosystem for full-stack applications on global network across 300+ cities.

## Core Concepts

### Edge Computing Model

**Global Network:**
- Code runs on servers in 300+ cities globally
- Requests execute from nearest location
- Ultra-low latency (<50ms typical)
- Automatic failover and redundancy

**V8 Isolates:**
- Lightweight execution environments (faster than containers)
- Millisecond cold starts
- Zero infrastructure management
- Automatic scaling
- Pay-per-request pricing

### Key Components

**Workers** - Serverless functions on edge
- HTTP/scheduled/queue/email handlers
- JavaScript/TypeScript/Python/Rust support
- Max 50ms CPU (free), 30s (paid)
- 128MB memory limit

**D1** - SQLite database with global read replication
- Standard SQLite syntax
- Single-writer consistency
- Global read replication
- 25GB database size limit
- Batch operations for transactions

**KV** - Distributed key-value store
- Sub-millisecond reads (edge-cached)
- Eventual consistency (~60s globally)
- 25MB value size limit
- Automatic TTL expiration
- Best for: cache, sessions, feature flags

**R2** - Object storage (S3-compatible)
- Zero egress fees (huge cost advantage)
- Unlimited storage
- 5TB object size limit
- S3-compatible API
- Multipart upload support

**Durable Objects** - Stateful compute with WebSockets
- Single-instance coordination (strong consistency)
- Persistent storage (1GB limit paid)
- WebSocket support
- Automatic hibernation

**Queues** - Message queue system
- At-least-once delivery
- Automatic retries (exponential backoff)
- Dead-letter queue support
- Batch processing

**Pages** - Static site hosting + serverless functions
- Git integration (auto-deploy)
- Directory-based routing
- Framework support (Next.js, Remix, Astro, SvelteKit)
- Built-in preview deployments

**Workers AI** - Run AI models on edge
- LLMs (Llama 3, Mistral, Gemma, Qwen)
- Image generation (Stable Diffusion, DALL-E)
- Embeddings (BGE, GTE)
- Speech recognition (Whisper)
- No GPU management required

**Browser Rendering** - Headless browser automation
- Puppeteer/Playwright support
- Screenshots, PDFs, web scraping
- Session reuse for cost optimization
- MCP server support for AI agents

## Architecture Patterns

### Full-Stack Application

```
┌─────────────────────────────────────────┐
│    Cloudflare Pages (Frontend)          │
│    Next.js / Remix / Astro               │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    Workers (API Layer)                   │
│    - Routing                             │
│    - Authentication                      │
│    - Business logic                      │
└─┬──────┬──────┬──────┬──────┬───────────┘
  │      │      │      │      │
  ▼      ▼      ▼      ▼      ▼
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────────────┐
│ D1 │ │ KV │ │ R2 │ │ DO │ │ Workers AI │
└────┘ └────┘ └────┘ └────┘ └────────────┘
```

### Polyglot Storage Pattern

```typescript
export default {
  async fetch(request: Request, env: Env) {
    // KV: Fast cache
    const cached = await env.KV.get(key);
    if (cached) return new Response(cached);

    // D1: Structured data
    const user = await env.DB.prepare(
      "SELECT * FROM users WHERE id = ?"
    ).bind(userId).first();

    // R2: Media files
    const avatar = await env.R2_BUCKET.get(`avatars/${user.id}.jpg`);

    // Durable Objects: Real-time
    const chat = env.CHAT_ROOM.get(env.CHAT_ROOM.idFromName(roomId));

    // Queue: Async processing
    await env.EMAIL_QUEUE.send({ to: user.email, template: 'welcome' });

    return new Response(JSON.stringify({ user }));
  }
};
```

## Wrangler CLI Essentials

### Installation
```bash
npm install -g wrangler
wrangler login
wrangler init my-worker
```

### Core Commands
```bash
# Development
wrangler dev                    # Local dev server
wrangler dev --remote          # Dev on real edge

# Deployment
wrangler deploy                # Deploy to production
wrangler deploy --dry-run      # Preview changes

# Logs
wrangler tail                  # Real-time logs
wrangler tail --format pretty  # Formatted logs

# Versions
wrangler deployments list      # List deployments
wrangler rollback [version]    # Rollback

# Secrets
wrangler secret put SECRET_NAME
wrangler secret list
```

### Resource Management
```bash
# D1
wrangler d1 create my-db
wrangler d1 execute my-db --file=schema.sql

# KV
wrangler kv:namespace create MY_KV
wrangler kv:key put --binding=MY_KV "key" "value"

# R2
wrangler r2 bucket create my-bucket
wrangler r2 object put my-bucket/file.txt --file=./file.txt
```

## Configuration (wrangler.toml)

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Environment variables
[vars]
ENVIRONMENT = "production"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "YOUR_DATABASE_ID"

# KV Namespace
[[kv_namespaces]]
binding = "KV"
id = "YOUR_NAMESPACE_ID"

# R2 Bucket
[[r2_buckets]]
binding = "R2_BUCKET"
bucket_name = "my-bucket"

# Durable Objects
[[durable_objects.bindings]]
name = "COUNTER"
class_name = "Counter"
script_name = "my-worker"

# Queues
[[queues.producers]]
binding = "MY_QUEUE"
queue = "my-queue"

# Workers AI
[ai]
binding = "AI"

# Cron triggers
[triggers]
crons = ["0 0 * * *"]
```

## Best Practices

### Performance
- Keep Workers lightweight (<1MB bundled)
- Use bindings over fetch (faster than HTTP)
- Leverage KV and Cache API for frequently accessed data
- Use D1 batch for multiple queries
- Stream large responses

### Security
- Use `wrangler secret` for API keys
- Separate production/staging/development environments
- Validate user input
- Implement rate limiting (KV or Durable Objects)
- Configure proper CORS headers

### Cost Optimization
- R2 for large files (zero egress fees vs S3)
- KV for caching (reduce D1/R2 requests)
- Request deduplication with caching
- Efficient D1 queries (proper indexing)
- Monitor usage via Cloudflare Analytics

## Decision Matrix

| Need | Choose |
|------|--------|
| Sub-millisecond reads | KV |
| SQL queries | D1 |
| Large files (>25MB) | R2 |
| Real-time WebSockets | Durable Objects |
| Async background jobs | Queues |
| ACID transactions | D1 |
| Strong consistency | Durable Objects |
| Zero egress costs | R2 |
| AI inference | Workers AI |
| Static site hosting | Pages |

## Resources

- Docs: https://developers.cloudflare.com
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
- Discord: https://discord.cloudflare.com
- Examples: https://developers.cloudflare.com/workers/examples/
- Status: https://www.cloudflarestatus.com


### cloudflare r2 storage

# Cloudflare R2 Storage

S3-compatible object storage with zero egress fees.

## Quick Start

### Create Bucket
```bash
wrangler r2 bucket create my-bucket
wrangler r2 bucket create my-bucket --location=wnam
```

Locations: `wnam`, `enam`, `weur`, `eeur`, `apac`

### Upload Object
```bash
wrangler r2 object put my-bucket/file.txt --file=./local-file.txt
```

### Workers Binding

**wrangler.toml:**
```toml
[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"
```

**Worker:**
```typescript
// Put
await env.MY_BUCKET.put('user-uploads/photo.jpg', imageData, {
  httpMetadata: {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000'
  },
  customMetadata: {
    uploadedBy: userId,
    uploadDate: new Date().toISOString()
  }
});

// Get
const object = await env.MY_BUCKET.get('large-file.mp4');
if (!object) {
  return new Response('Not found', { status: 404 });
}

return new Response(object.body, {
  headers: {
    'Content-Type': object.httpMetadata.contentType,
    'ETag': object.etag
  }
});

// List
const listed = await env.MY_BUCKET.list({
  prefix: 'user-uploads/',
  limit: 100
});

// Delete
await env.MY_BUCKET.delete('old-file.txt');

// Head (check existence)
const object = await env.MY_BUCKET.head('file.txt');
if (object) {
  console.log('Size:', object.size);
}
```

## S3 API Integration

### AWS CLI
```bash
# Configure
aws configure
# Access Key ID: <your-key-id>
# Secret Access Key: <your-secret>
# Region: auto

# Operations
aws s3api list-buckets --endpoint-url https://<accountid>.r2.cloudflarestorage.com

aws s3 cp file.txt s3://my-bucket/ --endpoint-url https://<accountid>.r2.cloudflarestorage.com

# Presigned URL
aws s3 presign s3://my-bucket/file.txt --endpoint-url https://<accountid>.r2.cloudflarestorage.com --expires-in 3600
```

### JavaScript (AWS SDK v3)
```javascript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

await s3.send(new PutObjectCommand({
  Bucket: "my-bucket",
  Key: "file.txt",
  Body: fileContents
}));
```

### Python (Boto3)
```python
import boto3

s3 = boto3.client(
    service_name='s3',
    endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    region_name='auto'
)

s3.upload_fileobj(file_obj, 'my-bucket', 'file.txt')
s3.download_file('my-bucket', 'file.txt', './local-file.txt')
```

## Multipart Uploads

For files >100MB:

```typescript
const multipart = await env.MY_BUCKET.createMultipartUpload('large-file.mp4');

// Upload parts (5MiB - 5GiB each, max 10,000 parts)
const part1 = await multipart.uploadPart(1, chunk1);
const part2 = await multipart.uploadPart(2, chunk2);

// Complete
const object = await multipart.complete([part1, part2]);
```

### Rclone (Large Files)
```bash
rclone config  # Configure Cloudflare R2

# Upload with optimization
rclone copy large-video.mp4 r2:my-bucket/ \
  --s3-upload-cutoff=100M \
  --s3-chunk-size=100M
```

## Public Buckets

### Enable Public Access
1. Dashboard → R2 → Bucket → Settings → Public Access
2. Add custom domain (recommended) or use r2.dev

**r2.dev (rate-limited):**
```
https://pub-<hash>.r2.dev/file.txt
```

**Custom domain (production):**
Cloudflare handles DNS/TLS automatically

## CORS Configuration

```bash
wrangler r2 bucket cors put my-bucket --rules '[
  {
    "AllowedOrigins": ["https://example.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]'
```

## Lifecycle Rules

```bash
wrangler r2 bucket lifecycle put my-bucket --rules '[
  {
    "action": {"type": "AbortIncompleteMultipartUpload"},
    "filter": {},
    "abortIncompleteMultipartUploadDays": 7
  },
  {
    "action": {"type": "Transition", "storageClass": "InfrequentAccess"},
    "filter": {"prefix": "archives/"},
    "daysFromCreation": 90
  }
]'
```

## Event Notifications

```bash
wrangler r2 bucket notification create my-bucket \
  --queue=my-queue \
  --event-type=object-create
```

Supported events: `object-create`, `object-delete`

## Data Migration

### Sippy (Incremental)
```bash
wrangler r2 bucket sippy enable my-bucket \
  --provider=aws \
  --bucket=source-bucket \
  --region=us-east-1 \
  --access-key-id=$AWS_KEY \
  --secret-access-key=$AWS_SECRET
```

Objects migrate on first request.

### Super Slurper (Bulk)
Use dashboard for one-time complete migration from AWS, GCS, Azure.

## Best Practices

### Performance
- Use Cloudflare Cache with custom domains
- Multipart uploads for files >100MB
- Rclone for batch operations
- Location hints match user geography

### Security
- Never commit Access Keys
- Use environment variables
- Bucket-scoped tokens for least privilege
- Presigned URLs for temporary access
- Enable Cloudflare Access for protection

### Cost Optimization
- Infrequent Access storage for archives (30+ days)
- Lifecycle rules to auto-transition/delete
- Larger multipart chunks = fewer Class A operations
- Monitor usage via dashboard

### Naming
- Bucket names: lowercase, hyphens, 3-63 chars
- Avoid sequential prefixes (use hashed for performance)
- No dots in bucket names if using custom domains with TLS

## Limits

- Buckets per account: 1,000
- Object size: 5TB max
- Lifecycle rules: 1,000 per bucket
- Event notification rules: 100 per bucket
- r2.dev rate limit: 1,000 req/min (use custom domains)

## Troubleshooting

**401 Unauthorized:**
- Verify Access Keys
- Check endpoint URL includes account ID
- Ensure region is "auto"

**403 Forbidden:**
- Check bucket permissions
- Verify CORS configuration
- Confirm bucket exists

**Presigned URLs not working:**
- Verify CORS configuration
- Check URL expiry time
- Ensure origin matches CORS rules

## Resources

- Docs: https://developers.cloudflare.com/r2/
- Wrangler: https://developers.cloudflare.com/r2/reference/wrangler-commands/
- S3 Compatibility: https://developers.cloudflare.com/r2/api/s3/api/
- Workers API: https://developers.cloudflare.com/r2/api/workers/


### cloudflare workers advanced

# Cloudflare Workers Advanced Patterns

Advanced techniques for optimization, performance, and complex workflows.

## Session Reuse and Connection Pooling

### Durable Objects for Persistent Sessions
```typescript
export class Browser {
  state: DurableObjectState;
  browser: any;
  lastUsed: number;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.lastUsed = Date.now();
  }

  async fetch(request: Request, env: Env) {
    if (!this.browser) {
      this.browser = await puppeteer.launch(env.MYBROWSER);
    }

    this.lastUsed = Date.now();
    await this.state.storage.setAlarm(Date.now() + 10000);

    const page = await this.browser.newPage();
    await page.goto(new URL(request.url).searchParams.get('url'));
    const screenshot = await page.screenshot();
    await page.close();

    return new Response(screenshot);
  }

  async alarm() {
    if (Date.now() - this.lastUsed > 60000) {
      await this.browser?.close();
      this.browser = null;
    } else {
      await this.state.storage.setAlarm(Date.now() + 10000);
    }
  }
}
```

## Multi-Tier Caching Strategy

```typescript
const CACHE_TTL = 3600;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cache = caches.default;
    const cacheKey = new Request(request.url);

    // 1. Check edge cache
    let response = await cache.match(cacheKey);
    if (response) return response;

    // 2. Check KV cache
    const kvCached = await env.MY_KV.get(request.url);
    if (kvCached) {
      response = new Response(kvCached);
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // 3. Fetch from origin
    response = await fetch(request);

    // 4. Store in both caches
    ctx.waitUntil(Promise.all([
      cache.put(cacheKey, response.clone()),
      env.MY_KV.put(request.url, await response.clone().text(), {
        expirationTtl: CACHE_TTL
      })
    ]));

    return response;
  }
};
```

## WebSocket with Durable Objects

```typescript
export class ChatRoom {
  state: DurableObjectState;
  sessions: Set<WebSocket>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Set();
  }

  async fetch(request: Request) {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.state.acceptWebSocket(server);
    this.sessions.add(server);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    // Broadcast to all connected clients
    for (const session of this.sessions) {
      session.send(message);
    }
  }

  async webSocketClose(ws: WebSocket) {
    this.sessions.delete(ws);
  }
}
```

## Queue-Based Crawler

```typescript
export default {
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    const browser = await puppeteer.launch(env.MYBROWSER);

    for (const message of batch.messages) {
      const page = await browser.newPage();
      await page.goto(message.body.url);

      // Extract links
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.href);
      });

      // Queue new links
      for (const link of links) {
        await env.QUEUE.send({ url: link });
      }

      await page.close();
      message.ack();
    }

    await browser.close();
  }
};
```

## Authentication Pattern

```typescript
import { sign, verify } from 'hono/jwt';

async function authenticate(request: Request, env: Env): Promise<any> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing token');
  }

  const token = authHeader.substring(7);
  const payload = await verify(token, env.JWT_SECRET);

  return payload;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const user = await authenticate(request, env);
      return new Response(`Hello ${user.name}`);
    } catch (error) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
};
```

## Code Splitting

```typescript
// Lazy load large dependencies
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/heavy') {
      const { processHeavy } = await import('./heavy');
      return processHeavy(request);
    }

    return new Response('OK');
  }
};
```

## Batch Operations with D1

```typescript
// Efficient bulk inserts
const statements = users.map(user =>
  env.DB.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
    .bind(user.name, user.email)
);

await env.DB.batch(statements);
```

## Stream Processing

```typescript
const { readable, writable } = new TransformStream({
  transform(chunk, controller) {
    // Process chunk
    controller.enqueue(chunk);
  }
});

response.body.pipeTo(writable);
return new Response(readable);
```

## AI-Powered Web Scraper

```typescript
import { Ai } from '@cloudflare/ai';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Render page
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com');
    const content = await page.content();
    await browser.close();

    // Extract with AI
    const ai = new Ai(env.AI);
    const response = await ai.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        {
          role: 'system',
          content: 'Extract top 5 article titles and URLs as JSON array'
        },
        { role: 'user', content: content }
      ]
    });

    return Response.json(response);
  }
};
```

## Performance Optimization

### Bundle Size
- Keep Workers <1MB bundled
- Remove unused dependencies
- Use code splitting
- Check with: `wrangler deploy --dry-run --outdir=dist`

### Cold Starts
- Minimize initialization code
- Use bindings over fetch
- Avoid large imports at top level

### Memory Management
- Close pages when done: `await page.close()`
- Disconnect browsers: `await browser.disconnect()`
- Implement cleanup alarms in Durable Objects

### Request Optimization
- Use server-side filtering with `--filter`
- Batch operations with D1 `.batch()`
- Stream large responses
- Implement proper caching

## Monitoring & Debugging

```bash
# Real-time logs
wrangler tail --format pretty

# Filter by status
wrangler tail --status error

# Check deployments
wrangler deployments list

# Rollback
wrangler rollback [version-id]
```

## Production Checklist

- [ ] Multi-stage error handling implemented
- [ ] Rate limiting configured
- [ ] Caching strategy in place
- [ ] Secrets managed with `wrangler secret`
- [ ] Health checks implemented
- [ ] Monitoring alerts configured
- [ ] Session reuse for browser rendering
- [ ] Resource cleanup (pages, browsers)
- [ ] Proper timeout configurations
- [ ] CI/CD pipeline set up

## Resources

- Advanced Patterns: https://developers.cloudflare.com/workers/examples/
- Durable Objects: https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
- Performance: https://developers.cloudflare.com/workers/platform/limits/


### cloudflare workers apis

# Cloudflare Workers Runtime APIs

Key runtime APIs for Workers development.

## Fetch API

```typescript
// Subrequest
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' }),
  cf: {
    cacheTtl: 3600,
    cacheEverything: true
  }
});

const data = await response.json();
```

## Headers API

```typescript
// Read headers
const userAgent = request.headers.get('User-Agent');

// Cloudflare-specific
const country = request.cf?.country;
const colo = request.cf?.colo;
const clientIP = request.headers.get('CF-Connecting-IP');

// Set headers
const headers = new Headers();
headers.set('Content-Type', 'application/json');
headers.append('X-Custom-Header', 'value');
```

## HTMLRewriter

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const response = await fetch(request);

    return new HTMLRewriter()
      .on('title', {
        element(element) {
          element.setInnerContent('New Title');
        }
      })
      .on('a[href]', {
        element(element) {
          const href = element.getAttribute('href');
          element.setAttribute('href', href.replace('http://', 'https://'));
        }
      })
      .transform(response);
  }
};
```

## WebSockets

```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get('Upgrade');
    if (upgradeHeader !== 'websocket') {
      return new Response('Expected WebSocket', { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();

    server.addEventListener('message', (event) => {
      server.send(`Echo: ${event.data}`);
    });

    return new Response(null, {
      status: 101,
      webSocket: client
    });
  }
};
```

## Streams API

```typescript
const { readable, writable } = new TransformStream();

const writer = writable.getWriter();
writer.write(new TextEncoder().encode('chunk 1'));
writer.write(new TextEncoder().encode('chunk 2'));
writer.close();

return new Response(readable, {
  headers: { 'Content-Type': 'text/plain' }
});
```

## Web Crypto API

```typescript
// Generate hash
const data = new TextEncoder().encode('message');
const hashBuffer = await crypto.subtle.digest('SHA-256', data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

// HMAC signature
const key = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode('secret'),
  { name: 'HMAC', hash: 'SHA-256' },
  false,
  ['sign', 'verify']
);

const signature = await crypto.subtle.sign('HMAC', key, data);
const valid = await crypto.subtle.verify('HMAC', key, signature, data);

// Random values
const randomBytes = crypto.getRandomValues(new Uint8Array(32));
const uuid = crypto.randomUUID();
```

## Encoding APIs

```typescript
// TextEncoder
const encoder = new TextEncoder();
const bytes = encoder.encode('Hello');

// TextDecoder
const decoder = new TextDecoder();
const text = decoder.decode(bytes);

// Base64
const base64 = btoa('Hello');
const decoded = atob(base64);
```

## URL API

```typescript
const url = new URL(request.url);
const hostname = url.hostname;
const pathname = url.pathname;
const search = url.search;

// Query parameters
const name = url.searchParams.get('name');
url.searchParams.set('page', '2');
url.searchParams.delete('old');
```

## FormData API

```typescript
// Parse form data
const formData = await request.formData();
const name = formData.get('name');
const file = formData.get('file');

// Create form data
const form = new FormData();
form.append('name', 'value');
form.append('file', blob, 'filename.txt');
```

## Response Types

```typescript
// Text
return new Response('Hello');

// JSON
return Response.json({ message: 'Hello' });

// Stream
return new Response(readable);

// Redirect
return Response.redirect('https://example.com', 302);

// Error
return new Response('Not Found', { status: 404 });
```

## Request Cloning

```typescript
// Clone for multiple reads
const clone = request.clone();
const body1 = await request.json();
const body2 = await clone.json();
```

## AbortController

```typescript
const controller = new AbortController();
const { signal } = controller;

setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch('https://slow-api.com', { signal });
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request timed out');
  }
}
```

## Scheduling APIs

```typescript
// setTimeout
const timeoutId = setTimeout(() => {
  console.log('Delayed');
}, 1000);

// setInterval
const intervalId = setInterval(() => {
  console.log('Repeated');
}, 1000);

// Clear
clearTimeout(timeoutId);
clearInterval(intervalId);
```

## Console API

```typescript
console.log('Info message');
console.error('Error message');
console.warn('Warning message');
console.debug('Debug message');

// Structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'Request processed',
  url: request.url,
  timestamp: new Date().toISOString()
}));
```

## Performance API

```typescript
const start = performance.now();
await processRequest();
const duration = performance.now() - start;
console.log(`Processed in ${duration}ms`);
```

## Bindings Reference

### KV Operations
```typescript
await env.KV.put(key, value, { expirationTtl: 3600, metadata: { userId: '123' } });
const value = await env.KV.get(key, 'json');
const { value, metadata } = await env.KV.getWithMetadata(key);
await env.KV.delete(key);
const list = await env.KV.list({ prefix: 'user:' });
```

### D1 Operations
```typescript
const result = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
const { results } = await env.DB.prepare('SELECT * FROM users').all();
await env.DB.prepare('INSERT INTO users (name) VALUES (?)').bind(name).run();
await env.DB.batch([stmt1, stmt2, stmt3]);
```

### R2 Operations
```typescript
await env.R2.put(key, value, { httpMetadata: { contentType: 'image/jpeg' } });
const object = await env.R2.get(key);
await env.R2.delete(key);
const list = await env.R2.list({ prefix: 'uploads/' });
const multipart = await env.R2.createMultipartUpload(key);
```

### Queue Operations
```typescript
await env.QUEUE.send({ type: 'email', to: 'user@example.com' });
await env.QUEUE.sendBatch([{ body: msg1 }, { body: msg2 }]);
```

### Workers AI
```typescript
const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
  messages: [{ role: 'user', content: 'What is edge computing?' }]
});
```

## Resources

- Runtime APIs: https://developers.cloudflare.com/workers/runtime-apis/
- Web Standards: https://developers.cloudflare.com/workers/runtime-apis/web-standards/
- Bindings: https://developers.cloudflare.com/workers/runtime-apis/bindings/


### cloudflare workers basics

# Cloudflare Workers Basics

Getting started with Cloudflare Workers: serverless functions that run on edge network across 300+ cities.

## Handler Types

### Fetch Handler (HTTP Requests)
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response('Hello World!');
  }
};
```

### Scheduled Handler (Cron Jobs)
```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    await fetch('https://api.example.com/cleanup');
  }
};
```

**Configure in wrangler.toml:**
```toml
[triggers]
crons = ["0 0 * * *"]  # Daily at midnight
```

### Queue Handler (Message Processing)
```typescript
export default {
  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    for (const message of batch.messages) {
      await processMessage(message.body);
      message.ack();  // Acknowledge success
    }
  }
};
```

### Email Handler (Email Routing)
```typescript
export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
    await message.forward('destination@example.com');
  }
};
```

## Request/Response Basics

### Parsing Request
```typescript
const url = new URL(request.url);
const method = request.method;
const headers = request.headers;

// Query parameters
const name = url.searchParams.get('name');

// JSON body
const data = await request.json();

// Text body
const text = await request.text();

// Form data
const formData = await request.formData();
```

### Creating Response
```typescript
// Text response
return new Response('Hello', { status: 200 });

// JSON response
return new Response(JSON.stringify({ message: 'Hello' }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});

// Stream response
return new Response(readable, {
  headers: { 'Content-Type': 'text/plain' }
});

// Redirect
return Response.redirect('https://example.com', 302);
```

## Routing Patterns

### URL-Based Routing
```typescript
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/':
        return new Response('Home');
      case '/about':
        return new Response('About');
      default:
        return new Response('Not Found', { status: 404 });
    }
  }
};
```

### Using Hono Framework (Recommended)
```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Home'));
app.get('/api/users/:id', async (c) => {
  const id = c.req.param('id');
  const user = await getUser(id);
  return c.json(user);
});

export default app;
```

## Working with Bindings

### Environment Variables
```toml
# wrangler.toml
[vars]
API_URL = "https://api.example.com"
```

```typescript
const apiUrl = env.API_URL;
```

### KV Namespace
```typescript
// Put with TTL
await env.KV.put('session:token', JSON.stringify(data), {
  expirationTtl: 3600
});

// Get
const data = await env.KV.get('session:token', 'json');

// Delete
await env.KV.delete('session:token');

// List with prefix
const list = await env.KV.list({ prefix: 'user:123:' });
```

### D1 Database
```typescript
// Query
const result = await env.DB.prepare(
  'SELECT * FROM users WHERE id = ?'
).bind(userId).first();

// Insert
await env.DB.prepare(
  'INSERT INTO users (name, email) VALUES (?, ?)'
).bind('Alice', 'alice@example.com').run();

// Batch (atomic)
await env.DB.batch([
  env.DB.prepare('UPDATE accounts SET balance = balance - 100 WHERE id = ?').bind(1),
  env.DB.prepare('UPDATE accounts SET balance = balance + 100 WHERE id = ?').bind(2)
]);
```

### R2 Bucket
```typescript
// Put object
await env.R2_BUCKET.put('path/to/file.jpg', fileBuffer, {
  httpMetadata: {
    contentType: 'image/jpeg'
  }
});

// Get object
const object = await env.R2_BUCKET.get('path/to/file.jpg');
if (!object) {
  return new Response('Not found', { status: 404 });
}

// Stream response
return new Response(object.body, {
  headers: {
    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream'
  }
});

// Delete
await env.R2_BUCKET.delete('path/to/file.jpg');
```

## Context API

### waitUntil (Background Tasks)
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Run analytics after response sent
    ctx.waitUntil(
      fetch('https://analytics.example.com/log', {
        method: 'POST',
        body: JSON.stringify({ url: request.url })
      })
    );

    return new Response('OK');
  }
};
```

### passThroughOnException
```typescript
// Continue to origin on error
ctx.passThroughOnException();

// Your code that might throw
const data = await riskyOperation();
```

## Error Handling

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const response = await processRequest(request, env);
      return response;
    } catch (error) {
      console.error('Error:', error);

      // Log to external service
      ctx.waitUntil(
        fetch('https://logging.example.com/error', {
          method: 'POST',
          body: JSON.stringify({
            error: error.message,
            url: request.url
          })
        })
      );

      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
```

## CORS

```typescript
function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get('Origin') || '*';

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    // Handle request
    const response = await handleRequest(request);
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
```

## Cache API

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const cache = caches.default;
    const cacheKey = new Request(request.url);

    // Check cache
    let response = await cache.match(cacheKey);
    if (response) return response;

    // Fetch from origin
    response = await fetch(request);

    // Cache response
    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  }
};
```

## Secrets Management

```bash
# Add secret
wrangler secret put API_KEY
# Enter value when prompted

# Use in Worker
const apiKey = env.API_KEY;
```

## Local Development

```bash
# Start local dev server
wrangler dev

# Test with remote edge
wrangler dev --remote

# Custom port
wrangler dev --port 8080

# Access at http://localhost:8787
```

## Deployment

```bash
# Deploy to production
wrangler deploy

# Deploy to specific environment
wrangler deploy --env staging

# Preview deployment
wrangler deploy --dry-run
```

## Common Patterns

### API Gateway
```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/api/users', async (c) => {
  const users = await c.env.DB.prepare('SELECT * FROM users').all();
  return c.json(users.results);
});

app.post('/api/users', async (c) => {
  const { name, email } = await c.req.json();
  await c.env.DB.prepare(
    'INSERT INTO users (name, email) VALUES (?, ?)'
  ).bind(name, email).run();
  return c.json({ success: true }, 201);
});

export default app;
```

### Rate Limiting
```typescript
async function rateLimit(ip: string, env: Env): Promise<boolean> {
  const key = `ratelimit:${ip}`;
  const limit = 100;
  const window = 60;

  const current = await env.KV.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) return false;

  await env.KV.put(key, (count + 1).toString(), {
    expirationTtl: window
  });

  return true;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (!await rateLimit(ip, env)) {
      return new Response('Rate limit exceeded', { status: 429 });
    }

    return new Response('OK');
  }
};
```

## Resources

- Docs: https://developers.cloudflare.com/workers/
- Examples: https://developers.cloudflare.com/workers/examples/
- Runtime APIs: https://developers.cloudflare.com/workers/runtime-apis/


### docker basics

# Docker Basics

Core concepts and workflows for Docker containerization.

## Core Concepts

**Containers:** Lightweight, isolated processes bundling apps with dependencies. Ephemeral by default.

**Images:** Read-only blueprints for containers. Layered filesystem for reusability.

**Volumes:** Persistent storage surviving container deletion.

**Networks:** Enable container communication.

## Dockerfile Best Practices

### Essential Instructions
```dockerfile
FROM node:20-alpine              # Base image (use specific versions)
WORKDIR /app                     # Working directory
COPY package*.json ./            # Copy dependency files first
RUN npm install --production     # Execute build commands
COPY . .                         # Copy application code
ENV NODE_ENV=production          # Environment variables
EXPOSE 3000                      # Document exposed ports
USER node                        # Run as non-root (security)
CMD ["node", "server.js"]        # Default command
```

### Multi-Stage Builds (Production)
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Benefits: Smaller images, improved security, no build tools in production.

### .dockerignore
```
node_modules
.git
.env
*.log
.DS_Store
README.md
docker-compose.yml
dist
coverage
```

## Building Images

```bash
# Build with tag
docker build -t myapp:1.0 .

# Build targeting specific stage
docker build -t myapp:dev --target build .

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:1.0 .

# View layers
docker image history myapp:1.0
```

## Running Containers

```bash
# Basic run
docker run myapp:1.0

# Background (detached)
docker run -d --name myapp myapp:1.0

# Port mapping (host:container)
docker run -p 8080:3000 myapp:1.0

# Environment variables
docker run -e NODE_ENV=production myapp:1.0

# Volume mount (named volume)
docker run -v mydata:/app/data myapp:1.0

# Bind mount (development)
docker run -v $(pwd)/src:/app/src myapp:1.0

# Resource limits
docker run --memory 512m --cpus 0.5 myapp:1.0

# Interactive terminal
docker run -it myapp:1.0 /bin/sh
```

## Container Management

```bash
# List containers
docker ps
docker ps -a

# Logs
docker logs myapp
docker logs -f myapp          # Follow
docker logs --tail 100 myapp  # Last 100 lines

# Execute command
docker exec myapp ls /app
docker exec -it myapp /bin/sh  # Interactive shell

# Stop/start
docker stop myapp
docker start myapp

# Remove
docker rm myapp
docker rm -f myapp  # Force remove running

# Inspect
docker inspect myapp

# Monitor resources
docker stats myapp

# Copy files
docker cp myapp:/app/logs ./logs
```

## Volume Management

```bash
# Create volume
docker volume create mydata

# List volumes
docker volume ls

# Remove volume
docker volume rm mydata

# Remove unused volumes
docker volume prune
```

## Network Management

```bash
# Create network
docker network create my-network

# List networks
docker network ls

# Connect container
docker network connect my-network myapp

# Disconnect
docker network disconnect my-network myapp
```

## Language-Specific Dockerfiles

### Node.js
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
CMD ["node", "dist/server.js"]
```

### Python
```dockerfile
FROM python:3.11-slim AS build
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
RUN adduser --disabled-password appuser
USER appuser
CMD ["python", "app.py"]
```

### Go
```dockerfile
FROM golang:1.21-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

FROM scratch
COPY --from=build /app/main /main
CMD ["/main"]
```

## Security Hardening

```dockerfile
# Use specific versions
FROM node:20.11.0-alpine3.19

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root
USER nodejs
```

## Troubleshooting

### Container exits immediately
```bash
docker logs myapp
docker run -it myapp /bin/sh
docker run -it --entrypoint /bin/sh myapp
```

### Cannot connect
```bash
docker ps
docker port myapp
docker network inspect bridge
docker inspect myapp | grep IPAddress
```

### Out of disk space
```bash
docker system df
docker system prune -a
docker volume prune
```

### Build cache issues
```bash
docker build --no-cache -t myapp .
docker builder prune
```

## Best Practices

- Use specific image versions, not `latest`
- Run as non-root user
- Multi-stage builds to minimize size
- Implement health checks
- Set resource limits
- Keep images under 500MB
- Scan for vulnerabilities: `docker scout cves myapp:1.0`

## Quick Reference

| Task | Command |
|------|---------|
| Build | `docker build -t myapp:1.0 .` |
| Run | `docker run -d -p 8080:3000 myapp:1.0` |
| Logs | `docker logs -f myapp` |
| Shell | `docker exec -it myapp /bin/sh` |
| Stop | `docker stop myapp` |
| Remove | `docker rm myapp` |
| Clean | `docker system prune -a` |

## Resources

- Docs: https://docs.docker.com
- Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Dockerfile Reference: https://docs.docker.com/engine/reference/builder/


### docker compose

# Docker Compose

Multi-container application orchestration.

## Basic Structure

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
    networks:
      - app-network
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    networks:
      - app-network
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

## Commands

```bash
# Start services
docker compose up
docker compose up -d

# Build images before starting
docker compose up --build

# Scale service
docker compose up -d --scale web=3

# Stop services
docker compose down

# Stop and remove volumes
docker compose down --volumes

# Logs
docker compose logs
docker compose logs -f web

# Execute command
docker compose exec web sh
docker compose exec db psql -U user -d app

# List services
docker compose ps

# Restart service
docker compose restart web

# Pull images
docker compose pull

# Validate
docker compose config
```

## Environment-Specific Configs

**compose.yml (base):**
```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
```

**compose.override.yml (dev, auto-loaded):**
```yaml
services:
  web:
    volumes:
      - ./src:/app/src  # Live reload
    environment:
      - NODE_ENV=development
      - DEBUG=true
    command: npm run dev
```

**compose.prod.yml (production):**
```yaml
services:
  web:
    image: registry.example.com/myapp:1.0
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

**Usage:**
```bash
# Development (uses compose.yml + compose.override.yml)
docker compose up

# Production
docker compose -f compose.yml -f compose.prod.yml up -d
```

## Health Checks

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      start_period: 40s
      retries: 3
```

## Resource Limits

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Logging

```yaml
services:
  web:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Environment Variables

**Using .env file:**
```bash
# .env
DATABASE_URL=postgresql://user:pass@db:5432/app
API_KEY=secret
```

```yaml
services:
  web:
    env_file:
      - .env
```

## Networking

Services on same network communicate via service name:

```yaml
services:
  web:
    depends_on:
      - db
    environment:
      # Use service name as hostname
      - DATABASE_URL=postgresql://user:pass@db:5432/app
```

## Volume Backup/Restore

```bash
# Backup
docker compose run --rm -v app_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz /data

# Restore
docker compose run --rm -v app_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

## Common Stacks

### Web + Database + Cache
```yaml
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  db:
    image: postgres:15-alpine
  redis:
    image: redis:7-alpine
```

### Microservices
```yaml
services:
  api-gateway:
    build: ./gateway
  user-service:
    build: ./services/users
  order-service:
    build: ./services/orders
  rabbitmq:
    image: rabbitmq:3-management
```

## Best Practices

- Use named volumes for data persistence
- Implement health checks for all services
- Set restart policies for production
- Use environment-specific compose files
- Configure resource limits
- Enable logging with size limits
- Use depends_on for service ordering
- Network isolation with custom networks

## Troubleshooting

```bash
# View service logs
docker compose logs -f service-name

# Check service status
docker compose ps

# Restart specific service
docker compose restart service-name

# Rebuild service
docker compose up --build service-name

# Remove everything
docker compose down --volumes --rmi all
```

## Resources

- Docs: https://docs.docker.com/compose/
- Compose Specification: https://docs.docker.com/compose/compose-file/
- Best Practices: https://docs.docker.com/compose/production/


### gcloud platform

# Google Cloud Platform with gcloud CLI

Comprehensive guide for gcloud CLI - command-line interface for Google Cloud Platform.

## Installation

### Linux
```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xf google-cloud-cli-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init
```

### Debian/Ubuntu
```bash
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli
```

### macOS
```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-darwin-arm.tar.gz
tar -xf google-cloud-cli-darwin-arm.tar.gz
./google-cloud-sdk/install.sh
```

## Authentication

### User Account
```bash
# Login with browser
gcloud auth login

# Login without browser (remote/headless)
gcloud auth login --no-browser

# List accounts
gcloud auth list

# Switch account
gcloud config set account user@example.com
```

### Service Account
```bash
# Activate with key file
gcloud auth activate-service-account SA_EMAIL --key-file=key.json

# Create service account
gcloud iam service-accounts create SA_NAME \
  --display-name="Service Account"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=SA_EMAIL

# Grant role
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SA_EMAIL" \
  --role="roles/compute.admin"
```

### Service Account Impersonation (Recommended)
```bash
# Impersonate for single command
gcloud compute instances list \
  --impersonate-service-account=SA_EMAIL

# Set default impersonation
gcloud config set auth/impersonate_service_account SA_EMAIL

# Clear impersonation
gcloud config unset auth/impersonate_service_account
```

Why impersonation? Short-lived credentials, no key files, centralized management.

## Configuration Management

### Named Configurations
```bash
# Create configuration
gcloud config configurations create dev

# List configurations
gcloud config configurations list

# Activate configuration
gcloud config configurations activate dev

# Set properties
gcloud config set project my-project-dev
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# View properties
gcloud config list

# Delete configuration
gcloud config configurations delete dev
```

### Multi-Environment Pattern
```bash
# Development
gcloud config configurations create dev
gcloud config set project my-project-dev
gcloud config set account dev@example.com

# Staging
gcloud config configurations create staging
gcloud config set project my-project-staging
gcloud config set auth/impersonate_service_account staging-sa@project.iam.gserviceaccount.com

# Production
gcloud config configurations create prod
gcloud config set project my-project-prod
gcloud config set auth/impersonate_service_account prod-sa@project.iam.gserviceaccount.com
```

## Project Management

```bash
# List projects
gcloud projects list

# Create project
gcloud projects create PROJECT_ID --name="Project Name"

# Set active project
gcloud config set project PROJECT_ID

# Get current project
gcloud config get-value project

# Enable API
gcloud services enable compute.googleapis.com
gcloud services enable container.googleapis.com

# List enabled APIs
gcloud services list
```

## Output Formats

```bash
# JSON (recommended for scripting)
gcloud compute instances list --format=json

# YAML
gcloud compute instances list --format=yaml

# CSV
gcloud compute instances list --format="csv(name,zone,status)"

# Value (single field)
gcloud config get-value project --format="value()"

# Custom table
gcloud compute instances list \
  --format="table(name,zone,machineType,status)"
```

## Filtering

```bash
# Server-side filtering (efficient)
gcloud compute instances list --filter="zone:us-central1-a"
gcloud compute instances list --filter="status=RUNNING"
gcloud compute instances list --filter="name~^web-.*"

# Multiple conditions
gcloud compute instances list \
  --filter="zone:us-central1 AND status=RUNNING"

# Negation
gcloud compute instances list --filter="NOT status=TERMINATED"
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - id: auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Deploy
        run: |
          gcloud run deploy my-service \
            --image=gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-image \
            --region=us-central1
```

### GitLab CI
```yaml
deploy:
  image: google/cloud-sdk:alpine
  script:
    - echo $GCP_SA_KEY | base64 -d > key.json
    - gcloud auth activate-service-account --key-file=key.json
    - gcloud config set project $GCP_PROJECT_ID
    - gcloud app deploy
  only:
    - main
```

## Best Practices

### Security
- Never commit credentials
- Use service account impersonation
- Grant minimal IAM permissions
- Rotate keys regularly

### Performance
- Use server-side filtering: `--filter`
- Limit output: `--limit=10`
- Project only needed fields: `--format="value(name)"`
- Batch operations with `--async`

### Maintainability
- Use named configurations for environments
- Document commands
- Use environment variables
- Implement error handling and retries

## Troubleshooting

```bash
# Check authentication
gcloud auth list

# Re-authenticate
gcloud auth login
gcloud auth application-default login

# Check IAM permissions
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:user@example.com"

# View configuration
gcloud config list

# Reset configuration
gcloud config configurations delete default
gcloud init
```

## Quick Reference

| Task | Command |
|------|---------|
| Initialize | `gcloud init` |
| Login | `gcloud auth login` |
| Set project | `gcloud config set project PROJECT_ID` |
| List resources | `gcloud [SERVICE] list` |
| Create resource | `gcloud [SERVICE] create RESOURCE` |
| Delete resource | `gcloud [SERVICE] delete RESOURCE` |
| Get help | `gcloud [SERVICE] --help` |

## Global Flags

| Flag | Purpose |
|------|---------|
| `--project` | Override project |
| `--format` | Output format (json, yaml, csv) |
| `--filter` | Server-side filter |
| `--limit` | Limit results |
| `--quiet` | Suppress prompts |
| `--verbosity` | Log level (debug, info, warning, error) |
| `--async` | Don't wait for operation |

## Resources

- gcloud Reference: https://cloud.google.com/sdk/gcloud/reference
- Installation: https://cloud.google.com/sdk/docs/install
- Authentication: https://cloud.google.com/docs/authentication
- Cheatsheet: https://cloud.google.com/sdk/docs/cheatsheet


### gcloud services

# Google Cloud Services

## Compute Engine (VMs)

```bash
# List instances
gcloud compute instances list

# Create instance
gcloud compute instances create my-instance \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=debian-11 \
  --image-project=debian-cloud \
  --boot-disk-size=10GB

# SSH into instance
gcloud compute ssh my-instance --zone=us-central1-a

# Copy files
gcloud compute scp local-file.txt my-instance:~/remote-file.txt \
  --zone=us-central1-a

# Stop instance
gcloud compute instances stop my-instance --zone=us-central1-a

# Delete instance
gcloud compute instances delete my-instance --zone=us-central1-a
```

## Google Kubernetes Engine (GKE)

```bash
# Create cluster
gcloud container clusters create my-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=e2-medium

# Get credentials
gcloud container clusters get-credentials my-cluster --zone=us-central1-a

# List clusters
gcloud container clusters list

# Resize cluster
gcloud container clusters resize my-cluster \
  --num-nodes=5 \
  --zone=us-central1-a

# Delete cluster
gcloud container clusters delete my-cluster --zone=us-central1-a
```

## Cloud Run (Serverless Containers)

```bash
# Deploy container
gcloud run deploy my-service \
  --image=gcr.io/PROJECT_ID/my-image:tag \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated

# List services
gcloud run services list

# Describe service
gcloud run services describe my-service --region=us-central1

# Delete service
gcloud run services delete my-service --region=us-central1
```

## App Engine

```bash
# Deploy application
gcloud app deploy app.yaml

# View application
gcloud app browse

# View logs
gcloud app logs tail

# List versions
gcloud app versions list

# Delete version
gcloud app versions delete VERSION_ID

# Set traffic split
gcloud app services set-traffic SERVICE \
  --splits v1=0.5,v2=0.5
```

## Cloud Storage

```bash
# Create bucket
gsutil mb gs://my-bucket-name

# Upload file
gsutil cp local-file.txt gs://my-bucket-name/

# Download file
gsutil cp gs://my-bucket-name/file.txt ./

# List contents
gsutil ls gs://my-bucket-name/

# Sync directory
gsutil rsync -r ./local-dir gs://my-bucket-name/remote-dir

# Set permissions
gsutil iam ch user:user@example.com:objectViewer gs://my-bucket-name

# Delete bucket
gsutil rm -r gs://my-bucket-name
```

## Cloud SQL

```bash
# Create instance
gcloud sql instances create my-instance \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create my-database \
  --instance=my-instance

# Create user
gcloud sql users create my-user \
  --instance=my-instance \
  --password=PASSWORD

# Connect
gcloud sql connect my-instance --user=my-user

# Delete instance
gcloud sql instances delete my-instance
```

## Cloud Functions

```bash
# Deploy function
gcloud functions deploy my-function \
  --runtime=python39 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point=main

# List functions
gcloud functions list

# Describe function
gcloud functions describe my-function

# Call function
gcloud functions call my-function

# Delete function
gcloud functions delete my-function
```

## BigQuery

```bash
# List datasets
bq ls

# Create dataset
bq mk my_dataset

# Load data
bq load --source_format=CSV my_dataset.my_table \
  gs://my-bucket/data.csv \
  schema.json

# Query
bq query --use_legacy_sql=false \
  'SELECT * FROM `my_dataset.my_table` LIMIT 10'

# Delete dataset
bq rm -r -f my_dataset
```

## Cloud Build

```bash
# Submit build
gcloud builds submit --tag=gcr.io/PROJECT_ID/my-image

# List builds
gcloud builds list

# Describe build
gcloud builds describe BUILD_ID

# Cancel build
gcloud builds cancel BUILD_ID
```

## Artifact Registry

```bash
# Create repository
gcloud artifacts repositories create my-repo \
  --repository-format=docker \
  --location=us-central1

# Configure Docker
gcloud auth configure-docker us-central1-docker.pkg.dev

# Push image
docker tag my-image us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image
docker push us-central1-docker.pkg.dev/PROJECT_ID/my-repo/my-image

# List repositories
gcloud artifacts repositories list
```

## Networking

```bash
# Create VPC network
gcloud compute networks create my-network \
  --subnet-mode=auto

# Create firewall rule
gcloud compute firewall-rules create allow-http \
  --network=my-network \
  --allow=tcp:80

# List networks
gcloud compute networks list

# List firewall rules
gcloud compute firewall-rules list
```

## IAM

```bash
# List IAM policy
gcloud projects get-iam-policy PROJECT_ID

# Add IAM binding
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="user:user@example.com" \
  --role="roles/viewer"

# Remove IAM binding
gcloud projects remove-iam-policy-binding PROJECT_ID \
  --member="user:user@example.com" \
  --role="roles/viewer"

# List service accounts
gcloud iam service-accounts list
```

## Monitoring & Logging

```bash
# View logs
gcloud logging read "resource.type=gce_instance" \
  --limit=10 \
  --format=json

# Create log sink
gcloud logging sinks create my-sink \
  storage.googleapis.com/my-bucket \
  --log-filter="resource.type=gce_instance"

# List metrics
gcloud monitoring metrics-descriptors list
```

## Quick Reference

| Service | Command Prefix |
|---------|----------------|
| Compute Engine | `gcloud compute` |
| GKE | `gcloud container` |
| Cloud Run | `gcloud run` |
| App Engine | `gcloud app` |
| Cloud Storage | `gsutil` |
| BigQuery | `bq` |
| Cloud SQL | `gcloud sql` |
| Cloud Functions | `gcloud functions` |
| IAM | `gcloud iam` |

## Resources

- Compute Engine: https://cloud.google.com/compute/docs
- GKE: https://cloud.google.com/kubernetes-engine/docs
- Cloud Run: https://cloud.google.com/run/docs
- App Engine: https://cloud.google.com/appengine/docs
- Cloud Storage: https://cloud.google.com/storage/docs


### kubernetes basics

# Kubernetes Core Concepts

## Cluster Architecture

```
CONTROL PLANE                    WORKER NODES
├── API Server (kubectl)         ├── Kubelet (node agent)
├── Scheduler (pod placement)    ├── Kube-proxy (networking)
├── Controller Manager           └── Container Runtime
└── etcd (cluster state)
```

## Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
spec:
  containers:
  - name: myapp
    image: myapp:1.0
    ports:
    - containerPort: 8080
    resources:
      requests: { memory: "256Mi", cpu: "250m" }
      limits: { memory: "512Mi", cpu: "500m" }
```

## Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  selector:
    matchLabels: { app: myapp }
  template:
    metadata:
      labels: { app: myapp }
    spec:
      containers:
      - name: myapp
        image: myapp:1.0
```

## Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP  # ClusterIP, NodePort, LoadBalancer
  selector: { app: myapp }
  ports:
  - port: 8080
    targetPort: 8080
```

## ConfigMap & Secret
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres.svc.cluster.local"
---
apiVersion: v1
kind: Secret
type: Opaque
stringData:
  password: secretpassword
```

## Workload Types

| Type | Use Case |
|------|----------|
| Deployment | Stateless apps |
| StatefulSet | Databases |
| DaemonSet | One per node |
| Job | Batch tasks |
| CronJob | Scheduled |

## Labels
```yaml
labels:
  app: myapp
  version: v1.0.0
  tier: frontend
  environment: prod
```


### kubernetes helm advanced

# Helm Advanced - Templates & Hooks

## Template Variables
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
        {{- if .Values.resources }}
        resources:
          {{- toYaml .Values.resources | nindent 10 }}
        {{- end }}
```

## Helper Templates
```yaml
# templates/_helpers.tpl
{{- define "mychart.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mychart.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
```

## Hooks
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Release.Name }}-post-install"
  annotations:
    "helm.sh/hook": post-install
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    spec:
      containers:
      - name: post-install
        command: ["/bin/sh", "-c", "echo 'Done'"]
      restartPolicy: Never
```

Hook types: `pre-install`, `post-install`, `pre-upgrade`, `post-upgrade`

## Packaging
```bash
helm package mychart
helm repo index . --url https://charts.example.com
helm push mychart-1.0.0.tgz oci://registry.example.com/helm
helm repo add myrepo https://charts.example.com
helm install myapp myrepo/mychart
```

## Commands

| Command | Purpose |
|---------|---------|
| `helm create` | Create |
| `helm lint` | Validate |
| `helm template` | Render |
| `helm install` | Deploy |
| `helm upgrade` | Update |
| `helm rollback` | Revert |
| `helm uninstall` | Remove |


### kubernetes helm

# Helm Package Management

## Core Concepts

- **Chart:** Helm package with K8s resource definitions
- **Repository:** Collection of charts
- **Release:** Deployed instance of a chart
- **Values:** Configuration that parameterizes charts

## Chart Structure

```
mychart/
├── Chart.yaml              # Metadata
├── values.yaml             # Default values
├── charts/                 # Dependencies
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── _helpers.tpl       # Template helpers
│   └── NOTES.txt
└── values.schema.json     # Validation (optional)
```

## Essential Commands

```bash
helm create mychart           # Create chart
helm lint mychart             # Validate
helm template myrelease ./mychart  # Render locally
helm install myrelease ./mychart --dry-run --debug  # Preview

helm install myrelease ./mychart
helm install myrelease ./mychart -f values-prod.yaml
helm install myrelease ./mychart --set replicaCount=3

helm upgrade myrelease ./mychart
helm rollback myrelease 1
helm list
helm uninstall myrelease
```

## Multi-Environment

```bash
# Files: values.yaml, values-dev.yaml, values-prod.yaml
helm install myapp ./mychart -f values.yaml -f values-prod.yaml
helm install myapp ./mychart --set replicaCount=3 --set image.tag=v1.2.3
```

## values.yaml Example

```yaml
replicaCount: 2
image:
  repository: myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 8080
resources:
  limits: { cpu: 500m, memory: 512Mi }
  requests: { cpu: 250m, memory: 256Mi }
```

## Dependencies

```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "12.1.0"
    repository: "https://charts.bitnami.com/bitnami"
```

```bash
helm dependency update mychart
```

See `kubernetes-helm-advanced.md` for templates, hooks, and packaging.


### kubernetes kubectl

# kubectl Essential Commands

## Cluster & Node
```bash
kubectl cluster-info
kubectl get nodes
kubectl describe node <node-name>
kubectl top nodes
kubectl drain <node-name> --ignore-daemonsets
kubectl uncordon <node-name>
```

## Pod Operations
```bash
kubectl get pods -A                     # All namespaces
kubectl get pods -o wide                # Extended info
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs -f <pod-name>              # Follow
kubectl logs --previous <pod-name>      # Previous crash
kubectl exec -it <pod-name> -- /bin/bash
```

## Deployment
```bash
kubectl apply -f manifest.yaml
kubectl apply -f ./manifests/
kubectl apply -f manifest.yaml --dry-run=client -o yaml  # Preview
kubectl set image deployment/myapp app=myapp:v2
kubectl delete -f manifest.yaml
```

## Service & Network
```bash
kubectl port-forward service/myapp 8080:8080
kubectl get svc
kubectl exec -it <pod-name> -- curl http://service:8080
kubectl exec -it <pod-name> -- nslookup kubernetes.default
```

## Debugging (Get → Describe → Logs)
```bash
kubectl get pods -o wide
kubectl get events -n <ns> --sort-by='.lastTimestamp'
kubectl describe pod <pod-name>
kubectl logs <pod-name> -c <container>
```

## Output & Filtering
```bash
kubectl get pods -o json
kubectl get pods -o yaml
kubectl get pods -l app=myapp,tier=frontend
kubectl get pods --field-selector=status.phase=Running
kubectl get pods -w                     # Watch
```

## Flags

| Flag | Purpose |
|------|---------|
| `-n` | Namespace |
| `-A` | All namespaces |
| `-o` | Output format |
| `-l` | Label selector |
| `-w` | Watch |

## Aliases
```bash
alias k='kubectl'
alias kgp='kubectl get pods'
alias kd='kubectl describe'
alias kl='kubectl logs'
```


### kubernetes security advanced

# Kubernetes Security Advanced

## ClusterRole (cluster-wide)

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
  resourceNames: ["app-credentials"]  # Restrict to specific

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-binding
subjects:
- kind: User
  name: admin@example.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

## Secrets Management

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  username: admin
  password: secretpassword
```

### Mount as env
```yaml
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-credentials
      key: password
```

### Mount as volume
```yaml
volumeMounts:
- name: secret-volume
  mountPath: /etc/secrets
  readOnly: true
volumes:
- name: secret-volume
  secret:
    secretName: db-credentials
```

## Allow DNS (Required for most apps)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
spec:
  podSelector: {}
  policyTypes: [Egress]
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - { protocol: UDP, port: 53 }
```

## Security Checklist

- [ ] RBAC with least-privilege roles
- [ ] Pod Security Standards (restricted)
- [ ] Network policies (default-deny + explicit allow)
- [ ] Run containers as non-root
- [ ] Read-only root filesystem
- [ ] Drop all capabilities
- [ ] Secrets for sensitive data
- [ ] Image scanning enabled
- [ ] Private container registry
- [ ] Resource quotas and limits
- [ ] Audit logging enabled
- [ ] Regular credential rotation


### kubernetes security

# Kubernetes Security

## RBAC (Role-Based Access Control)

### Role (namespace-scoped)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
```

### RoleBinding
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: ServiceAccount
  name: my-app-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### Verify Permissions
```bash
kubectl auth can-i get pods --as=system:serviceaccount:default:my-sa
kubectl get roles,rolebindings -n default
```

## Pod Security (Restricted)

```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]
```

Enable on namespace:
```bash
kubectl label namespace default \
  pod-security.kubernetes.io/enforce=restricted
```

## Network Policies

### Default Deny
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
```

### Allow Specific
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels: { app: backend }
  ingress:
  - from:
    - podSelector:
        matchLabels: { app: frontend }
    ports:
    - { protocol: TCP, port: 8080 }
```

See `kubernetes-security-advanced.md` for secrets, ClusterRoles, and checklist.


### kubernetes troubleshooting advanced

# Kubernetes Troubleshooting Advanced

## Node Issues
```bash
kubectl describe node <node-name> | grep -A 5 "Conditions:"
kubectl top node <node-name>
kubectl top pods -A --sort-by=memory
kubectl drain <node-name> --ignore-daemonsets
kubectl uncordon <node-name>
```

## CrashLoopBackOff
```bash
kubectl logs <pod-name> --previous
kubectl describe pod <pod-name>
kubectl get pod <pod-name> -o yaml | grep -A 5 resources:
```

## HPA
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Anti-Patterns

**Using `latest` tag:**
```yaml
# ❌ image: myapp:latest
# ✅ image: myapp:v1.2.3
```

**Missing resources:**
```yaml
# ✅ Always set
resources:
  requests: { memory: "256Mi", cpu: "250m" }
  limits: { memory: "512Mi", cpu: "500m" }
```

**Missing health checks:**
```yaml
livenessProbe:
  httpGet: { path: /health, port: 8080 }
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
```

**Running as root:**
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
```

## Monitoring
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```


### kubernetes troubleshooting

# Kubernetes Troubleshooting

## Debugging Workflow

```bash
# 1. Overview
kubectl get pods -o wide
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# 2. Details
kubectl describe pod <pod-name>

# 3. Logs
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # Crashed instance
kubectl logs <pod-name> -c <container>
```

## Common Pod States

| State | Cause | Solution |
|-------|-------|----------|
| Pending | No node resources | Check node capacity |
| ContainerCreating | Image pulling | Check image URI |
| CrashLoopBackOff | Container exits | Check logs, health checks |
| ImagePullBackOff | Failed image pull | Verify credentials |
| OOMKilled (137) | Out of memory | Increase memory limit |

## Service & Network

```bash
kubectl exec -it <pod-name> -- nslookup kubernetes.default
kubectl exec -it <pod-name> -- curl http://myservice:8080
kubectl get endpoints <service-name>
kubectl port-forward service/myservice 8080:8080
kubectl get networkpolicies -A
```

## Quick Fixes

| Problem | Command |
|---------|---------|
| Pod stuck | `kubectl delete pod <name> --grace-period=0 --force` |
| High CPU | `kubectl top pods -A --sort-by=cpu` |
| High memory | `kubectl top pods -A --sort-by=memory` |
| Restart | `kubectl rollout restart deployment/<name>` |
| Rollback | `kubectl rollout undo deployment/<name>` |

See `kubernetes-troubleshooting-advanced.md` for node issues, HPA, anti-patterns.


### kubernetes workflows advanced

# Kubernetes Workflows Advanced

## CI/CD Pipeline
```yaml
# GitHub Actions
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - run: docker build . -t $REGISTRY/$IMAGE:${{ github.sha }}
    - run: docker push $REGISTRY/$IMAGE:${{ github.sha }}

  deploy:
    needs: build
    steps:
    - uses: actions/checkout@v3
      with:
        repository: myorg/gitops-repo
        token: ${{ secrets.GITOPS_TOKEN }}
    - run: |
        sed -i 's|image:.*|image: $REGISTRY/$IMAGE:${{ github.sha }}|' k8s/deployment.yaml
        git commit -am "Update image" && git push
```

## Kustomize

```
kustomize/
├── base/
│   ├── kustomization.yaml
│   └── deployment.yaml
└── overlays/
    └── prod/
        └── kustomization.yaml
```

### Base
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
- deployment.yaml
commonLabels:
  app: myapp
```

### Prod Overlay
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
- ../../base
replicas:
- name: myapp
  count: 5
```

```bash
kubectl apply -k overlays/prod/
```

## Flux CD
```bash
flux bootstrap github \
  --owner=myorg \
  --repository=fleet-infra \
  --branch=main \
  --path=clusters/my-cluster
```


### kubernetes workflows

# Kubernetes Workflows

## GitOps Architecture

```
Git Repository (desired state)
         │ Watches
         ▼
GitOps Agent (Argo CD / Flux)
         │ Syncs
         ▼
Kubernetes Cluster (actual state)
```

**Benefits:** Single source of truth, auditable, automated, easy rollback

## Argo CD Setup

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl port-forward svc/argocd-server -n argocd 8080:443
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Application Manifest
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myapp
    targetRevision: HEAD
    path: k8s/manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Deployment Patterns

### Rolling Update
```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### Blue-Green
```yaml
# Two deployments: myapp-blue, myapp-green
# Service selector switches between versions
selector:
  app: myapp
  version: blue  # Change to 'green' to switch
```

### Canary (with Istio)
```yaml
route:
- destination: { host: myapp, subset: v1 }
  weight: 90
- destination: { host: myapp, subset: v2 }
  weight: 10  # 10% canary
```

See `kubernetes-workflows-advanced.md` for CI/CD, Kustomize patterns.




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
