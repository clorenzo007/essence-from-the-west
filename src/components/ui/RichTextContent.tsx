import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from 'lexical'

import { cn } from '@/lib/utils'

type RichTextContentProps = {
  content: unknown
  className?: string
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  if (!content || typeof content !== 'object' || !('root' in (content as object))) {
    return null
  }

  const html = convertLexicalToHTML({
    data: content as SerializedEditorState,
    disableContainer: true,
  })

  if (!html) return null

  return (
    <div
      className={cn('payload-richtext max-w-3xl', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
