# Notes

## Choices

**Search vs. category filter.** DummyJSON can't search and filter by category in one request. When there is a search term, search takes priority: the category dropdown is disabled with a note saying "Clear the search to filter by category". I didn't fetch search results and filter them by category in the browser, because pagination happens on the server. Filtering in the browser would only filter the current page, so the result count and page numbers would be wrong.

**Add, edit and delete.** The API answers these requests but doesn't save anything. The app still sends the real request, so errors are handled properly, and then records the change in a local layer (`added`, `edited`, `deletedIds`) that is applied on top of every API response. Changes are shared between the list and detail pages but reset on refresh. Added products get their own ids (DummyJSON returns `195` for every new product) and are pinned to the top of page 1 of the unfiltered list. In a real app this would be server state, and the local layer would only be an optimistic update until the server confirms it.

**Sorting.** `sortBy` and `order` are sent to the API, which supports them on the list, search and category endpoints, so sorting covers the full result set, not just the current page.

**URL as state.** Page, page size, search, category and sort are read from the URL on every render instead of being copied into React state, so the URL and the UI can't drift apart. Every value is validated (`?page=abc` becomes 1, and `?page=999` jumps to the last page once the total is known). `router.replace` is used so typing doesn't fill the browser history.

## A problem I faced

**Old search results replacing new ones.** I tested with `?delay=2000` and typed quickly. Debouncing reduces the number of requests, but it doesn't control the order they finish in. A slow request for "ph" could finish after the request for "phone" and overwrite the correct results. The fix has two parts:

1. Each request gets an `AbortController`. When the query changes, React runs the effect's cleanup, which aborts the previous request. The resulting "canceled" error is ignored because it's expected.
2. As a safety net, each request gets an increasing id, and only the response with the newest id may update the screen.

## Where AI helped

I used an AI coding assistant for boilerplate and as a helper while building: setting up the project, drafting components and hooks, and checking edge cases such as the search race condition, URL validation and double-submit guards. I reviewed and tested everything, and I can explain every part of the code.
