import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

interface FloatingToolbarProps {
  position: { top: number; left: number } | null;
}

const TEXT_COLORS = [
  { label: "Padrão", value: "inherit" },
  { label: "Vermelho", value: "#e03e3e" },
  { label: "Laranja", value: "#d9730d" },
  { label: "Amarelo", value: "#dfab01" },
  { label: "Verde", value: "#0f7b6c" },
  { label: "Azul", value: "#0b6e99" },
  { label: "Roxo", value: "#6940a5" },
  { label: "Rosa", value: "#ad1a72" },
  { label: "Cinza", value: "#9b9a97" },
];

const BG_COLORS = [
  { label: "Nenhum", value: "transparent" },
  { label: "Amarelo", css: "hsl(45, 93%, 90%)" },
  { label: "Azul", css: "hsl(210, 100%, 93%)" },
  { label: "Verde", css: "hsl(140, 60%, 90%)" },
  { label: "Rosa", css: "hsl(330, 80%, 93%)" },
  { label: "Roxo", css: "hsl(270, 60%, 93%)" },
  { label: "Laranja", css: "hsl(25, 90%, 92%)" },
  { label: "Vermelho", css: "hsl(0, 80%, 93%)" },
  { label: "Cinza", css: "hsl(0, 0%, 93%)" },
];

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ position }) => {
  const [showTextColors, setShowTextColors] = React.useState(false);
  const [showBgColors, setShowBgColors] = React.useState(false);

  if (!position) return null;

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  const formatBlock = (tag: string) => {
    document.execCommand("formatBlock", false, tag);
  };

  const closeDropdowns = () => {
    setShowTextColors(false);
    setShowBgColors(false);
  };

  return (
    <div
      className="floating-toolbar fixed z-50 bg-popover border border-border rounded-lg shadow-lg flex items-center gap-0.5 px-1 py-1"
      style={{ top: position.top - 48, left: position.left }}
    >
      <ToolBtn onClick={() => exec("bold")} title="Negrito"><Bold className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("italic")} title="Itálico"><Italic className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("underline")} title="Sublinhado"><Underline className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("strikethrough")} title="Tachado"><Strikethrough className="w-4 h-4" /></ToolBtn>

      <div className="w-px h-5 bg-border mx-0.5" />

      <ToolBtn onClick={() => formatBlock("h1")} title="Título 1"><Heading1 className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => formatBlock("h2")} title="Título 2"><Heading2 className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => formatBlock("h3")} title="Título 3"><Heading3 className="w-4 h-4" /></ToolBtn>

      <div className="w-px h-5 bg-border mx-0.5" />

      <ToolBtn onClick={() => exec("insertUnorderedList")} title="Lista"><List className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("insertOrderedList")} title="Lista numerada"><ListOrdered className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => formatBlock("blockquote")} title="Citação"><Quote className="w-4 h-4" /></ToolBtn>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Alignment */}
      <ToolBtn onClick={() => exec("justifyLeft")} title="Alinhar à esquerda"><AlignLeft className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("justifyCenter")} title="Centralizar"><AlignCenter className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("justifyRight")} title="Alinhar à direita"><AlignRight className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => exec("justifyFull")} title="Justificar"><AlignJustify className="w-4 h-4" /></ToolBtn>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Text color */}
      <div className="relative">
        <ToolBtn
          onClick={() => { setShowTextColors(!showTextColors); setShowBgColors(false); }}
          title="Cor do texto"
        >
          <Palette className="w-4 h-4" />
        </ToolBtn>
        {showTextColors && (
          <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1 min-w-[140px]">
            {TEXT_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => { exec("foreColor", c.value); setShowTextColors(false); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-accent transition-colors"
              >
                <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: c.value === "inherit" ? "currentColor" : c.value }} />
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Background color */}
      <div className="relative">
        <ToolBtn
          onClick={() => { setShowBgColors(!showBgColors); setShowTextColors(false); }}
          title="Destaque"
        >
          <Highlighter className="w-4 h-4" />
        </ToolBtn>
        {showBgColors && (
          <div className="absolute top-full right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg p-2 grid grid-cols-3 gap-1 min-w-[140px]">
            {BG_COLORS.map((c) => (
              <button
                key={c.label}
                onClick={() => { exec("hiliteColor", c.css || c.value); setShowBgColors(false); }}
                className="flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-accent transition-colors"
              >
                <span className="w-3 h-3 rounded border border-border" style={{ backgroundColor: c.css || c.value }} />
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ToolBtn: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({
  onClick,
  title,
  children,
}) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className="p-1.5 rounded hover:bg-accent text-foreground transition-colors"
  >
    {children}
  </button>
);

export default FloatingToolbar;
