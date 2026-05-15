import { useEditor } from '@tiptap/react'
import type { EditorView } from '@tiptap/pm/view'

import { createEditorExtensions } from '../config/extensions'

type UseRichTextEditorOptions = {
  initialContent?: string
  placeholder?: string
}

export function useRichTextEditor(options: UseRichTextEditorOptions = {}) {
  return useEditor({
    extensions: createEditorExtensions({
      placeholder: options.placeholder,
    }),
    content: options.initialContent ?? '',
    editorProps: {
      attributes: {
        class: 'rich-text-editor__content',
        spellcheck: 'false',
      },
      handleDOMEvents: {
        click: (view, event) => handleLinkClick(view, event),
      },
    },
  })
}

function handleLinkClick(view: EditorView, event: MouseEvent) {
  if (event.button !== 0 || !event.ctrlKey) {
    return false
  }

  const href = getClickedLink(event)?.getAttribute('href') ?? getLinkHrefAtClick(view, event)

  if (!href) {
    return false
  }

  event.preventDefault()
  event.stopPropagation()
  event.stopImmediatePropagation()

  const newWindow = window.open(href, '_blank', 'noopener')

  if (newWindow) {
    newWindow.opener = null
    newWindow.focus()
  }

  return true
}

function getClickedLink(event: MouseEvent) {
  for (const element of event.composedPath()) {
    if (element instanceof HTMLAnchorElement) {
      return element
    }

    if (element === event.currentTarget) {
      return null
    }
  }

  return null
}

function getLinkHrefAtClick(view: EditorView, event: MouseEvent) {
  const position = view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  })

  if (!position) {
    return null
  }

  return getLinkHrefAtPosition(view, position.pos)
}

function getLinkHrefAtPosition(view: EditorView, position: number) {
  const positions = position > 0 ? [position, position - 1] : [position]

  for (const currentPosition of positions) {
    const resolvedPosition = view.state.doc.resolve(currentPosition)
    const linkMark = resolvedPosition.marks().find((mark) => mark.type.name === 'link')
    const href = linkMark?.attrs.href

    if (typeof href === 'string' && href) {
      return href
    }
  }

  return null
}
