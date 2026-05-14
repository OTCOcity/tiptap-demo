import { EditorContent } from '@tiptap/react'

import { useRichTextEditor } from '../model/useRichTextEditor'
import type { RichTextEditorProps } from '../types'
import { EditorTestActions } from './EditorTestActions'
import { EditorToolbar } from './EditorToolbar'

export function RichTextEditor({
  initialContent,
  placeholder,
}: RichTextEditorProps) {
  const editor = useRichTextEditor({ initialContent, placeholder })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-workbench">
      <section className="rich-text-editor" aria-label="WYSIWYG editor">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </section>

      <EditorTestActions editor={editor} />
    </div>
  )
}
