import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'

import { toolbarActions } from '../model/editorActions'

type EditorToolbarProps = {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
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
    </div>
  )
}
