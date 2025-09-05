export async function BlogAPI(): Promise<{ message: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ message: 'Hello from blog API 🚀' })
        }, 1000)
    })
}
