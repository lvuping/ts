import { createHighlighter } from 'shiki';

let highlighter: any = null;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'python', 'abap', 'json', 'html', 'css', 'bash', 'sql', 'markdown', 'text']
    });
  }
  return highlighter;
}

export async function highlightCode(code: string, lang: string, theme: 'light' | 'dark' = 'light') {
  const highlighter = await getHighlighter();
  const themeName = theme === 'light' ? 'github-light' : 'github-dark';
  
  // Map unsupported languages to text
  const supportedLangs = ['javascript', 'typescript', 'python', 'abap', 'json', 'html', 'css', 'bash', 'sql', 'markdown'];
  const actualLang = supportedLangs.includes(lang) ? lang : 'text';
  
  return highlighter.codeToHtml(code, {
    lang: actualLang,
    theme: themeName
  });
}