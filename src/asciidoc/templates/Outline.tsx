import type { Asciidoctor } from 'asciidoctor'
import parse from 'html-react-parser'

const Outline = ({ node }: { node: Asciidoctor.AbstractBlock }) => {
  if (!node.hasSections()) return null

  const document = node.getDocument()
  const docAttrs = document.getAttributes()

  const sectNumLevels = docAttrs['sectnumlevels'] ? parseInt(docAttrs['sectnumlevels']) : 3
  const tocLevels = docAttrs['toclevels'] ? parseInt(docAttrs['toclevels']) : 2
  const sections = node.getSections()

  // @ts-ignore
  // Swap with getSectionNumeral() when it is released
  let sectNum = node.getNodeName() === 'document' ? '' : node.$sectnum()
  sectNum = sectNum === '.' ? '' : sectNum

  return (
    <ul className={`sectlevel${sections[0].getLevel()}`}>
      {sections.map((section) => {
        const level = section.getLevel()
        let title = ''
        if (section.getCaption()) {
          title = section.getCaptionedTitle()
        } else if (section.isNumbered() && level < sectNumLevels) {
          // todo: investigate sectnumlevels overrides not working
          if (level < 2 && document.getDoctype() == 'book') {
            const sectionName = section.getSectionName()
            if (sectionName === 'chapter') {
              const signifier = docAttrs['chapter-signifier']
              title = `${signifier || ''} ${sectNum} ${section.getTitle()}`
            } else if (sectionName === 'part') {
              const signifier = docAttrs['part-signifier']
              title = `${signifier || ''} ${sectNum} ${section.getTitle()}`
            } else {
              title = `${sectNum} ${section.getTitle()}`
            }
          } else {
            title = `${sectNum} ${section.getTitle()}`
          }
        } else {
          title = section.getTitle() || ''
        }

        return (
          <li key={section.getId()}>
            <a href={`#${section.getId()}`}>{parse(title)}</a>
            {level < tocLevels && <Outline node={section as Asciidoctor.AbstractBlock} />}
          </li>
        )
      })}
    </ul>
  )
}

export default Outline