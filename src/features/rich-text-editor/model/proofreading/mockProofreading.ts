import { normalizeBackendAnnotations } from './annotationAdapter'
import type { BackendAnnotation } from './types'

export const mockProofreadingText =
  'Аднжды в студеную зимнюю пору я из лесу вышел был сильный мароз, гляжу поднимается мдленно в гору лошатка.'

const mockBackendAnnotations: BackendAnnotation[] = [
  createMockAnnotation({
    id: 0,
    kind: 'mkSpelling',
    selection: 'Аднжды',
    description: 'Возможно, пропущена буква в слове.',
    suggestion: '<a data-kind="replace-whole" data-word="Однажды">Однажды</a>',
  }),
  createMockAnnotation({
    id: 1,
    kind: 'mkYo',
    selection: 'студеную',
    description: 'Рекомендуется использовать букву "ё".',
    suggestion:
      '<a data-kind="replace-whole" data-word="студёную">студёную</a>',
  }),
  createMockAnnotation({
    id: 2,
    kind: 'mkPunctuation',
    selection: 'вышел был',
    description: 'Возможно, пропущена запятая между частями предложения.',
    suggestion:
      '<a data-kind="replace-whole" data-word="вышел, был">вышел, был</a>',
  }),
  createMockAnnotation({
    id: 3,
    kind: 'mkSpelling',
    selection: 'мароз',
    description: 'Ошибка в безударной гласной.',
    suggestion:
      '<a data-kind="replace-whole" data-word="мороз">мороз</a>, <a data-kind="replace-whole" data-word="марок">марок</a>',
  }),
  createMockAnnotation({
    id: 4,
    kind: 'mkPunctuation',
    selection: 'гляжу поднимается',
    description: 'Возможно, нужна запятая после вводной части.',
    suggestion:
      '<a data-kind="replace-whole" data-word="гляжу, поднимается">гляжу, поднимается</a>',
  }),
  createMockAnnotation({
    id: 5,
    kind: 'mkSpelling',
    selection: 'мдленно',
    description: 'Возможно, опечатка.',
    suggestion:
      '<a data-kind="replace-whole" data-word="медленно">медленно</a>',
  }),
  createMockAnnotation({
    id: 6,
    kind: 'mkSpelling',
    selection: 'лошатка',
    description: 'Ошибка в написании парной согласной.',
    suggestion:
      '<a data-kind="replace-whole" data-word="лошадка">лошадка</a>, <a data-kind="replace-whole" data-word="лошадка.">лошадка.</a>',
  }),
]

export const mockProofreadingAnnotations =
  normalizeBackendAnnotations(mockBackendAnnotations)

function createMockAnnotation(
  annotation: Omit<BackendAnnotation, 'position'>,
): BackendAnnotation {
  const start = mockProofreadingText.indexOf(annotation.selection)

  return {
    ...annotation,
    position:
      start >= 0
        ? [
            {
              start,
              end: start + annotation.selection.length,
            },
          ]
        : [],
  }
}
