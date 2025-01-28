import Link from '@/components/Link'
import Tag from '@/components/Tag'
import SplitLayout from '@/components/split-container/SplitLayout'
import siteMetadata from '@/data/siteMetadata'
import projectsData from '@/data/projectsData'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Image from 'next/image'
import Card from '@/components/Card'

const MAX_DISPLAY = 3

export default function Home({ posts }) {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Split Layout */}
        <SplitLayout />

        {/* Latest Posts Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <div className="mt-4 space-y-2 pb-8 pt-6 md:space-y-5">
            <h1 className="font-pixelify text-7xl font-extrabold uppercase leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Latest Blogs
            </h1>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {!posts.length && 'No posts found.'}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <li key={slug} className="my-3 w-full">
                  <article className="h-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-5">
                      <h2 className="mb-3 line-clamp-2 overflow-hidden text-ellipsis text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`/blog/${slug}`}
                          title={title}
                          className="text-gray-900 hover:underline dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h2>
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="mb-3 flex flex-wrap">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                      <p className="prose line-clamp-2 max-w-none overflow-hidden text-ellipsis text-gray-500 dark:text-gray-400">
                        {summary}
                      </p>
                      <div className="mt-4 text-base font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          title={`Read more about: ${title}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read more: "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-end text-base font-medium leading-6">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="All posts"
              >
                All Posts &rarr;
              </Link>
            </div>
          )}

          {/* Projects Section */}
          <div className="">
            <div className="space-y-2 pb-8 pt-6 md:space-y-5">
              <h1 className="font-pixelify text-7xl font-extrabold uppercase leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                Projects
              </h1>
            </div>
            <div className="container py-12">
              <div className="-m-4 flex flex-wrap">
                {projectsData.map((project) => (
                  <Card
                    key={project.title}
                    title={project.title}
                    description={project.description}
                    imgSrc={project.imgSrc}
                    href={project.href}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Newsletter Form */}
          {siteMetadata.newsletter?.provider && (
            <div className="flex items-center justify-center pt-4">
              <NewsletterForm />
            </div>
          )}
        </section>
      </div>
    </>
  )
}
