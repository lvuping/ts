# PKM (Personal Knowledge Management)
A secure web application built with Astro 5 for managing personal knowledge with syntax highlighting support.

## Features

- 🔐 Password protection - Access control for viewing your knowledge base
- 🎨 Syntax highlighting - Support for multiple programming languages (JavaScript, Python, ABAP, etc.)
- 🌗 Dark mode support - Toggle between light and dark themes
- 📋 Copy to clipboard - Easy code copying functionality
- ⭐ Favorites - Mark important snippets as favorites
- 🔍 Search & Filter - Search by content, filter by category or tags
- 📤 Export/Import - Export notes to markdown and import from markdown files
- 📱 Multiple View Modes - Detailed, card, and compact views
- 💅 Modern UI - Built with Tailwind CSS and Shadcn/ui components

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure authentication password:
   - Copy `.env.example` to `.env`
   - Set your desired password in `APP_PASSWORD`

3. Start the development server:
```bash
pnpm run dev
```

4. Open http://localhost:4321 in your browser

## Default Password

The default password is `changeme123`. Please change this in production by setting the `APP_PASSWORD` environment variable.

## Development Commands

```bash
pnpm run dev    # Start development server
pnpm run build  # Build for production
pnpm run preview  # Preview production build
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
- Markdown
- Plain text (fallback for unsupported languages)

## Import/Export

### Exporting Notes
Click the **Export** button (↓) in the header to download all notes as a markdown file.

### Importing Notes
Click the **Import** button (↑) in the header to import notes from a markdown file.

#### Markdown Format for Import
The markdown file should follow this structure:

```markdown
# Note Title

**Category:** Backend  
**Tags:** #python, #api, #data-processing  
**Updated:** 2024-01-10  

```python
def example_function():
    return "Hello World"
```

---

# Another Note Title

**Category:** Frontend  
**Tags:** #javascript, #react  

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

---
```

**Important Notes:**
- Each note should be separated by a horizontal rule (`---`)
- The title is extracted from the first heading (`#`)
- Category and tags are parsed from the metadata lines
- Code blocks should include the language identifier
- Tags can be comma-separated and may include the `#` symbol

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
