import type { ProofreadingAnnotation } from '../model/proofreading/types'

type ProofreadingMenuProps = {
  annotation: ProofreadingAnnotation
  position: {
    top: number
    left: number
  }
  onApply: (replacement: string) => void
  onIgnore: () => void
  onClose: () => void
}

export function ProofreadingMenu({
  annotation,
  position,
  onApply,
  onIgnore,
  onClose,
}: ProofreadingMenuProps) {
  return (
    <div
      className="proofreading-menu"
      style={{
        top: position.top,
        left: position.left,
      }}
      role="dialog"
      aria-label="Исправление ошибки"
    >
      <div className="proofreading-menu__header">
        <div>
          <p className="proofreading-menu__kind">{annotation.kind}</p>
          <p className="proofreading-menu__title">
            {annotation.description}
          </p>
        </div>
        <button
          type="button"
          className="proofreading-menu__close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="proofreading-menu__selection">
        Найдено: <strong>{annotation.selection}</strong>
      </div>

      <div className="proofreading-menu__actions">
        {annotation.suggestions.length > 0 ? (
          annotation.suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="proofreading-menu__suggestion"
              onClick={() => onApply(suggestion.replacement)}
            >
              {suggestion.label}
            </button>
          ))
        ) : (
          <p className="proofreading-menu__empty">Нет готовых исправлений</p>
        )}
      </div>

      <button
        type="button"
        className="proofreading-menu__ignore"
        onClick={onIgnore}
      >
        Игнорировать
      </button>
    </div>
  )
}
