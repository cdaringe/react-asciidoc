import Processor from 'asciidoctor'
import type { Asciidoctor } from 'asciidoctor'
import hljs from 'highlight.js'
import parse from 'html-react-parser'

import InlineConverter from './inlineConverter'
import {
  Admonition,
  Audio,
  CoList,
  DList,
  Document,
  Example,
  FloatingTitle,
  Image,
  Listing,
  Literal,
  OList,
  Open,
  PageBreak,
  Paragraph,
  Pass,
  Preamble,
  Quote,
  Section,
  Sidebar,
  Table,
  TableOfContents,
  ThematicBreak,
  UList,
  Verse,
} from './templates'

export const processor = Processor()

// needs its own name so it doesn't get mixed up with built-in highlight.js (I think)
processor.SyntaxHighlighter.register('highlight.js-server', {
  handlesHighlighting: () => true,
  highlight: (_node, source, lang) => {
    if (!lang) return source
    return hljs.getLanguage(lang)
      ? hljs.highlight(source, { language: lang }).value
      : source
  },
})

processor.ConverterFactory.register(new InlineConverter(), ['html5'])

const Asciidoc = ({ content }: { content: string }) => {
  const doc = processor.load(content, {
    standalone: true,
    attributes: {
      'source-highlighter': 'highlight.js-server',
      sectlinks: 'true',
      icons: 'font',
    },
  })

  return <Document document={doc} />
}

export const Content = ({ blocks }: { blocks: Asciidoctor.AbstractBlock[] }) => {
  return (
    <>
      {blocks.map((block: Asciidoctor.AbstractBlock, index: number) => (
        <Converter key={`${index}-${block.getNodeName()}`} node={block} />
      ))}
    </>
  )
}

const Converter = ({ node }: { node: Asciidoctor.AbstractBlock }) => {
  const transform = node.getNodeName()

  const document = node.getDocument()
  const blockAttributes = node.getAttributes()
  document.playbackAttributes(blockAttributes)

  switch (transform) {
    case 'audio':
      return <Audio node={node as Asciidoctor.Block} />
    case 'preamble':
      return <Preamble node={node} />
    case 'section':
      return <Section node={node as Asciidoctor.Section} />
    case 'paragraph':
      return <Paragraph node={node as Asciidoctor.Block} />
    case 'dlist':
      return <DList node={node as Asciidoctor.List} />
    case 'ulist':
      return <UList node={node as Asciidoctor.List} />
    case 'floating_title':
      return <FloatingTitle node={node as Asciidoctor.Block} />
    case 'admonition':
      return <Admonition node={node as Asciidoctor.Block} />
    case 'listing':
      return <Listing node={node as Asciidoctor.Block} />
    case 'literal':
      return <Literal node={node as Asciidoctor.Block} />
    case 'image':
      return <Image node={node as Asciidoctor.Block} />
    case 'colist':
      return <CoList node={node as Asciidoctor.List} />
    case 'olist':
      return <OList node={node as Asciidoctor.List} />
    case 'table':
      return <Table node={node as Asciidoctor.Table} />
    case 'thematic_break':
      return <ThematicBreak />
    case 'open':
      return <Open node={node as Asciidoctor.Block} />
    case 'pass':
      return <Pass node={node as Asciidoctor.Block} />
    case 'page_break':
      return <PageBreak />
    case 'example':
      return <Example node={node as Asciidoctor.Block} />
    case 'sidebar':
      return <Sidebar node={node as Asciidoctor.Block} />
    case 'quote':
      return <Quote node={node as Asciidoctor.Block} />
    case 'verse':
      return <Verse node={node as Asciidoctor.Block} />
    case 'toc':
      return <TableOfContents node={node as Asciidoctor.Block} />
    default:
      return <>{parse(node.getContent())}</>
  }
}

export default Asciidoc
