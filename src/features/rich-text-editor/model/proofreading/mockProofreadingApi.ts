import type { BackendAnnotation } from './types'

type MockRule = {
  kind: string
  selection: string
  description: string
  suggestions: string[]
}

const mockRules: MockRule[] = [
  {
    kind: 'mkSpelling',
    selection: 'Аднжды',
    description: 'Возможно, пропущена буква в слове.',
    suggestions: ['Однажды'],
  },
  {
    kind: 'mkYo',
    selection: 'студеную',
    description: 'Рекомендуется использовать букву "ё".',
    suggestions: ['студёную'],
  },
  {
    kind: 'mkPunctuation',
    selection: 'вышел был',
    description: 'Возможно, пропущена запятая между частями предложения.',
    suggestions: ['вышел, был'],
  },
  {
    kind: 'mkSpelling',
    selection: 'мароз',
    description: 'Ошибка в безударной гласной.',
    suggestions: ['мороз', 'марок'],
  },
  {
    kind: 'mkPunctuation',
    selection: 'гляжу поднимается',
    description: 'Возможно, нужна запятая после вводной части.',
    suggestions: ['гляжу, поднимается'],
  },
  {
    kind: 'mkSpelling',
    selection: 'мдленно',
    description: 'Возможно, опечатка.',
    suggestions: ['медленно'],
  },
  {
    kind: 'mkSpelling',
    selection: 'лошатка',
    description: 'Ошибка в написании парной согласной.',
    suggestions: ['лошадка', 'лошадка.'],
  },
]

export function checkProofreadingMock(
  text: string,
  signal: AbortSignal,
): Promise<BackendAnnotation[]> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      if (signal.aborted) {
        reject(createAbortError())
        return
      }

      const candidates = findMockAnnotations(text)
      const randomAnnotations = candidates.filter(() => Math.random() > 0.35)

      if (randomAnnotations.length > 0 || candidates.length === 0) {
        resolve(randomAnnotations)
        return
      }

      resolve([candidates[Math.floor(Math.random() * candidates.length)]])
    }, 2000)

    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeoutId)
        reject(createAbortError())
      },
      { once: true },
    )
  })
}

function findMockAnnotations(text: string): BackendAnnotation[] {
  return mockRules.flatMap((rule) => {
    const annotations: BackendAnnotation[] = []
    let searchFrom = 0

    while (searchFrom < text.length) {
      const start = text.indexOf(rule.selection, searchFrom)

      if (start < 0) {
        break
      }

      const end = start + rule.selection.length

      annotations.push({
        id: `${rule.kind}-${start}-${end}-${rule.selection}`,
        kind: rule.kind,
        selection: rule.selection,
        position: [{ start, end }],
        description: rule.description,
        suggestion: createSuggestionHtml(rule.suggestions),
      })

      searchFrom = end
    }

    return annotations
  })
}

function createSuggestionHtml(suggestions: string[]) {
  return suggestions
    .map(
      (suggestion) =>
        `<a data-kind="replace-whole" data-word="${suggestion}">${suggestion}</a>`,
    )
    .join(', ')
}

function createAbortError() {
  return new DOMException('Proofreading request aborted', 'AbortError')
}
