export interface NotePage {
  id: string;
  title: string;
  content: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "notion-pages";

const defaultPages: NotePage[] = [
  {
    id: "welcome",
    title: "Bem-vindo",
    content: "<h1>Bem-vindo ao seu Workspace</h1><p>Comece a escrever aqui. Use a barra de ferramentas para formatar o texto, mudar cores e muito mais.</p><p></p><h2>Funcionalidades</h2><ul><li>Editor de texto rico</li><li>Múltiplas páginas</li><li>Exportar para PDF</li><li>Temas claro e escuro</li><li>Cores de destaque</li></ul>",
    icon: "📝",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function getPages(): NotePage[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPages));
    return defaultPages;
  }
  return JSON.parse(data);
}

export function savePage(page: NotePage) {
  const pages = getPages();
  const idx = pages.findIndex((p) => p.id === page.id);
  if (idx >= 0) {
    pages[idx] = { ...page, updatedAt: Date.now() };
  } else {
    pages.push(page);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export function deletePage(id: string) {
  const pages = getPages().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
}

export function createPage(): NotePage {
  const page: NotePage = {
    id: crypto.randomUUID(),
    title: "Sem título",
    content: "<p></p>",
    icon: "📄",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  savePage(page);
  return page;
}
