import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export function textOffsetToDocRange(
  doc: ProseMirrorNode,
  fromOffset: number,
  toOffset: number,
) {
  let textOffset = 0
  let from: number | null = null
  let to: number | null = null

  doc.descendants((node, position) => {
    if (!node.isText || !node.text) {
      return true
    }

    const nextTextOffset = textOffset + node.text.length

    if (from === null && fromOffset >= textOffset && fromOffset <= nextTextOffset) {
      from = position + (fromOffset - textOffset)
    }

    if (to === null && toOffset >= textOffset && toOffset <= nextTextOffset) {
      to = position + (toOffset - textOffset)
    }

    textOffset = nextTextOffset
    return true
  })

  if (from === null || to === null || from >= to) {
    return null
  }

  return { from, to }
}
