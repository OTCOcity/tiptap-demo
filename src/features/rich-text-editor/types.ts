import type { ProofreadingAnnotation } from './model/proofreading/types'

export type RichTextEditorProps = {
  initialContent?: string
  placeholder?: string
  proofreadingAnnotations?: ProofreadingAnnotation[]
}
