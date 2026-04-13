import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  FolderOpen,
  ArrowRight,
  Sparkles,
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
          <p className="text-muted-foreground mt-1">Organize suas anotações em um workspace premium</p>
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
                  "group relative rounded-xl bg-gradient-to-b from-purple-500/50 to-transparent p-[1px] cursor-pointer transition-all duration-300",
                  "hover:scale-105 hover:shadow-[0_0_26px_rgba(217,70,239,0.75),0_0_62px_rgba(168,85,247,0.5)]"
                )}
              >
                <div className="premium-glass-card relative h-full p-5">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-70"
                    style={{ boxShadow: `inset 0 1px 0 ${mod.color}55` }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-purple-900/35 text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.85)]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-2xl drop-shadow-[0_0_18px_rgba(217,70,239,0.7)]">{mod.icon}</span>
                    </div>

                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startRename(mod, e)}
                        className="p-1 rounded-md hover:bg-white/10 text-muted-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteModule(mod.id); }}
                        className="p-1 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
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
                        className="flex-1 text-sm font-semibold bg-black/25 border border-border rounded px-1.5 py-0.5 outline-none focus:border-primary text-foreground"
                      />
                      <button onClick={confirmRename} className="p-0.5 rounded hover:bg-white/10 text-primary">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-0.5 rounded hover:bg-white/10 text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-white text-sm truncate">{mod.name}</h3>
                  )}

                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
                    <FolderOpen className="w-3.5 h-3.5 text-purple-300" />
                    {pageCount} {pageCount === 1 ? "nota" : "notas"}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenModule(mod.id); }}
                      className="inline-flex items-center gap-1 rounded-md border border-purple-300/25 px-2.5 py-1 text-xs font-medium text-purple-100 transition-all hover:border-fuchsia-300/60 hover:text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.55)]"
                    >
                      Acessar <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new module */}
          <button
            onClick={onNewModule}
            className="rounded-xl border-2 border-dashed border-purple-300/25 bg-black/20 p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-purple-300/55 hover:bg-purple-500/10 min-h-[130px]"
          >
            <Plus className="w-6 h-6 text-purple-300" />
            <span className="text-sm text-slate-200 font-medium">Novo módulo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleBoard;
