import Loading from '@/components/ui/loading'
import { BlogAPI } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
    component: BlogPage,
})

export default function BlogPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['blog'],
        queryFn: BlogAPI,
    })

    if (isLoading) {
        return (
            <Loading />
        )
    }

    if (isError) return <p>Error fetching data</p>

    return (
        <div className="p-4">
            <strong>data from API</strong>
            <h1 className="text-xl font-bold">{data?.message}</h1>
        </div>
    )
}
