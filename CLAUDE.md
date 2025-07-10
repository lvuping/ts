# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a secure code snippet manager built with Astro 5, designed for storing and displaying code snippets with syntax highlighting. The application features password protection, dark mode support, and a modern UI built with Tailwind CSS.

## Essential Commands

```bash
# Development
pnpm run dev      # Start development server on http://localhost:4321
pnpm start        # Alias for pnpm run dev

# Production Build
pnpm run build    # Run type checking with astro check, then build for production
pnpm run preview  # Preview production build locally

# Testing
node integration-test.js  # Run integration tests for authentication and API endpoints
```

## Architecture

### Tech Stack
- **Framework**: Astro 5 with server-side rendering (SSR)
- **Runtime**: Node.js standalone adapter
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Syntax Highlighting**: Shiki with support for multiple languages
- **Data Storage**: JSON file-based storage in `src/lib/data/notes.json`
- **Authentication**: Cookie-based auth with middleware protection

### Key Components

1. **Authentication System** (`src/middleware.ts`):
   - Password-based authentication using environment variable `APP_PASSWORD`
   - Cookie-based session management
   - Middleware protection for all routes except login, API, and static assets

2. **Notes Management** (`src/lib/notes.ts`):
   - CRUD operations for code snippets
   - File-based storage with automatic initialization
   - Support for categories, tags, and search functionality
   - Automatic sorting by update time

3. **Syntax Highlighting** (`src/lib/shiki.ts`):
   - Lazy-loaded Shiki highlighter
   - Support for both light and dark themes
   - Languages: JavaScript, TypeScript, Python, ABAP, SQL, HTML, CSS, Bash, JSON
   - Fallback to plain text for unsupported languages

4. **API Endpoints** (`src/pages/api/notes/`):
   - RESTful API for notes management
   - Query parameters for search, category, and tag filtering
   - JSON request/response format

### File Structure
- `src/pages/` - Astro pages and API routes
- `src/components/` - Reusable Astro and React components
- `src/lib/` - Core business logic and utilities
- `src/types/` - TypeScript type definitions
- `src/middleware.ts` - Authentication middleware

## Environment Configuration

Required environment variable:
- `APP_PASSWORD` - Authentication password (defaults to "changeme123" if not set)

## Development Notes

- The application uses server-side rendering, so all pages require the Node.js adapter
- Authentication state is managed via cookies, checked by middleware on each request
- Code snippets are stored in a JSON file that's automatically created on first use
- The syntax highlighter is initialized once and reused for performance
- Both light and dark theme code is pre-rendered for instant theme switching