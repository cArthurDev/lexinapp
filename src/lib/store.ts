export interface NotePage {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  icon: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteModule {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
}

const MODULES_KEY = "lexin-modules";
const PAGES_KEY = "lexin-pages";

const MODULE_COLORS = [
  "hsl(217, 91%, 53%)",
  "hsl(140, 60%, 45%)",
  "hsl(25, 90%, 55%)",
  "hsl(330, 80%, 55%)",
  "hsl(270, 60%, 55%)",
  "hsl(45, 93%, 50%)",
  "hsl(0, 80%, 55%)",
  "hsl(190, 80%, 45%)",
];

const defaultModules: NoteModule[] = [
  {
    id: "mod-geral",
    name: "Geral",
    icon: "📁",
    color: MODULE_COLORS[0],
    createdAt: Date.now(),
  },
  {
    id: "mod-trabalho",
    name: "Trabalho",
    icon: "💼",
    color: MODULE_COLORS[1],
    createdAt: Date.now(),
  },
];

const defaultPages: NotePage[] = [
  {
    id: "welcome",
    moduleId: "mod-geral",
    title: "Bem-vindo ao Lexin",
    content: "<h1>Bem-vindo ao Lexin</h1><p>Seu espaço de anotações. Use os módulos para organizar suas notas.</p><h2>Funcionalidades</h2><ul><li>Módulos (pastas) para organizar</li><li>Editor de texto rico</li><li>Exportar para PDF</li><li>Temas claro e escuro</li></ul>",
    icon: "📝",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Modules
export function getModules(): NoteModule[] {
  const data = localStorage.getItem(MODULES_KEY);
  if (!data) {
    localStorage.setItem(MODULES_KEY, JSON.stringify(defaultModules));
    return defaultModules;
  }
  return JSON.parse(data);
}

function saveModules(modules: NoteModule[]) {
  localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
}

export function createModule(name: string): NoteModule {
  const modules = getModules();
  const mod: NoteModule = {
    id: crypto.randomUUID(),
    name,
    icon: "📁",
    color: MODULE_COLORS[modules.length % MODULE_COLORS.length],
    createdAt: Date.now(),
  };
  modules.push(mod);
  saveModules(modules);
  return mod;
}

export function updateModule(id: string, updates: Partial<Pick<NoteModule, "name" | "icon">>) {
  const modules = getModules().map((m) => (m.id === id ? { ...m, ...updates } : m));
  saveModules(modules);
}

export function deleteModule(id: string) {
  saveModules(getModules().filter((m) => m.id !== id));
  // Also delete pages in this module
  const pages = getPages().filter((p) => p.moduleId !== id);
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
}

// Pages
export function getPages(): NotePage[] {
  const data = localStorage.getItem(PAGES_KEY);
  if (!data) {
    localStorage.setItem(PAGES_KEY, JSON.stringify(defaultPages));
    return defaultPages;
  }
  return JSON.parse(data);
}

export function getPagesByModule(moduleId: string): NotePage[] {
  return getPages().filter((p) => p.moduleId === moduleId);
}

export function savePage(page: NotePage) {
  const pages = getPages();
  const idx = pages.findIndex((p) => p.id === page.id);
  if (idx >= 0) {
    pages[idx] = { ...page, updatedAt: Date.now() };
  } else {
    pages.push(page);
  }
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
}

export function deletePage(id: string) {
  const pages = getPages().filter((p) => p.id !== id);
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
}

export function createPage(moduleId: string): NotePage {
  const page: NotePage = {
    id: crypto.randomUUID(),
    moduleId,
    title: "Sem título",
    content: "<p></p>",
    icon: "📄",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  savePage(page);
  return page;
}
