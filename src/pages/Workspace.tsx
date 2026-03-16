import React, { useState, useCallback, useEffect } from "react";
import {
  Save,
  Download,
  LogOut,
  Sun,
  Moon,
  Check,
  Type,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { logout } from "@/lib/auth";
import {
  NotePage,
  NoteModule,
  getModules,
  getPages,
  getPagesByModule,
  savePage,
  deletePage,
  createPage,
  createModule,
  updateModule,
  deleteModule,
} from "@/lib/store";
import ModuleBoard from "@/components/ModuleBoard";
import NoteEditor from "@/components/NoteEditor";
import FloatingToolbar from "@/components/FloatingToolbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WorkspaceProps {
  onLogout: () => void;
}

type View = "board" | "module" | "editor";

const Workspace: React.FC<WorkspaceProps> = ({ onLogout }) => {
  const [modules, setModules] = useState<NoteModule[]>(getModules());
  const [pages, setPages] = useState<NotePage[]>(getPages());
  const [view, setView] = useState<View>("board");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [serifMode, setSerifMode] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const activePage = pages.find((p) => p.id === activePageId) || null;
  const activeModule = modules.find((m) => m.id === activeModuleId) || null;
  const modulePages = activeModuleId ? pages.filter((p) => p.moduleId === activeModuleId) : [];

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => { document.documentElement.classList.toggle("font-serif-mode", serifMode); }, [serifMode]);

  // Board actions
  const handleNewModule = useCallback(() => {
    const mod = createModule("Novo módulo");
    setModules(getModules());
  }, []);

  const handleDeleteModule = useCallback((id: string) => {
    deleteModule(id);
    setModules(getModules());
    setPages(getPages());
  }, []);

  const handleRenameModule = useCallback((id: string, name: string) => {
    updateModule(id, { name });
    setModules(getModules());
  }, []);

  const handleOpenModule = useCallback((id: string) => {
    setActiveModuleId(id);
    setView("module");
  }, []);

  // Module view actions
  const handleNewPage = useCallback(() => {
    if (!activeModuleId) return;
    const page = createPage(activeModuleId);
    setPages(getPages());
    setActivePageId(page.id);
    setView("editor");
  }, [activeModuleId]);

  const handleDeletePage = useCallback((id: string) => {
    deletePage(id);
    setPages(getPages());
    if (activePageId === id) {
      setActivePageId(null);
      setView("module");
    }
  }, [activePageId]);

  const handleOpenPage = useCallback((id: string) => {
    setActivePageId(id);
    setView("editor");
  }, []);

  // Editor actions
  const handleSave = useCallback(() => {
    if (activePageId) {
      const currentPage = pages.find((p) => p.id === activePageId);
      if (!currentPage) return;
      savePage(currentPage);
      setPages(getPages());
      setSaved(true);
      toast.success("Salvo com sucesso!");
    }
  }, [activePageId, pages]);

  const handleContentChange = useCallback((html: string) => {
    if (!activePage) return;
    const updated = { ...activePage, content: html };
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaved(false);
  }, [activePage]);

  const handleTitleChange = useCallback((title: string) => {
    if (!activePage) return;
    const updated = { ...activePage, title };
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaved(false);
  }, [activePage]);

  const handleIconChange = useCallback((icon: string) => {
    if (!activePage) return;
    const updated = { ...activePage, icon };
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaved(false);
  }, [activePage]);

  const handleExportPdf = useCallback(() => {
    if (!activePage) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>${activePage.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>body{font-family:'Inter',sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#37352f}h1{font-size:2.5em;font-weight:700}h2{font-size:1.8em}h3{font-size:1.4em}ul,ol{padding-left:1.5em}blockquote{border-left:3px solid #e0e0e0;padding-left:1em;color:#666;font-style:italic}p{line-height:1.7}</style>
      </head><body><div style="font-size:3em;margin-bottom:0.3em">${activePage.icon}</div><h1>${activePage.title}</h1>${activePage.content}</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }, [activePage]);

  const handleSelectionChange = useCallback((rect: DOMRect | null) => {
    if (rect) {
      setToolbarPos({ top: rect.top + window.scrollY, left: Math.max(8, rect.left + rect.width / 2 - 180) });
    } else {
      setToolbarPos(null);
    }
  }, []);

  const handleBack = () => {
    if (view === "editor") {
      // Save before going back
      if (activePageId && !saved) {
        const currentPage = pages.find((p) => p.id === activePageId);
        if (currentPage) {
          savePage(currentPage);
        }
        setPages(getPages());
      }
      setView("module");
      setActivePageId(null);
    } else if (view === "module") {
      setView("board");
      setActiveModuleId(null);
    }
  };

  const handleLogout = () => { logout(); onLogout(); };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleSave]);

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setToolbarPos(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background">
        <div className="flex items-center gap-3">
          {view !== "board" && (
            <button onClick={handleBack} className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-semibold text-primary">Lexin</span>
          {view === "module" && activeModule && (
            <span className="text-sm text-muted-foreground">/ {activeModule.icon} {activeModule.name}</span>
          )}
          {view === "editor" && activePage && (
            <>
              {activeModule && <span className="text-sm text-muted-foreground">/ {activeModule.name}</span>}
              <span className="text-sm text-muted-foreground">/ {activePage.icon} {activePage.title}</span>
            </>
          )}
          {view === "editor" && (
            <span className="text-xs text-muted-foreground ml-2">
              {saved ? (
                <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Salvo</span>
              ) : "Não salvo"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {view === "editor" && (
            <>
              <Button variant="ghost" size="sm" onClick={handleSave} className="gap-1.5 text-foreground">
                <Save className="w-4 h-4" /> Salvar
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExportPdf} className="gap-1.5 text-foreground">
                <Download className="w-4 h-4" /> PDF
              </Button>
            </>
          )}
          <button onClick={() => setSerifMode(!serifMode)} title="Fonte serif" className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors">
            <Type className="w-4 h-4" />
          </button>
          <button onClick={() => setDark(!dark)} className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={handleLogout} title="Sair" className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      {view === "board" && (
        <ModuleBoard
          modules={modules}
          onOpenModule={handleOpenModule}
          onNewModule={handleNewModule}
          onDeleteModule={handleDeleteModule}
          onRenameModule={handleRenameModule}
        />
      )}

      {view === "module" && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  {activeModule?.icon} {activeModule?.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{modulePages.length} {modulePages.length === 1 ? "nota" : "notas"}</p>
              </div>
              <Button onClick={handleNewPage} size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" /> Nova nota
              </Button>
            </div>

            {modulePages.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma nota neste módulo</p>
                <Button onClick={handleNewPage} variant="outline" className="mt-4 gap-1.5">
                  <Plus className="w-4 h-4" /> Criar primeira nota
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {modulePages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => handleOpenPage(page.id)}
                    className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card cursor-pointer transition-all hover:shadow-sm hover:border-primary/20"
                  >
                    <span className="text-xl">{page.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm truncate">{page.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Editado {new Date(page.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "editor" && activePage && (
        <NoteEditor
          content={activePage.content}
          onChange={handleContentChange}
          title={activePage.title}
          onTitleChange={handleTitleChange}
          icon={activePage.icon}
          onIconChange={handleIconChange}
          onSelectionChange={handleSelectionChange}
        />
      )}

      <FloatingToolbar position={toolbarPos} />
    </div>
  );
};

export default Workspace;
