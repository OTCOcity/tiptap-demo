import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

import {
  setEditorLink,
  toolbarActions,
  unsetEditorLink,
} from '../model/editorActions'

type EditorToolbarProps = {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) =>
      Object.fromEntries(
        toolbarActions.map((action) => [
          action.id,
          {
            isActive: action.isActive?.(currentEditor) ?? false,
            canExecute: action.canExecute?.(currentEditor) ?? true,
          },
        ]),
      ),
  })
  const linkState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      href: currentEditor.getAttributes('link').href as string | undefined,
      isActive: currentEditor.isActive('link'),
    }),
  })

  useEffect(() => {
    if (!isLinkFormOpen) {
      return
    }

    window.setTimeout(() => linkInputRef.current?.focus(), 0)
  }, [isLinkFormOpen])

  const handleToggleLinkForm = () => {
    setIsLinkFormOpen((isOpen) => {
      const nextIsOpen = !isOpen

      if (nextIsOpen) {
        setLinkUrl(editor.getAttributes('link').href ?? '')
      }

      return nextIsOpen
    })
  }

  const handleApplyLink = () => {
    setEditorLink(editor, linkUrl)
    setIsLinkFormOpen(false)
  }

  const handleRemoveLink = () => {
    unsetEditorLink(editor)
    setLinkUrl('')
    setIsLinkFormOpen(false)
  }

  return (
    <div className="rich-text-editor__toolbar" aria-label="Editor toolbar">
      {toolbarActions.map((action) => {
        const state = toolbarState[action.id]

        return (
          <button
            key={action.id}
            type="button"
            className="editor-button"
            title={action.title}
            aria-label={action.title}
            aria-pressed={state.isActive}
            disabled={!state.canExecute}
            onClick={() => action.run(editor)}
          >
            {action.label}
          </button>
        )
      })}
      <div className="link-control">
        <button
          type="button"
          className="editor-button"
          title="Edit link"
          aria-label="Edit link"
          aria-expanded={isLinkFormOpen}
          aria-pressed={linkState.isActive}
          onClick={handleToggleLinkForm}
        >
          Link
        </button>

        {isLinkFormOpen ? (
          <form
            className="link-control__form"
            onSubmit={(event) => {
              event.preventDefault()
              handleApplyLink()
            }}
          >
            <input
              ref={linkInputRef}
              className="link-control__input"
              type="url"
              value={linkUrl}
              placeholder="https://example.com"
              aria-label="Link URL"
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsLinkFormOpen(false)
                }
              }}
            />
            <button type="submit" className="link-control__button">
              Save
            </button>
            <button
              type="button"
              className="link-control__button"
              disabled={!linkState.isActive}
              onClick={handleRemoveLink}
            >
              Remove
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
