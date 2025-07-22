"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/types/appointment"
import { format, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, Phone, Mail } from "lucide-react"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateSelect,
  onAppointmentClick,
}: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate)

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      onDateSelect(newDate)
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => isSameDay(parseISO(appointment.date), date))
  }

  const selectedDateAppointments = date ? getAppointmentsForDate(date) : []

  const modifiers = {
    hasAppointments: appointments.map((apt) => parseISO(apt.date)),
  }

  const modifiersStyles = {
    hasAppointments: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      fontWeight: "bold",
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={es}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {date ? format(date, "d 'de' MMMM, yyyy", { locale: es }) : "Selecciona una fecha"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hay citas programadas para esta fecha</p>
            ) : (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onAppointmentClick(appointment)}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{appointment.name}</h4>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.time}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        {appointment.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
