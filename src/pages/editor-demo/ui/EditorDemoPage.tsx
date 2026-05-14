import { RichTextEditor } from '../../../features/rich-text-editor'

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
        initialContent="<p>Начните писать текст здесь. Это минимальная интеграция TipTap, готовая к расширению.</p>"
        placeholder="Напишите текст..."
      />
    </main>
  )
}
