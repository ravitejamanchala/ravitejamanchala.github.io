interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'Deep Learning platform for Edge Applications',
    description: `The DeepEdge platform is an integrated deep learning development platform that enables developers and enterprises to build, train, optimize and deploy deep learning models and applications to a variety of edge hardware`,
    imgSrc: 'https://deepedge.ai/assets/img/platform/DeepLabel_PerformAnnotation.png',
    href: 'https://deepedge.ai/',
  },
  {
    title: 'Certa care management software - CACI',
    description: `Certa is a complete care management software solution designed for care providers. It supports the planning, delivery and management of outstanding care`,
    imgSrc: 'https://www.caci.co.uk/wp-content/uploads/2024/08/Certa-Wheel-300x300.png.webp',
    href: 'https://www.caci.co.uk/software/certa/',
  },
]

export default projectsData
