import { useNavigate } from '@tanstack/react-router'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { loginSchema } from '@/lib/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/stores/auth'

export const Route = createFileRoute('/_auth/login')({
    component: LoginPage,
})


function LoginPage() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const auth = useAuth()
    const form = useForm<z.infer<typeof loginSchema>>({
        mode: 'all',
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })

    const loginMutation = useMutation({
        mutationFn: async (data: z.infer<typeof loginSchema>) => {
            const user = await auth.login(data.username, data.password)
            if (!user) {
                toast.error('Error njay')
                throw new Error('Error')
            }
            return user
        },
        onSuccess: () => {
            toast.success('Login berhasil')
            queryClient.invalidateQueries({ queryKey: ['user'] })
            navigate({ to: '/management' })
        },
        onError: (error: any) => {
            console.error(error)
            toast.error(error?.message || 'Terjadi kesalahan saat login')
        },
    })

    const submit = (data: z.infer<typeof loginSchema>) => {
        loginMutation.mutate(data)
    }

    return (
        <Form {...form}>
            <Card className='mx-auto max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <div className='grid gap-4'>
                            <div className='grid gap-2'>
                                <FormField
                                    name='username'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input type='text' placeholder='Masukkan username' {...field} />
                                            </FormControl>
                                            <FormMessage className='font-normal' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='grid gap-2'>
                                <FormField
                                    name='password'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder='Masukkan password' {...field} />
                                            </FormControl>
                                            <FormMessage className='font-normal' />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full gap-2.5"
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending && <Spinner />}
                                <span>Login</span>
                            </Button>
                        </div>
                        <div className='mt-4 text-center text-sm'>
                            Don&apos;t have an account?{' '}
                            <Link to='/management' className='underline'>
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Form>
    )
}
