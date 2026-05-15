import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'

import { ProofreadingAnnotations } from '../model/proofreading/proofreadingExtension'

type EditorExtensionsOptions = {
  placeholder?: string
}

export function createEditorExtensions(options: EditorExtensionsOptions = {}) {
  return [
    StarterKit,
    Placeholder.configure({
      placeholder: options.placeholder ?? 'Start typing...',
    }),
    Link.configure({
      autolink: true,
      linkOnPaste: true,
      openOnClick: false,
      HTMLAttributes: {
        rel: null,
        target: null,
      },
    }),
    ProofreadingAnnotations,
  ]
}
