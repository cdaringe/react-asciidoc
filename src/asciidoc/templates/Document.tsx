import type { Asciidoctor } from 'asciidoctor'
import parse from 'html-react-parser'
import { Fragment } from 'react'

import { Content } from '../'
import Outline from './Outline'

const Document = ({ document }: { document: Asciidoctor.Document }) => {
  const blocks = document.getBlocks()

  const Header = () => {
    if (!document.getNoheader()) {
      return (
        <div id="header">
          {document.hasHeader() && (
            <>
              <h1
                dangerouslySetInnerHTML={{
                  __html: document.getDocumentTitle()?.toString() || '',
                }}
              />

              <Details />

              {document.hasSections() &&
                document.hasAttribute('toc') &&
                document.getAttribute('toc-placement') === 'auto' && (
                  <div id="toc" className={document.getAttribute('toc-class', 'toc')}>
                    <div id="toctitle">{document.getAttribute('toc-title')}</div>
                    <Outline node={document as Asciidoctor.AbstractBlock} />
                  </div>
                )}
            </>
          )}
        </div>
      )
    } else {
      return null
    }
  }

  const Details = () => {
    const authors = document.getAuthors()
    if (
      authors.length > 0 ||
      document.hasAttribute('revnumber') ||
      document.hasAttribute('revdate') ||
      document.hasAttribute('revremark')
    ) {
      return (
        <div className="details">
          {document.getAuthors().map((author, index) => (
            <Fragment key={index}>
              <span id={`author${index + 1 > 1 ? index + 1 : ''}`} className="author">
                {parse(document.applySubstitutions(author.getName() || ''))}
              </span>
              <br />
              <span id={`email${index + 1 > 1 ? index + 1 : ''}`} className="email">
                {parse(document.applySubstitutions(author.getEmail() || ''))}
              </span>
              <br />
            </Fragment>
          ))}

          {document.hasAttribute('revnumber') && (
            <span id="revnumber">{`${document
              .getAttribute('version-label')
              .toLowerCase()} ${document.getAttribute('revnumber')} ${
              document.hasAttribute('revdate') ? ',' : ''
            }`}</span>
          )}

          {document.hasAttribute('revdate') && (
            <span id="revdate">{document.getAttribute('revdate')}</span>
          )}

          {document.hasAttribute('revremark') && (
            <>
              <br />
              <span id="revremark">{document.getAttribute('revremark')}</span>
            </>
          )}
        </div>
      )
    } else {
      return null
    }
  }

  const Footnotes = () => {
    if (document.hasFootnotes() && !document.hasAttribute('nofootnotes')) {
      return (
        <div id="footnotes">
          <hr />

          {document.getFootnotes().map((footnote) => (
            <div
              className="footnote"
              id={`_footnotedef_${footnote.getIndex()}`}
              key={footnote.getIndex()}
            >
              <a href={`#_footnoteref_${footnote.getIndex()}`}>{footnote.getIndex()}</a>.{' '}
              {footnote.getText()}
            </div>
          ))}
        </div>
      )
    } else {
      return null
    }
  }

  return (
    <>
      <Header />
      <div id="content">
        <Content blocks={blocks} />
      </div>
      <Footnotes />
    </>
  )
}

export default Document