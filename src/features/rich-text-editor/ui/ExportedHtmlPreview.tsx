import './ExportedHtmlPreview.css'

type ExportedHtmlPreviewProps = {
  html: string
}

export function ExportedHtmlPreview({ html }: ExportedHtmlPreviewProps) {
  if (!html) {
    return null
  }

  return (
    <section className="exported-html-preview" aria-label="Exported HTML">
      <div className="exported-html-preview__header">
        <div>
          <p className="exported-html-preview__eyebrow">Exported HTML</p>
          <h2 className="exported-html-preview__title">Результат экспорта</h2>
        </div>
      </div>

      <div
        className="exported-html-preview__content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <pre className="exported-html-preview__source">
        <code>{html}</code>
      </pre>
    </section>
  )
}
