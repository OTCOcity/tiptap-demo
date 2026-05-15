import { Extension, type Editor } from '@tiptap/core'
import { Plugin, PluginKey, type Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import {
  plainTextRangeToDocRange,
  serializeDocToPlainText,
} from './plainTextSerializer'
import type { ProofreadingAnnotation } from './types'

type TrackedProofreadingAnnotation = ProofreadingAnnotation & {
  docFrom: number
  docTo: number
}

type ProofreadingPluginState = {
  annotations: TrackedProofreadingAnnotation[]
  decorations: DecorationSet
}

type SetProofreadingPluginMeta = {
  type: 'set'
  annotations: ProofreadingAnnotation[]
}

type RemoveProofreadingPluginMeta = {
  type: 'remove'
  annotationId: string
}

type ProofreadingPluginMeta =
  | SetProofreadingPluginMeta
  | RemoveProofreadingPluginMeta

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    proofreadingAnnotations: {
      setProofreadingAnnotations: (
        annotations: ProofreadingAnnotation[],
      ) => ReturnType
      removeProofreadingAnnotation: (annotationId: string) => ReturnType
    }
  }
}

export const proofreadingPluginKey =
  new PluginKey<ProofreadingPluginState>('proofreadingAnnotations')

export function getProofreadingAnnotationRange(
  editor: Editor,
  annotationId: string,
) {
  const annotation = proofreadingPluginKey
    .getState(editor.state)
    ?.annotations.find((currentAnnotation) => currentAnnotation.id === annotationId)

  if (!annotation) {
    return null
  }

  return {
    from: annotation.docFrom,
    to: annotation.docTo,
  }
}

export const ProofreadingAnnotations = Extension.create({
  name: 'proofreadingAnnotations',

  addCommands() {
    return {
      setProofreadingAnnotations:
        (annotations) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(proofreadingPluginKey, {
              type: 'set',
              annotations,
            } satisfies SetProofreadingPluginMeta)
            dispatch(tr)
          }

          return true
        },
      removeProofreadingAnnotation:
        (annotationId) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta(proofreadingPluginKey, {
              type: 'remove',
              annotationId,
            } satisfies RemoveProofreadingPluginMeta)
            dispatch(tr)
          }

          return true
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<ProofreadingPluginState>({
        key: proofreadingPluginKey,
        state: {
          init: () => ({
            annotations: [],
            decorations: DecorationSet.empty,
          }),
          apply: (transaction, previousState, _, nextState) => {
            const meta = transaction.getMeta(
              proofreadingPluginKey,
            ) as ProofreadingPluginMeta | undefined

            if (meta?.type === 'set') {
              const annotations = createTrackedAnnotations(
                nextState.doc,
                meta.annotations,
              )

              return {
                annotations,
                decorations: buildDecorations(nextState.doc, annotations),
              }
            }

            if (meta?.type === 'remove') {
              const annotations = previousState.annotations.filter(
                (annotation) => annotation.id !== meta.annotationId,
              )

              return {
                annotations,
                decorations: buildDecorations(nextState.doc, annotations),
              }
            }

            if (transaction.docChanged) {
              const annotations = mapTrackedAnnotations(
                previousState.annotations,
                transaction,
              )

              return {
                annotations,
                decorations: buildDecorations(nextState.doc, annotations),
              }
            }

            return previousState
          },
        },
        props: {
          decorations: (state) =>
            proofreadingPluginKey.getState(state)?.decorations ??
            DecorationSet.empty,
        },
      }),
    ]
  },
})

function createTrackedAnnotations(
  doc: Parameters<typeof DecorationSet.create>[0],
  annotations: ProofreadingAnnotation[],
) {
  const serializedText = serializeDocToPlainText(doc)

  return annotations.flatMap((annotation) => {
    const range = plainTextRangeToDocRange(
      serializedText,
      annotation.from,
      annotation.to,
    )

    if (!range) {
      return []
    }

    return [
      {
        ...annotation,
        docFrom: range.from,
        docTo: range.to,
      },
    ]
  })
}

function mapTrackedAnnotations(
  annotations: TrackedProofreadingAnnotation[],
  transaction: Transaction,
) {
  return annotations.flatMap((annotation) => {
    let docFrom = annotation.docFrom
    let docTo = annotation.docTo
    let shouldRemove = false

    for (const stepMap of transaction.mapping.maps) {
      stepMap.forEach((oldStart, oldEnd) => {
        if (changeTouchesAnnotation(oldStart, oldEnd, docFrom, docTo)) {
          shouldRemove = true
        }
      })

      if (shouldRemove) {
        return []
      }

      docFrom = stepMap.map(docFrom, 1)
      docTo = stepMap.map(docTo, -1)
    }

    if (docFrom >= docTo) {
      return []
    }

    return [
      {
        ...annotation,
        docFrom,
        docTo,
      },
    ]
  })
}

function changeTouchesAnnotation(
  changeFrom: number,
  changeTo: number,
  annotationFrom: number,
  annotationTo: number,
) {
  if (changeFrom === changeTo) {
    return changeFrom >= annotationFrom && changeFrom <= annotationTo
  }

  return changeFrom < annotationTo && changeTo > annotationFrom
}

function buildDecorations(
  doc: Parameters<typeof DecorationSet.create>[0],
  annotations: TrackedProofreadingAnnotation[],
) {
  const decorations = annotations.map((annotation) =>
    Decoration.inline(annotation.docFrom, annotation.docTo, {
      class: [
        'proofreading-error',
        `proofreading-error--${annotation.tone}`,
        `proofreading-error--${annotation.lineStyle}`,
      ].join(' '),
      'data-proofreading-id': annotation.id,
    }),
  )

  return DecorationSet.create(doc, decorations)
}
