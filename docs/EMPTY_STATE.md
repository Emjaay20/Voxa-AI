# Empty States (Handling the Unknown)

Every feature must intentionally design its state when data is unavailable. The best SaaS products treat empty states as primary UX opportunities, not afterthoughts.

Before any feature is merged, it must satisfy:

## 1. Loading State
- Does not block the entire screen if only a section is loading.
- Uses `Skeleton` or subtle spinners.
- Prevents layout shift (skeletons must match the expected dimensions).

## 2. Empty State
- Appears when a user has no data (e.g., no practice sessions yet).
- Must include a clear, optimistic illustration or icon.
- Must include a **primary CTA** (Call To Action) that tells them exactly how to populate the data.

## 3. Error State
- Tells the user *what* went wrong in plain English.
- Does not expose stack traces.
- Includes a "Retry" or "Refresh" action.

## 4. Offline State
- Gracefully handles `navigator.onLine === false`.
- Prevents data loss for pending form submissions.

## 5. No Results State
- Appears during search/filtering when nothing matches.
- Offers a way to "Clear Filters" immediately.
