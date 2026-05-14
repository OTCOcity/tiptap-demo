import type {
  BackendAnnotation,
  ProofreadingAnnotation,
  ProofreadingLineStyle,
  ProofreadingSuggestion,
  ProofreadingTone,
} from './types'

const kindView: Record<
  string,
  { tone: ProofreadingTone; lineStyle: ProofreadingLineStyle }
> = {
  mkSpelling: { tone: 'red', lineStyle: 'solid' },
  mkPunctuation: { tone: 'yellow', lineStyle: 'dashed' },
  mkYo: { tone: 'purple', lineStyle: 'solid' },
}

export function normalizeBackendAnnotations(
  annotations: BackendAnnotation[],
): ProofreadingAnnotation[] {
  return annotations.flatMap((annotation) => {
    const view = kindView[annotation.kind] ?? {
      tone: 'red' as const,
      lineStyle: 'dashed' as const,
    }

    return (annotation.position ?? []).map((position, positionIndex) => ({
      id: `${annotation.id}-${positionIndex}`,
      kind: annotation.kind,
      selection: annotation.selection,
      from: position.start,
      to: position.end,
      description: annotation.description ?? 'Найдена ошибка',
      explanation: annotation.explanation,
      tone: view.tone,
      lineStyle: view.lineStyle,
      suggestions: extractSuggestions(annotation.suggestion),
    }))
  })
}

function extractSuggestions(suggestion?: string): ProofreadingSuggestion[] {
  if (!suggestion) {
    return []
  }

  const matches = Array.from(suggestion.matchAll(/data-word="([^"]+)"/g))
  const words = matches.map((match) => match[1]).filter(Boolean)

  return Array.from(new Set(words)).map((word, index) => ({
    id: `${word}-${index}`,
    label: word,
    replacement: word,
  }))
}
