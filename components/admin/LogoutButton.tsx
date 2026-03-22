"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';

const LogoutButton = () => {

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/admin/logout", {
                method: "POST",
            })

            if (res.ok) {
                router.push("/admin")
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    )
}

export default LogoutButton