"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Placeholder } from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  Table as TableIcon,
  ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { FigureImage } from "./extensions/figure-image";
import { MediaPickerModal, type PickedMedia } from "@/components/admin/media-picker-modal";
import { cn } from "@/lib/utils";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30",
        active && "bg-navy-900 text-white hover:bg-navy-800"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      FigureImage,
      Placeholder.configure({
        placeholder: "Start writing your article... Use the toolbar to add headings, images, links, and more.",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-stockrino px-4 py-4 min-h-[400px] focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  function handleImageInsert(media: PickedMedia) {
    editor!
      .chain()
      .focus()
      .setFigureImage({
        src: media.url,
        alt: media.altText,
        title: media.title,
        caption: media.caption,
      })
      .run();
  }

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="rounded-lg border border-slate-300 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton label="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton label="Insert Link" active={editor.isActive("link")} onClick={setLink}>
          <LinkIcon size={15} />
        </ToolbarButton>
        <ToolbarButton
          label="Insert Table"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <TableIcon size={15} />
        </ToolbarButton>
        <ToolbarButton label="Insert Image" onClick={() => setImageModalOpen(true)}>
          <ImageIcon size={15} />
        </ToolbarButton>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={15} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      <MediaPickerModal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelect={handleImageInsert}
        title="Insert Image into Article"
      />
    </div>
  );
}
