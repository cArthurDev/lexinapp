import React, { useRef, useEffect, useCallback } from "react";

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
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    if (editorRef.current && contentRef.current !== content) {
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">
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
              <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1 z-50">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onIconChange(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl p-1 rounded hover:bg-accent transition-colors"
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
        />
      </div>
    </div>
  );
};

export default NoteEditor;
