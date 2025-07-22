"use client"

import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { LoginForm } from "@/components/login-form"
import { AppointmentManager } from "@/components/appointment-manager"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [user, loading] = useAuthState(auth)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <AppointmentManager />
}
