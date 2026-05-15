import type { Editor } from '@tiptap/react'

export type ToolbarAction = {
  id: string
  label: string
  title: string
  isActive?: (editor: Editor) => boolean
  canExecute?: (editor: Editor) => boolean
  run: (editor: Editor) => void
}

export const toolbarActions: ToolbarAction[] = [
  {
    id: 'bold',
    label: 'B',
    title: 'Жирный',
    isActive: (editor) => editor.isActive('bold'),
    canExecute: (editor) => editor.can().chain().focus().toggleBold().run(),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    id: 'italic',
    label: 'I',
    title: 'Курсив',
    isActive: (editor) => editor.isActive('italic'),
    canExecute: (editor) => editor.can().chain().focus().toggleItalic().run(),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    id: 'strike',
    label: 'S',
    title: 'Зачеркнутый',
    isActive: (editor) => editor.isActive('strike'),
    canExecute: (editor) => editor.can().chain().focus().toggleStrike().run(),
    run: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    id: 'undo',
    label: 'Undo',
    title: 'Отменить',
    canExecute: (editor) => editor.can().chain().focus().undo().run(),
    run: (editor) => editor.chain().focus().undo().run(),
  },
  {
    id: 'redo',
    label: 'Redo',
    title: 'Повторить',
    canExecute: (editor) => editor.can().chain().focus().redo().run(),
    run: (editor) => editor.chain().focus().redo().run(),
  },
  {
    id: 'codeBlock',
    label: 'Code',
    title: 'Блок кода',
    isActive: (editor) => editor.isActive('codeBlock'),
    run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'blockquote',
    label: 'Quote',
    title: 'Цитата',
    isActive: (editor) => editor.isActive('blockquote'),
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'bulletList',
    label: 'UL',
    title: 'Маркированный список',
    isActive: (editor) => editor.isActive('bulletList'),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'orderedList',
    label: 'OL',
    title: 'Нумерованный список',
    isActive: (editor) => editor.isActive('orderedList'),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
]

const sampleTexts = [
  'Новый фрагмент текста для проверки вставки.',
  'TipTap сохраняет позицию курсора и умеет вставлять контент в текущее место.',
  'Этот текст имитирует данные, которые позже можно будет подставлять из API.',
]

export const sampleEmojis = ['🙂', '🔥', '✅']

export function insertRandomText(editor: Editor) {
  const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
  editor.chain().focus().insertContent(text).run()
}

export function insertEmoji(editor: Editor, emoji: string) {
  editor.chain().focus().insertContent(emoji).run()
}

export function setEditorLink(editor: Editor, rawHref: string) {
  const href = normalizeHref(rawHref)

  if (!href) {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
}

export function unsetEditorLink(editor: Editor) {
  editor.chain().focus().extendMarkRange('link').unsetLink().run()
}

function normalizeHref(rawHref: string) {
  const href = rawHref.trim()

  if (!href) {
    return ''
  }

  if (
    href.startsWith('/') ||
    href.startsWith('#') ||
    /^[a-z][a-z0-9+.-]*:/i.test(href)
  ) {
    return href
  }

  return `https://${href}`
}
