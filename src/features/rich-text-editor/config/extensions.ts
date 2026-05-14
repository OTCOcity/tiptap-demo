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
    ProofreadingAnnotations,
  ]
}
