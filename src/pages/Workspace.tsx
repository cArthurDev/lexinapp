import React, { useState, useCallback, useEffect } from "react";
import {
  Save,
  Download,
  Menu,
  LogOut,
  Sun,
  Moon,
  Check,
  Type,
} from "lucide-react";
import { logout } from "@/lib/auth";
import {
  NotePage,
  getPages,
  savePage,
  deletePage,
  createPage,
} from "@/lib/store";
import AppSidebar from "@/components/AppSidebar";
import NoteEditor from "@/components/NoteEditor";
import FloatingToolbar from "@/components/FloatingToolbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WorkspaceProps {
  onLogout: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ onLogout }) => {
  const [pages, setPages] = useState<NotePage[]>(getPages());
  const [activePageId, setActivePageId] = useState<string | null>(
    pages.length > 0 ? pages[0].id : null
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [serifMode, setSerifMode] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const activePage = pages.find((p) => p.id === activePageId) || null;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.classList.toggle("font-serif-mode", serifMode);
  }, [serifMode]);

  const handleSave = useCallback(() => {
    if (activePage) {
      savePage(activePage);
      setSaved(true);
      toast.success("Salvo com sucesso!");
    }
  }, [activePage]);

  const handleContentChange = useCallback(
    (html: string) => {
      if (!activePage) return;
      const updated = { ...activePage, content: html };
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSaved(false);
    },
    [activePage]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!activePage) return;
      const updated = { ...activePage, title };
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSaved(false);
    },
    [activePage]
  );

  const handleIconChange = useCallback(
    (icon: string) => {
      if (!activePage) return;
      const updated = { ...activePage, icon };
      setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSaved(false);
    },
    [activePage]
  );

  const handleNewPage = useCallback(() => {
    const page = createPage();
    setPages(getPages());
    setActivePageId(page.id);
  }, []);

  const handleDeletePage = useCallback(
    (id: string) => {
      deletePage(id);
      const remaining = getPages();
      setPages(remaining);
      if (activePageId === id) {
        setActivePageId(remaining.length > 0 ? remaining[0].id : null);
      }
    },
    [activePageId]
  );

  const handleExportPdf = useCallback(() => {
    if (!activePage) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${activePage.title}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #37352f; }
          h1 { font-size: 2.5em; font-weight: 700; margin-bottom: 0.5em; }
          h2 { font-size: 1.8em; font-weight: 600; }
          h3 { font-size: 1.4em; font-weight: 500; }
          ul, ol { padding-left: 1.5em; }
          blockquote { border-left: 3px solid #e0e0e0; padding-left: 1em; color: #666; font-style: italic; }
          p { line-height: 1.7; }
        </style>
      </head>
      <body>
        <div style="font-size: 3em; margin-bottom: 0.3em;">${activePage.icon}</div>
        <h1>${activePage.title}</h1>
        ${activePage.content}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  }, [activePage]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleSelectionChange = useCallback((rect: DOMRect | null) => {
    if (rect) {
      setToolbarPos({ top: rect.top + window.scrollY, left: Math.max(8, rect.left + rect.width / 2 - 180) });
    } else {
      setToolbarPos(null);
    }
  }, []);

  // Close toolbar on click outside
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setToolbarPos(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handleSave]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        pages={pages}
        activePageId={activePageId}
        onSelectPage={setActivePageId}
        onNewPage={handleNewPage}
        onDeletePage={handleDeletePage}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-border flex items-center justify-between px-3 shrink-0 bg-background">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            <span className="text-sm text-muted-foreground">
              {saved ? (
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Salvo</span>
              ) : (
                "Alterações não salvas"
              )}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleSave} className="gap-1.5 text-foreground">
              <Save className="w-4 h-4" /> Salvar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExportPdf} className="gap-1.5 text-foreground">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <button
              onClick={() => setSerifMode(!serifMode)}
              title="Alternar fonte serif"
              className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDark(!dark)}
              className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              title="Sair"
              className="p-1.5 rounded hover:bg-accent text-muted-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Editor */}
        {activePage ? (
          <NoteEditor
            content={activePage.content}
            onChange={handleContentChange}
            title={activePage.title}
            onTitleChange={handleTitleChange}
            icon={activePage.icon}
            onIconChange={handleIconChange}
            onSelectionChange={handleSelectionChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Nenhuma página selecionada</p>
              <Button onClick={handleNewPage} variant="outline">
                Criar nova página
              </Button>
            </div>
          </div>
        )}
      </div>

      <FloatingToolbar position={toolbarPos} />
    </div>
  );
};

export default Workspace;
