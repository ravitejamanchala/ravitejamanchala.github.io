import Link from '@/components/Link'
import ProjectArtwork from '@/components/ProjectArtwork'
import { work } from '@/data/portfolio'
import { genPageMetadata } from 'app/seo'
export const metadata = genPageMetadata({
  title: 'Selected software engineering projects',
  description:
    'AI annotation, healthcare software and Cambridge Learner Drive — selected projects by Raviteja Manchala.',
})
export default function Projects() {
  return (
    <div className="folio-section projects-page">
      <span className="eyebrow">IDEAS INTO EXPERIENCES</span>
      <h1>
        Selected <em>work.</em>
      </h1>
      <p className="page-intro">
        A closer look at the systems, products and experiments I’ve helped build.
      </p>
      {work.map((p) => (
        <article className="project-detail" id={p.id} key={p.id}>
          <ProjectArtwork kind={p.kind} />
          <div>
            <span className="eyebrow">{p.category}</span>
            <h2>{p.name}</h2>
            <p>{p.detail}</p>
            {p.href && (
              <Link className="underlined-link" href={p.href}>
                {p.action} ↗
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
