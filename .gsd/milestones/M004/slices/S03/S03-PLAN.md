# S03: Marketplace UI

**Goal:** Build the marketplace browse page at `/market` with search, listing cards, seller profiles, and purchase flow.
**Demo:** User visits drip.surf/market, sees research listings in a grid, can search/filter, click into a listing detail with preview/paywall, and initiate purchase.

## Must-Haves

- `/market` page with listing grid (title, seller, price, preview, category)
- Search/filter by category and keyword
- Listing detail view with free preview + paywall for full content
- Seller badge showing Moltbook name, karma, verified status
- Price display in $DRIP + USD
- Purchase CTA (connect wallet → pay → unlock)
- Responsive layout matching DRIP design system
- "List Your Research" CTA for sellers
- Navigation: add "Market" to navbar

## Proof Level

- This slice proves: contract (UI renders correctly with API data)
- Real runtime required: yes (dev server + API routes from S01)
- Human/UAT required: yes (visual verification in browser)

## Verification

- `drip.surf/market` renders listing grid with data from API
- Search filters listings by keyword
- Clicking a listing shows detail page with preview content
- Full content is hidden behind paywall ("Pay X $DRIP to unlock")
- Seller badge shows Moltbook karma and name
- Mobile responsive (viewport 375px)
- "Market" link appears in navbar

## Tasks

- [ ] **T01: Marketplace page layout + listing cards** `est:30m`
  - Why: Core browse experience — the first thing users see
  - Files: `app/market/page.tsx`, `components/market/listing-card.tsx`, `components/market/listing-grid.tsx`
  - Do: Create `/market` page with hero section ("Research Intelligence Market" heading + subtitle). ListingGrid fetches from `/api/market/listings`. ListingCard shows: title, preview (first 100 chars), seller name + karma badge, price ($DRIP + USD), category badge, time ago. Use GlassPanel pattern from feed page. Grid: 1 col mobile, 2 col tablet, 3 col desktop.
  - Verify: Browser shows marketplace page with listing cards
  - Done when: Marketplace page renders listings from API with proper layout

- [ ] **T02: Search + category filter** `est:20m`
  - Why: Agents and humans need to find relevant research
  - Files: `app/market/page.tsx`, `components/market/search-bar.tsx`
  - Do: Add SearchBar component at top of listings. Client-side filter by title/content keyword match. Category tabs: All, DeFi, AI Agents, Market Analysis, Infrastructure. Filter updates URL params for shareability. Debounced search input.
  - Verify: Typing in search filters visible listings, category tabs switch correctly
  - Done when: Search and filter work smoothly with URL state

- [ ] **T03: Listing detail page with preview/paywall** `est:30m`
  - Why: Users need to see what they're buying before paying
  - Files: `app/market/[id]/page.tsx`, `components/market/paywall.tsx`
  - Do: Dynamic route `/market/[id]` fetches listing detail. Shows: full title, seller profile card (name, karma, description, follower count), category, posted date, price. Content area: first 2 paragraphs visible as preview, rest blurred behind gradient + "Pay X $DRIP to unlock full report" CTA. After purchase, full content visible. Back button to marketplace.
  - Verify: Preview shows, paywall hides rest, styling matches DRIP theme
  - Done when: Listing detail page with working preview/paywall renders correctly

- [ ] **T04: Seller profile badge + purchase CTA** `est:20m`
  - Why: Trust signals and clear purchase action
  - Files: `components/market/seller-badge.tsx`, `components/market/purchase-button.tsx`
  - Do: SellerBadge shows Moltbook avatar, name, karma score, verified checkmark, "X posts on Moltbook" link. PurchaseButton: (1) not connected → "Connect Wallet", (2) connected → "Pay X $DRIP", (3) purchasing → spinner, (4) purchased → "Unlocked ✓". Connect wallet uses existing Solana wallet adapter. Wire to `/api/market/purchase` endpoint.
  - Verify: Button state transitions work, wallet connection triggers correctly
  - Done when: Complete purchase UX from wallet connect to content unlock

- [ ] **T05: Navbar update + responsive polish** `est:15m`
  - Why: Marketplace needs to be discoverable and mobile-friendly
  - Files: `components/layout/navbar.tsx`, `app/market/page.tsx`, `app/market/[id]/page.tsx`
  - Do: Add "Market" link to navbar between "Feed" and "Docs". Mobile responsive: listing grid stacks to 1 col, search full-width, listing detail readable on 375px. Test on mobile viewport preset.
  - Verify: Mobile viewport shows all elements properly, Market link in navbar
  - Done when: Marketplace fully responsive and linked from global navigation

## Files Likely Touched

- `app/market/page.tsx` (new)
- `app/market/[id]/page.tsx` (new)
- `components/market/listing-card.tsx` (new)
- `components/market/listing-grid.tsx` (new)
- `components/market/search-bar.tsx` (new)
- `components/market/seller-badge.tsx` (new)
- `components/market/purchase-button.tsx` (new)
- `components/market/paywall.tsx` (new)
- `components/layout/navbar.tsx` (update)
