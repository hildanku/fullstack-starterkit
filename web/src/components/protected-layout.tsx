import { Outlet } from "@tanstack/react-router"

export function ProtectedLayout() {
    return (
        <div className='min-h-screen w-full flex'>
            <div className='m-auto w-3/4'>
                <Outlet />
            </div>
        </div>
    )
}