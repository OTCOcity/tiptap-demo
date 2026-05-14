import { useEditor } from '@tiptap/react'

import { createEditorExtensions } from '../config/extensions'

type UseRichTextEditorOptions = {
  initialContent?: string
  placeholder?: string
}

export function useRichTextEditor(options: UseRichTextEditorOptions = {}) {
  return useEditor({
    extensions: createEditorExtensions({
      placeholder: options.placeholder,
    }),
    content: options.initialContent ?? '',
    editorProps: {
      attributes: {
        class: 'rich-text-editor__content',
      },
    },
  })
}
