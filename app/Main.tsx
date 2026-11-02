import IdentityHero from '@/components/IdentityHero'
import Link from '@/components/Link'
import ProjectArtwork from '@/components/ProjectArtwork'
import { work } from '@/data/portfolio'
const roles = [
  [
    '2025 — 2026',
    'Akixi',
    'Senior Developer',
    'Technical leadership across customer experience analytics and connected products.',
  ],
  [
    '2025 — NOW',
    'VisionGrid',
    'Founder & CTO',
    'AI-powered annotation tools, from the first interaction to cloud infrastructure.',
  ],
  [
    '2025',
    'Quinnox',
    'Lead Consultant',
    'Clinical workflows, enterprise integration and engineering standards.',
  ],
  [
    '2023 — 2025',
    'CACI',
    'Senior UI Developer',
    'Reusable product foundations for enterprise teams, BMW and care technology.',
  ],
  [
    '2021 — 2023',
    'DeepEdge',
    'Frontend Lead',
    'Canvas-based tools that help researchers make sense of visual data.',
  ],
]
export default function Home({ posts }) {
  return (
    <div className="folio-home">
      <IdentityHero />
      <div className="company-strip">
        <span>EXPERIENCE ACROSS</span>
        <strong>Akixi</strong>
        <strong>Quinnox</strong>
        <strong>CACI</strong>
        <strong>DeepEdge</strong>
        <strong>Phenom</strong>
      </div>
      <section id="work" className="folio-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">01 / SELECTED WORK</span>
            <h2>
              A few things
              <br />
              I’ve <em>put into the world.</em>
            </h2>
          </div>
          <p>
            A few things I’ve helped bring to life.
            <br />
            Built for people. Engineered to last.
          </p>
        </div>
        <div className="work-grid">
          {work.map((project) => (
            <article key={project.id} className="work-card">
              <Link href={`/projects#${project.id}`}>
                <ProjectArtwork kind={project.kind} />
                <div className="work-caption">
                  <div>
                    <span className="eyebrow">{project.category}</span>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                  <span className="work-arrow">↗</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <p className="art-note">
          Custom illustrations inspired by the work; not product screenshots.
        </p>
        <Link href="/projects" className="underlined-link">
          Explore the projects ↗
        </Link>
      </section>
      <section id="about" className="about-section">
        <div>
          <span className="eyebrow">02 / THE PERSON BEHIND THE CODE</span>
          <h2>
            Curiosity is the engine.
            <br />
            Craft is the <em>difference.</em>
          </h2>
          <div className="about-art" aria-hidden="true">
            rm<span>✳</span>
          </div>
        </div>
        <div className="about-copy">
          <h3>
            I care about how things work.
            <br />
            And how they make people feel.
          </h3>
          <p>
            Over the last decade, I’ve moved from designing interfaces to shaping the systems behind
            them. Today, I work across frontend development, full-stack engineering, architecture
            and applied AI.
          </p>
          <p>
            I’ve led teams, built reusable foundations and started a venture of my own. The thread
            through it all? Making complicated things feel simple.
          </p>
          <div className="about-stats">
            <div>
              <strong>10+</strong>
              <span>Years of experience</span>
            </div>
            <div>
              <strong>Design → Code</strong>
              <span>End-to-end perspective</span>
            </div>
          </div>
          <a
            href="/cv/Raviteja_Manchala_Staff_Engineer_CV.pdf"
            className="underlined-link"
            target="_blank"
            rel="noreferrer"
          >
            Read my CV ↗
          </a>
          <details className="cv-options">
            <summary>CVs for other roles</summary>
            {['Frontend', 'Founding', 'Software'].map((role) => (
              <a
                key={role}
                href={`/cv/Raviteja_Manchala_${role}_Engineer_CV.pdf`}
                target="_blank"
                rel="noreferrer"
              >
                {role} Engineer ↗
              </a>
            ))}
          </details>
        </div>
      </section>
      <section className="folio-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">03 / THE JOURNEY</span>
            <h2>
              The story <em>so far.</em>
            </h2>
          </div>
          <Link className="underlined-link" href="/about">
            More about me ↗
          </Link>
        </div>
        <div className="experience-list">
          {roles.map(([date, company, role, description]) => (
            <div className="experience-row" key={company}>
              <span className="eyebrow">{date}</span>
              <h3>{company}</h3>
              <div>
                <h4>{role}</h4>
                <p>{description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>
      <section className="folio-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">04 / NOTES FROM THE WORKBENCH</span>
            <h2>
              Open tabs.
              <br />
              <em>Open thoughts.</em>
            </h2>
          </div>
          <Link href="/blog" className="underlined-link">
            All writing ↗
          </Link>
        </div>
        <div className="writing-grid">
          {posts.slice(0, 3).map((post, i) => (
            <Link href={`/blog/${post.slug}`} className="writing-card" key={post.slug}>
              <div className="writing-meta">
                <span>{post.tags?.[0] || 'ENGINEERING'}</span>
                <span>0{i + 1} ↗</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </Link>
          ))}
        </div>
      </section>
      <section className="services-section">
        <span className="eyebrow">LONDON · CAMBRIDGE · REMOTE</span>
        <h2>
          Thoughtful engineering,
          <br />
          <em>wherever you’re building.</em>
        </h2>
        <p>
          Looking for a freelance software developer in London or Cambridge? Let’s talk about
          frontend development, full-stack web applications, React and Next.js, product architecture
          or bringing an AI-powered idea to life.
        </p>
      </section>
      <section className="contact-section">
        <span className="eyebrow">HAVE SOMETHING IN MIND?</span>
        <h2>
          Let’s build
          <br />
          something <em>great.</em>
          <span aria-hidden="true">↗</span>
        </h2>
        <div>
          <a href="mailto:raviteja0024@gmail.com">raviteja0024@gmail.com ↗</a>
          <p>Based in the UK. Open to meaningful conversations.</p>
        </div>
      </section>
    </div>
  )
}
