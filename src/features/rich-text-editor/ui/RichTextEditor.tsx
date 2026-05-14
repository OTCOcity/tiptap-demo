import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { EditorContent } from '@tiptap/react'

import { getProofreadingAnnotationRange } from '../model/proofreading/proofreadingExtension'
import type { ProofreadingAnnotation } from '../model/proofreading/types'
import { useRichTextEditor } from '../model/useRichTextEditor'
import type { RichTextEditorProps } from '../types'
import { EditorTestActions } from './EditorTestActions'
import { EditorToolbar } from './EditorToolbar'
import { ExportedHtmlPreview } from './ExportedHtmlPreview'
import { ProofreadingMenu } from './ProofreadingMenu'

export function RichTextEditor({
  initialContent,
  placeholder,
  proofreadingAnnotations = [],
}: RichTextEditorProps) {
  const [exportedHtml, setExportedHtml] = useState('')
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null,
  )
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const editor = useRichTextEditor({ initialContent, placeholder })

  const activeAnnotation = useMemo(
    () =>
      proofreadingAnnotations.find(
        (annotation) => annotation.id === activeAnnotationId,
      ) ?? null,
    [activeAnnotationId, proofreadingAnnotations],
  )

  useEffect(() => {
    editor?.commands.setProofreadingAnnotations(proofreadingAnnotations)
  }, [editor, proofreadingAnnotations])

  if (!editor) {
    return null
  }

  const handleExportHtml = () => {
    setExportedHtml(editor.getHTML())
  }

  const handleEditorClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target

    if (!(target instanceof HTMLElement)) {
      return
    }

    const errorElement = target.closest<HTMLElement>('[data-proofreading-id]')

    if (!errorElement) {
      setActiveAnnotationId(null)
      return
    }

    const annotationId = errorElement.dataset.proofreadingId

    if (!annotationId) {
      return
    }

    const rect = errorElement.getBoundingClientRect()
    setMenuPosition({
      top: rect.bottom + 8,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 340)),
    })
    setActiveAnnotationId(annotationId)
  }

  const handleApplySuggestion = (
    annotation: ProofreadingAnnotation,
    replacement: string,
  ) => {
    const range = getProofreadingAnnotationRange(editor, annotation.id)

    if (!range) {
      setActiveAnnotationId(null)
      return
    }

    editor.chain().focus().insertContentAt(range, replacement).run()
    editor.commands.removeProofreadingAnnotation(annotation.id)
    setActiveAnnotationId(null)
  }

  const handleIgnoreAnnotation = (annotation: ProofreadingAnnotation) => {
    editor.commands.removeProofreadingAnnotation(annotation.id)
    setActiveAnnotationId(null)
  }

  return (
    <div className="editor-workbench">
      <section
        className="rich-text-editor"
        aria-label="WYSIWYG editor"
        onClick={handleEditorClick}
      >
        <EditorToolbar editor={editor} />
        <EditorContent editor={editor} />
      </section>

      <EditorTestActions editor={editor} onExportHtml={handleExportHtml} />
      <ExportedHtmlPreview html={exportedHtml} />

      {activeAnnotation ? (
        <ProofreadingMenu
          annotation={activeAnnotation}
          position={menuPosition}
          onApply={(replacement) =>
            handleApplySuggestion(activeAnnotation, replacement)
          }
          onIgnore={() => handleIgnoreAnnotation(activeAnnotation)}
          onClose={() => setActiveAnnotationId(null)}
        />
      ) : null}
    </div>
  )
}
