"use client"

import { useState } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Chrome } from "lucide-react"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope("https://www.googleapis.com/auth/calendar")
      await signInWithPopup(auth, provider)
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      })
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Gestor de Citas</CardTitle>
          <CardDescription>Inicia sesión para gestionar tus citas y sincronizar con Google Calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signInWithGoogle} disabled={loading} className="w-full" size="lg">
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? "Iniciando sesión..." : "Iniciar sesión con Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
