# PKM (Personal Knowledge Management)
A secure web application built with Astro 5 for managing personal knowledge with syntax highlighting support.

## Features

- 🔐 Password protection - Access control for viewing your knowledge base
- 🎨 Syntax highlighting - Support for multiple programming languages (JavaScript, Python, ABAP, etc.)
- 🌗 Dark mode support - Toggle between light and dark themes
- 📋 Copy to clipboard - Easy code copying functionality
- 💅 Modern UI - Built with Tailwind CSS and Shadcn/ui components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure authentication password:
   - Copy `.env.example` to `.env`
   - Set your desired password in `APP_PASSWORD`

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:4321 in your browser

## Default Password

The default password is `changeme123`. Please change this in production by setting the `APP_PASSWORD` environment variable.

## Development Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview  # Preview production build
```

## Testing

Run the integration tests:
```bash
node integration-test.js
```

## Supported Languages

The syntax highlighter currently supports:
- JavaScript/TypeScript
- Python
- ABAP
- SQL
- HTML/CSS
- Bash
- JSON
- Plain text (fallback for unsupported languages)

## Project Structure

```
src/
├── components/
│   ├── ui/          # Shadcn/ui components
│   └── CodeSnippet.astro # Knowledge entry display component
├── layouts/
│   └── Layout.astro # Base layout
├── lib/
│   ├── shiki.ts     # Syntax highlighting setup
│   └── utils.ts     # Utility functions
├── middleware.ts    # Authentication middleware
├── pages/
│   ├── api/
│   │   └── auth.ts  # Authentication endpoint
│   ├── index.astro  # Main page
│   └── login.astro  # Login page
└── styles/
    └── globals.css  # Global styles
```
