"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { Appointment } from "@/types/appointment"
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, User, Mail, Phone, Edit, Trash2, Search, Filter } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentListProps {
  appointments: Appointment[]
  onEdit: (appointment: Appointment) => void
  onDelete: (appointmentId: string) => void
}

export function AppointmentList({ appointments, onEdit, onDelete }: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filterAppointments = (appointments: Appointment[]) => {
    let filtered = appointments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.phone.includes(searchTerm),
      )
    }

    // Filter by time period
    const now = new Date()
    const tomorrow = addDays(now, 1)
    const nextWeek = addDays(now, 7)

    switch (filterType) {
      case "today":
        filtered = filtered.filter((apt) => {
          const aptDate = parseISO(apt.date)
          return format(aptDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
        })
        break
      case "upcoming":
        filtered = filtered.filter((apt) => {
          const aptDate = parseISO(apt.date)
          return isAfter(aptDate, now) && isBefore(aptDate, nextWeek)
        })
        break
      case "past":
        filtered = filtered.filter((apt) => {
          const aptDate = parseISO(apt.date)
          return isBefore(aptDate, now)
        })
        break
    }

    return filtered.sort((a, b) => {
      const dateA = parseISO(a.date)
      const dateB = parseISO(b.date)
      return dateA.getTime() - dateB.getTime()
    })
  }

  const filteredAppointments = filterAppointments(appointments)

  const getAppointmentStatus = (appointment: Appointment) => {
    const appointmentDateTime = parseISO(`${appointment.date}T${appointment.time}`)
    const now = new Date()

    if (isBefore(appointmentDateTime, now)) {
      return { status: "past", label: "Pasada", variant: "secondary" as const }
    } else if (format(appointmentDateTime, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
      return { status: "today", label: "Hoy", variant: "default" as const }
    } else {
      return { status: "upcoming", label: "Próxima", variant: "outline" as const }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Lista de Citas ({filteredAppointments.length})
        </CardTitle>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las citas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="upcoming">Próximas</SelectItem>
              <SelectItem value="past">Pasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || filterType !== "all"
                ? "No se encontraron citas con los filtros aplicados"
                : "No hay citas programadas"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const { status, label, variant } = getAppointmentStatus(appointment)

              return (
                <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{appointment.name}</h3>
                        <Badge variant={variant} className="mt-1">
                          {label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar cita?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente la cita de{" "}
                              {appointment.name}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(appointment.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {appointment.email}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {appointment.phone}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(parseISO(appointment.date), "d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
