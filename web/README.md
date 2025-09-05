# Boilerplate FE

A modern React + TypeScript + Vite boilerplate with TanStack Router, TailwindCSS, Radix UI, and shadcn/ui components.

## Features

- **React 19** + **TypeScript**
- **Vite** for fast development and builds
- **TanStack Router** for file-based routing
- **TanStack Query** for data fetching and caching
- **TailwindCSS** with custom theme and variants
- **shadcn/ui** and **Radix UI** for accessible, composable UI components
- **Lucide Icons** for iconography
- **ESLint** with recommended rules and hooks support
- **Husky** for Git hooks
- File and folder aliasing via `tsconfig` and `components.json`

## Project Structure

```
src/
  components/      # UI and layout components (shadcn/ui based)
  hooks/           # Custom React hooks
  lib/             # Utilities and API helpers
  routes/          # File-based routes for TanStack Router
  assets/          # Static assets
  main.tsx         # App entry point
  index.css        # TailwindCSS and theme config
public/            # Static files
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Start development server:**
   ```sh
   npm run dev
   ```

3. **Build for production:**
   ```sh
   npm run build
   ```

4. **Preview production build:**
   ```sh
   npm run preview
   ```

5. **Lint the code:**
   ```sh
   npm run lint
   ```

## Routing

Routes are defined in [`src/routes`](src/routes) using TanStack Router's file-based convention. The route tree is auto-generated in [`src/routeTree.gen.ts`](src/routeTree.gen.ts).

## Styling

TailwindCSS is configured in [`src/index.css`](src/index.css) with custom theme variables and dark mode support.

## UI Components

Reusable UI components are available in [`src/components/ui`](src/components/ui), based on shadcn/ui and Radix UI primitives.

## API Example

See [`src/lib/api.ts`](src/lib/api.ts) for a sample API function used in the blog route.

## License

This project is open source.