import { RichTextEditor } from '../../../features/rich-text-editor'
import {
  mockProofreadingAnnotations,
  mockProofreadingText,
} from '../../../features/rich-text-editor/model/proofreading/mockProofreading'

export function EditorDemoPage() {
  return (
    <main className="demo-page">
      <section className="demo-header">
        <div>
          <p className="eyebrow">TipTap playground</p>
          <h1>WYSIWYG editor demo</h1>
        </div>
        <p>
          Базовая страница для проверки возможностей TipTap и последующего
          расширения под форматирование, ссылки, code blocks и исправления
          ошибок с бэка.
        </p>
      </section>

      <RichTextEditor
        initialContent={`<p>${mockProofreadingText}</p>`}
        placeholder="Напишите текст..."
        proofreadingAnnotations={mockProofreadingAnnotations}
      />
    </main>
  )
}
