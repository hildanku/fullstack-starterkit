import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
    component: About,
})

function About() {
    return (
        <>
            <div className="flex min-h-svh flex-col items-center justify-center">
                <Button>Click me</Button>
            </div>
        </>
    )
}
