import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  FolderOpen,
  Check,
  X,
} from "lucide-react";
import {
  NoteModule,
  getPagesByModule,
} from "@/lib/store";
import { cn } from "@/lib/utils";

interface ModuleBoardProps {
  modules: NoteModule[];
  onOpenModule: (id: string) => void;
  onNewModule: () => void;
  onDeleteModule: (id: string) => void;
  onRenameModule: (id: string, name: string) => void;
}

const ModuleBoard: React.FC<ModuleBoardProps> = ({
  modules,
  onOpenModule,
  onNewModule,
  onDeleteModule,
  onRenameModule,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startRename = (mod: NoteModule, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(mod.id);
    setEditName(mod.name);
  };

  const confirmRename = () => {
    if (editingId && editName.trim()) {
      onRenameModule(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus Módulos</h1>
          <p className="text-muted-foreground mt-1">Organize suas anotações em módulos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map((mod) => {
            const pageCount = getPagesByModule(mod.id).length;
            const isEditing = editingId === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => !isEditing && onOpenModule(mod.id)}
                className={cn(
                  "group relative rounded-xl border border-border bg-card p-5 cursor-pointer transition-all duration-150",
                  "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
                )}
              >
                {/* Color bar */}
                <div
                  className="absolute top-0 left-4 right-4 h-1 rounded-b-full"
                  style={{ backgroundColor: mod.color }}
                />

                <div className="flex items-start justify-between mb-3 mt-1">
                  <span className="text-3xl">{mod.icon}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => startRename(mod, e)}
                      className="p-1 rounded hover:bg-accent text-muted-foreground"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteModule(mod.id); }}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                      className="flex-1 text-sm font-semibold bg-transparent border border-border rounded px-1.5 py-0.5 outline-none focus:border-primary text-foreground"
                    />
                    <button onClick={confirmRename} className="p-0.5 rounded hover:bg-accent text-primary">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-0.5 rounded hover:bg-accent text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-semibold text-foreground text-sm truncate">{mod.name}</h3>
                )}

                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <FolderOpen className="w-3.5 h-3.5" />
                  {pageCount} {pageCount === 1 ? "nota" : "notas"}
                </div>
              </div>
            );
          })}

          {/* Add new module */}
          <button
            onClick={onNewModule}
            className="rounded-xl border-2 border-dashed border-border p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 hover:border-primary/40 hover:bg-accent/50 min-h-[130px]"
          >
            <Plus className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Novo módulo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleBoard;
