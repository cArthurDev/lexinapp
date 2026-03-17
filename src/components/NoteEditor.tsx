import React, { useRef, useEffect, useCallback, useState } from "react";
import { ImagePlus, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface NoteEditorProps {
  content: string;
  onChange: (html: string) => void;
  title: string;
  onTitleChange: (title: string) => void;
  icon: string;
  onIconChange: (icon: string) => void;
  onSelectionChange: (rect: DOMRect | null) => void;
}

const EMOJIS = ["📄", "📝", "📌", "📎", "📒", "📕", "📗", "📘", "📙", "🗂️", "💡", "🎯", "🚀", "⭐", "🔥", "💻"];

const MARGIN_STEPS = [
  { label: "Estreita", value: "max-w-5xl", px: "px-4" },
  { label: "Padrão", value: "max-w-3xl", px: "px-6" },
  { label: "Média", value: "max-w-2xl", px: "px-8" },
  { label: "Larga", value: "max-w-xl", px: "px-10" },
];

const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  title,
  onTitleChange,
  icon,
  onIconChange,
  onSelectionChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [marginIndex, setMarginIndex] = useState(1);
  const contentRef = useRef(content);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
      contentRef.current = content;
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      contentRef.current = html;
      onChange(html);
    }
  }, [onChange]);

  const insertImageFromDataUrl = useCallback((dataUrl: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const imageHtml = `<p><img src="${dataUrl}" alt="Imagem" style="max-width:100%;height:auto;border-radius:8px;" /></p><p></p>`;
    document.execCommand("insertHTML", false, imageHtml);
    const html = editorRef.current.innerHTML;
    contentRef.current = html;
    onChange(html);
  }, [onChange]);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) return;
      insertImageFromDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [insertImageFromDataUrl]);

  const handleImageInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = "";
  }, [handleImageFile]);

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onSelectionChange(rect);
    } else {
      onSelectionChange(null);
    }
  }, [onSelectionChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(e.clipboardData.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (!imageFile) return;
    e.preventDefault();
    handleImageFile(imageFile);
  }, [handleImageFile]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (!imageFile) return;
    e.preventDefault();
    handleImageFile(imageFile);
  }, [handleImageFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (Array.from(e.dataTransfer.types).includes("Files")) {
      e.preventDefault();
    }
  }, []);

  const currentMargin = MARGIN_STEPS[marginIndex];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Margin control bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className={`${currentMargin.value} mx-auto flex items-center gap-3 px-6 py-1.5`}>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Margem</span>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setMarginIndex(Math.max(0, marginIndex - 1))}
            disabled={marginIndex === 0}
            className="p-0.5 rounded hover:bg-accent text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="w-24">
            <Slider
              value={[marginIndex]}
              min={0}
              max={MARGIN_STEPS.length - 1}
              step={1}
              onValueChange={([v]) => setMarginIndex(v)}
              className="cursor-pointer"
            />
          </div>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setMarginIndex(Math.min(MARGIN_STEPS.length - 1, marginIndex + 1))}
            disabled={marginIndex === MARGIN_STEPS.length - 1}
            className="p-0.5 rounded hover:bg-accent text-muted-foreground disabled:opacity-30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-muted-foreground">{currentMargin.label}</span>
        </div>
      </div>

      <div className={`${currentMargin.value} mx-auto ${currentMargin.px} py-12 transition-all duration-200`}>
        {/* Icon + Title */}
        <div className="mb-6">
          <div className="relative inline-block mb-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-5xl hover:bg-accent rounded p-1 transition-colors"
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-xl shadow-lg p-3 grid grid-cols-4 gap-2 z-50 min-w-[220px]">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onIconChange(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl h-11 w-11 rounded-lg border border-border/70 hover:bg-accent hover:border-primary/40 transition-colors"
                    aria-label={`Selecionar ícone ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Sem título"
          />
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="w-4 h-4" /> Imagem
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageInputChange}
            />
          </div>
        </div>

        {/* ContentEditable Editor */}
        <div
          ref={editorRef}
          className="notion-editor"
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Comece a escrever, ou pressione '/' para comandos..."
          onInput={handleInput}
          onMouseUp={handleMouseUp}
          onKeyUp={handleMouseUp}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
