'use client'
import AnnotationTool from '@/components/annotations/annotation'
import annotationData from '@/data/test_annotations'

export default function page() {
  const dataset = {
    images: [
      {
        id: 'image1',
        image:
          'https://images.unsplash.com/photo-1655361237139-796114b2845c?q=80&w=1500&auto=format&fit=crop',
        annotations: [],
      },
      {
        id: 'image2',
        image:
          'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=1500&auto=format&fit=crop',
        annotations: [],
      },
      {
        id: 'image3',
        image:
          'https://images.unsplash.com/photo-1559303021-b258e1f3f115?q=80&w=1500&auto=format&fit=crop',
        annotations: [],
      },
      {
        id: 'image4',
        image:
          'https://images.unsplash.com/photo-1608934863491-ee1e2ed5e0ee?q=80&w=1500&auto=format&fit=crop',
        annotations: [],
      },
    ],
    labels: [
      { id: 'label1', labelName: 'Person', color: '#FF0000' },
      { id: 'label2', labelName: 'Car', color: '#0000FF' },
      { id: 'label3', labelName: 'Building', color: '#00FF00' },
      { id: 'label4', labelName: 'Animal', color: '#FFA500' },
    ],
  }

  return <AnnotationTool dataset={dataset} />
}
