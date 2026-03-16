import React from "react";
import { Plus, FileText, Trash2, ChevronLeft } from "lucide-react";
import { NotePage } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  pages: NotePage[];
  activePageId: string | null;
  onSelectPage: (id: string) => void;
  onNewPage: () => void;
  onDeletePage: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  pages,
  activePageId,
  onSelectPage,
  onNewPage,
  onDeletePage,
  collapsed,
  onToggle,
}) => {
  return (
    <aside
      className={cn(
        "h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-150 shrink-0",
        collapsed ? "w-0 overflow-hidden" : "w-60"
      )}
    >
      <div className="flex items-center justify-between px-3 h-12 border-b border-sidebar-border">
        <span className="text-sm font-semibold text-sidebar-fg truncate">Workspace</span>
        <button onClick={onToggle} className="p-1 rounded hover:bg-sidebar-hover text-sidebar-fg">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Páginas</span>
        </div>
        {pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 mx-1 rounded cursor-pointer text-sm transition-colors",
              activePageId === page.id
                ? "bg-sidebar-active text-primary font-medium"
                : "text-sidebar-fg hover:bg-sidebar-hover"
            )}
            onClick={() => onSelectPage(page.id)}
          >
            <span className="text-base shrink-0">{page.icon}</span>
            <span className="truncate flex-1">{page.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePage(page.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={onNewPage}
          className="flex items-center gap-2 w-full px-3 py-2 rounded text-sm text-muted-foreground hover:bg-sidebar-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova página
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
