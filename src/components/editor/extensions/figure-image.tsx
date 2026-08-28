import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Trash2 } from "lucide-react";

export interface FigureImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figureImage: {
      setFigureImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

function FigureImageView({ node, updateAttributes, deleteNode, editor }: any) {
  const { src, alt, caption } = node.attrs;
  const editable = editor.isEditable;

  return (
    <NodeViewWrapper className="relative my-6 group" data-drag-handle>
      <figure className="m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || ""} className="rounded-xl w-full h-auto" />
        {editable && (
          <button
            type="button"
            onClick={deleteNode}
            contentEditable={false}
            className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <Trash2 size={14} />
          </button>
        )}
        <figcaption
          className="text-center text-sm text-slate-500 mt-2 outline-none"
          contentEditable={editable}
          suppressContentEditableWarning
          data-placeholder="Add a caption (optional)"
          onBlur={(e) => updateAttributes({ caption: e.currentTarget.textContent || "" })}
        >
          {caption}
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

export const FigureImage = Node.create<FigureImageOptions>({
  name: "figureImage",
  group: "block",
  atom: false,
  draggable: true,
  isolating: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      title: { default: "" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="figure-image"]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { src, alt, title, caption } = node.attrs;
    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "figure-image",
      }),
      ["img", { src, alt, title }],
      ...(caption ? [["figcaption", {}, caption]] : []),
    ] as any;
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureImageView);
  },

  addCommands() {
    return {
      setFigureImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
