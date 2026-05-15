import type { ProofreadingAnnotation } from './types'

export function getAnnotationFingerprint(annotation: ProofreadingAnnotation) {
  return [
    annotation.kind,
    annotation.selection.trim().toLowerCase(),
    annotation.description.trim().toLowerCase(),
    annotation.suggestions
      .map((suggestion) => suggestion.replacement.trim().toLowerCase())
      .join(','),
  ].join('|')
}
