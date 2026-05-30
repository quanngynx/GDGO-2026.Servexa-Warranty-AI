import { createFileRoute } from '@tanstack/react-router'
import AgenticChat from '@/features/example/ai'
import { useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated/ai/example/')({
  component: () => {
    const { integrationId } = useParams({ from: '/_authenticated/ai/example/' })
    useEffect(() => {
      console.log('integrationId', integrationId)
    }, [integrationId])
    return <AgenticChat params={Promise.resolve({ integrationId })} />
  },
})
