# Open Library Explorer

A highly performant Next.js App Router application that fetches and displays books from the Open Library API. The app features robust debounced searching, URL state synchronization, a completely responsive grid, a Shadcn-inspired Light/Dark mode toggle, custom automated infinite scrolling, and advanced row virtualization for extreme scale.

## Setup

1. **Install Dependencies**
   First, make sure all Node modules map accurately using:
   ```bash
   npm install
   ```
2. **Launch the Server**
   Start the local development server:
   ```bash
   npm run dev
   ```
3. **View the Application**
   Navigate to [http://localhost:3000](http://localhost:3000) mechanically in your browser.

## Architecture

- **Framework**: Built on Next.js 14/15 utilizing the App Router architecture, strictly abiding by Client/Server boundary configurations (`use client` and `<Suspense>`).
- **Data Fetching & State**: Handled natively utilizing `axios` paired intimately with `@tanstack/react-query`'s `useInfiniteQuery` Hook, granting cached fetching execution and strict loading/error thresholds over network calls.
- **UI & Styling**: Customized with native Tailwind CSS v4, utilizing identical structures and visuals to Shadcn UI components seamlessly bypassing full CLI integration. Implements `next-themes` correctly aligned with Tailwind's `class` attribute methodology for real-time Light/Dark swap.
- **Navigation & URLs**: Hooks heavily utilizing `useSearchParams` effortlessly sync React Search states bi-directionally alongside the exact navigation path to guarantee shared URLs perfectly restore UI context seamlessly.

## Virtualization Explanation

Standard infinite scrolling naturally injects thousands of nodes into the Document Object Model (DOM). Over time, this overwhelms the browser's painting hardware resulting in visual stuttering and immense memory usage.

To solve this problem natively within an unpredictable fluid matrix (CSS Grid with dynamic column amounts), we integrated `@tanstack/react-virtual` (`useWindowVirtualizer`).

**How it works structurally:**
1. We intercept the flat one-dimensional array of `data.docs`.
2. A `window.innerWidth` watcher mathematically groups these items into exact `[Row]` array segments corresponding directly precisely to your screen width (e.g., 5-item rows on Desktop, 1-item rows on Mobile).
3. The Virtualizer maps these massive nested *Rows* (instead of single items). Using its `measureElement` React Ref, it securely reads the tallest card inside that specific row chunk, reserving that space structurally.
4. As the user rapidly scrolls vertically, `react-virtual` completely unloads the row DOM nodes trailing above or far below the viewing threshold while pushing a mathematically exact `transform: translate()` offset calculation to the visible items. The user experiences absolutely standard responsive CSS grid logic perfectly intact, but the browser only ever manages a tiny handful of physical nodes at a given moment resulting in zero processing lag indefinitely natively!
