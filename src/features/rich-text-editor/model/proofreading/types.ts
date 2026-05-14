export type ProofreadingTone = 'red' | 'yellow' | 'purple'

export type ProofreadingLineStyle = 'solid' | 'dashed'

export type BackendAnnotation = {
  id: number | string
  kind: string
  selection: string
  position?: Array<{
    start: number
    end: number
  }>
  description?: string
  suggestion?: string
  explanation?: string
}

export type ProofreadingSuggestion = {
  id: string
  label: string
  replacement: string
}

export type ProofreadingAnnotation = {
  id: string
  kind: string
  selection: string
  from: number
  to: number
  description: string
  explanation?: string
  tone: ProofreadingTone
  lineStyle: ProofreadingLineStyle
  suggestions: ProofreadingSuggestion[]
}
