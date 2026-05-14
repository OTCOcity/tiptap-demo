import { useState } from 'react'
import { EditorContent } from '@tiptap/react'

import { useRichTextEditor } from '../model/useRichTextEditor'
import type { RichTextEditorProps } from '../types'
import { EditorTestActions } from './EditorTestActions'
import { ExportedHtmlPreview } from './ExportedHtmlPreview'
import { EditorToolbar } from './EditorToolbar'

export function RichTextEditor({
  initialContent,
  placeholder,
}: RichTextEditorProps) {
  const [exportedHtml, setExportedHtml] = useState('')
  const editor = useRichTextEditor({ initialContent, placeholder })

  if (!editor) {
    return null
  }

  const handleExportHtml = () => {
    setExportedHtml(editor.getHTML())
  }

  return (
    <div className="editor-workbench">
      <section className="rich-text-editor" aria-label="WYSIWYG editor">
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </section>

      <EditorTestActions editor={editor} onExportHtml={handleExportHtml} />
      <ExportedHtmlPreview html={exportedHtml} />
    </div>
  )
}
