import type { Editor } from '@tiptap/react'

import {
  insertEmoji,
  insertRandomText,
  sampleEmojis,
} from '../model/editorActions'

type EditorTestActionsProps = {
  editor: Editor
}

export function EditorTestActions({ editor }: EditorTestActionsProps) {
  return (
    <section className="editor-test-actions" aria-label="Feature test actions">
      <div>
        <p className="editor-test-actions__title">Тест фич</p>
        <p className="editor-test-actions__hint">
          Действия вставляют контент в текущую позицию курсора.
        </p>
      </div>

      <div className="editor-test-actions__controls">
        <button
          type="button"
          className="test-action-button test-action-button--primary"
          onClick={() => insertRandomText(editor)}
        >
          Вставить текст
        </button>

        {sampleEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="test-action-button test-action-button--emoji"
            aria-label={`Вставить ${emoji}`}
            onClick={() => insertEmoji(editor, emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </section>
  )
}
