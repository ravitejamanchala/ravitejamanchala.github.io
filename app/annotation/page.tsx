'use client'
import AnnotationTool from '@/components/annotations/annotation'
import annotationData from '@/data/test_annotations'
interface Label {
  id: string
  labelName: string
  color: string
}

interface Annotation {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
  id: string
  labelId: string
}

interface ImageData {
  id: string
  image: string
  annotations: Annotation[]
}

interface Dataset {
  images: ImageData[]
  labels: Label[]
}
export default function page() {
  const dataset: Dataset = {
    images: [
      {
        id: 'sdasdf',
        image:
          'https://images.unsplash.com/photo-1655361237139-796114b2845c?q=80&w=3314&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        //   annotations: [
        //     {
        //       xmin: 50,
        //       ymin: 100,
        //       xmax: 200,
        //       ymax: 300,
        //       id: "annotation1",
        //       labelId: "label1",
        //     },
        //     {
        //       xmin: 220,
        //       ymin: 150,
        //       xmax: 400,
        //       ymax: 350,
        //       id: "annotation2",
        //       labelId: "label2",
        //     },
        //   ],
        annotations: annotationData,
      },
    ],
    labels: [
      { id: 'label1', labelName: 'Person', color: '#FF0000' },
      { id: 'label2', labelName: 'Car', color: '#0000FF' },
    ],
  }

  return <AnnotationTool dataset={dataset} />
}
