import { useEffect, useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'

import { normalizeBackendAnnotations } from './annotationAdapter'
import { getAnnotationFingerprint } from './annotationIdentity'
import { checkProofreadingMock } from './mockProofreadingApi'
import { serializeDocToPlainText } from './plainTextSerializer'
import type { ProofreadingAnnotation } from './types'

export type ProofreadingStatus =
  | 'idle'
  | 'waiting'
  | 'checking'
  | 'ready'
  | 'error'

export function useProofreadingCheck(editor: Editor | null) {
  const [annotations, setAnnotations] = useState<ProofreadingAnnotation[]>([])
  const [status, setStatus] = useState<ProofreadingStatus>('idle')
  const ignoredFingerprints = useRef(new Set<string>())
  const debounceTimer = useRef<number | null>(null)
  const abortController = useRef<AbortController | null>(null)
  const requestId = useRef(0)

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    const runCheck = () => {
      abortController.current?.abort()

      const currentRequestId = requestId.current + 1
      requestId.current = currentRequestId
      const controller = new AbortController()
      abortController.current = controller

      const { text } = serializeDocToPlainText(editor.state.doc)

      if (!text.trim()) {
        setAnnotations([])
        setStatus('idle')
        editor.commands.setProofreadingAnnotations([])
        return
      }

      setStatus('checking')

      checkProofreadingMock(text, controller.signal)
        .then((backendAnnotations) => {
          if (
            controller.signal.aborted ||
            currentRequestId !== requestId.current
          ) {
            return
          }

          const nextAnnotations = normalizeBackendAnnotations(
            backendAnnotations,
          ).filter(
            (annotation) =>
              !ignoredFingerprints.current.has(
                getAnnotationFingerprint(annotation),
              ),
          )

          setAnnotations(nextAnnotations)
          setStatus('ready')
          editor.commands.setProofreadingAnnotations(nextAnnotations)
        })
        .catch((error: unknown) => {
          if (
            controller.signal.aborted ||
            currentRequestId !== requestId.current
          ) {
            return
          }

          if (error instanceof DOMException && error.name === 'AbortError') {
            return
          }

          setStatus('error')
        })
    }

    const scheduleCheck = () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current)
      }

      abortController.current?.abort()
      setStatus('waiting')

      debounceTimer.current = window.setTimeout(runCheck, 2000)
    }

    scheduleCheck()
    editor.on('update', scheduleCheck)

    return () => {
      editor.off('update', scheduleCheck)

      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current)
      }

      abortController.current?.abort()
    }
  }, [editor])

  const removeAnnotation = (annotationId: string) => {
    setAnnotations((currentAnnotations) =>
      currentAnnotations.filter((annotation) => annotation.id !== annotationId),
    )
    editor?.commands.removeProofreadingAnnotation(annotationId)
  }

  const ignoreAnnotation = (annotation: ProofreadingAnnotation) => {
    ignoredFingerprints.current.add(getAnnotationFingerprint(annotation))
    removeAnnotation(annotation.id)
  }

  return {
    annotations,
    status,
    removeAnnotation,
    ignoreAnnotation,
  }
}
