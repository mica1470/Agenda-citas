"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { AppointmentCalendar } from "@/components/appointment-calendar"
import { AppointmentForm } from "@/components/appointment-form"
import { AppointmentList } from "@/components/appointment-list"
import { NotificationCenter } from "@/components/notification-center"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signOut } from "firebase/auth"
import { Calendar, List, Plus, LogOut } from "lucide-react"
import type { Appointment } from "@/types/appointment"
import { appointmentService } from "@/lib/appointment-service"
import { useToast } from "@/hooks/use-toast"

export function AppointmentManager() {
  const [user] = useAuthState(auth)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user])

  const loadAppointments = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userAppointments = await appointmentService.getAppointments(user.uid)
      setAppointments(userAppointments)
    } catch (error) {
      console.error("Error al cargar citas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAppointment = async (appointmentData: Omit<Appointment, "id" | "userId">) => {
    if (!user) return

    try {
      if (editingAppointment) {
        await appointmentService.updateAppointment(editingAppointment.id, appointmentData)
        toast({
          title: "Cita actualizada",
          description: "La cita se ha actualizado correctamente.",
        })
      } else {
        await appointmentService.createAppointment({
          ...appointmentData,
          userId: user.uid,
        })
        toast({
          title: "Cita creada",
          description: "La cita se ha creado correctamente.",
        })
      }

      await loadAppointments()
      setShowForm(false)
      setEditingAppointment(null)
    } catch (error) {
      console.error("Error al guardar cita:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la cita.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentService.deleteAppointment(appointmentId)
      await loadAppointments()
      toast({
        title: "Cita eliminada",
        description: "La cita se ha eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar cita:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita.",
        variant: "destructive",
      })
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setShowForm(true)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando citas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Gestor de Citas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter appointments={appointments} />
              <Button onClick={() => setShowForm(true)} size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendario
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  Lista
                </TabsTrigger>
              </TabsList>
              <TabsContent value="calendar" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendario de Citas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentCalendar
                      appointments={appointments}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                      onAppointmentClick={handleEditAppointment}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="list" className="mt-6">
                <AppointmentList
                  appointments={appointments}
                  onEdit={handleEditAppointment}
                  onDelete={handleDeleteAppointment}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            {showForm && (
              <AppointmentForm
                appointment={editingAppointment}
                onSave={handleSaveAppointment}
                onCancel={() => {
                  setShowForm(false)
                  setEditingAppointment(null)
                }}
              />
            )}

            <Button onClick={() => setShowForm(true)} className="w-full mb-6 sm:hidden">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
