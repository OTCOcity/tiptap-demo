import type { Node as ProseMirrorNode } from '@tiptap/pm/model'

export type PlainTextSegment = {
  textFrom: number
  textTo: number
  docFrom: number
  docTo: number
}

export type SerializedPlainText = {
  text: string
  segments: PlainTextSegment[]
}

export function serializeDocToPlainText(
  doc: ProseMirrorNode,
  blockSeparator = '\n',
): SerializedPlainText {
  const blocks: Array<{ text: string; segments: PlainTextSegment[] }> = []

  doc.descendants((node, position) => {
    if (!node.isTextblock) {
      return true
    }

    let blockText = ''
    const blockSegments: PlainTextSegment[] = []

    node.descendants((childNode, childPosition) => {
      if (!childNode.isText || !childNode.text) {
        return true
      }

      const textFrom = blockText.length
      blockText += childNode.text

      blockSegments.push({
        textFrom,
        textTo: blockText.length,
        docFrom: position + 1 + childPosition,
        docTo: position + 1 + childPosition + childNode.text.length,
      })

      return true
    })

    blocks.push({
      text: blockText,
      segments: blockSegments,
    })

    return false
  })

  let text = ''
  const segments: PlainTextSegment[] = []

  blocks.forEach((block, index) => {
    if (index > 0) {
      text += blockSeparator
    }

    const blockTextOffset = text.length
    text += block.text

    block.segments.forEach((segment) => {
      segments.push({
        ...segment,
        textFrom: blockTextOffset + segment.textFrom,
        textTo: blockTextOffset + segment.textTo,
      })
    })
  })

  return { text, segments }
}

export function plainTextRangeToDocRange(
  serializedText: SerializedPlainText,
  textFrom: number,
  textTo: number,
) {
  const fromSegment = findSegmentForOffset(serializedText.segments, textFrom)
  const toSegment = findSegmentForOffset(serializedText.segments, textTo, true)

  if (!fromSegment || !toSegment) {
    return null
  }

  const from = fromSegment.docFrom + (textFrom - fromSegment.textFrom)
  const to = toSegment.docFrom + (textTo - toSegment.textFrom)

  if (from >= to) {
    return null
  }

  return { from, to }
}

function findSegmentForOffset(
  segments: PlainTextSegment[],
  offset: number,
  preferPreviousOnBoundary = false,
) {
  return segments.find((segment) => {
    if (preferPreviousOnBoundary) {
      return offset > segment.textFrom && offset <= segment.textTo
    }

    return offset >= segment.textFrom && offset < segment.textTo
  })
}
