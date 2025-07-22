"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Appointment } from "@/types/appointment"
import { Bell, Clock, Calendar } from "lucide-react"
import { format, parseISO, isToday, isTomorrow, addHours, isBefore, isAfter } from "date-fns"
import { es } from "date-fns/locale"

interface NotificationCenterProps {
  appointments: Appointment[]
}

interface Notification {
  id: string
  type: "reminder" | "upcoming"
  title: string
  message: string
  appointment: Appointment
  time: Date
}

export function NotificationCenter({ appointments }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    generateNotifications()
  }, [appointments])

  const generateNotifications = () => {
    const now = new Date()
    const newNotifications: Notification[] = []

    appointments.forEach((appointment) => {
      const appointmentDateTime = parseISO(`${appointment.date}T${appointment.time}`)

      // Notification for appointments today
      if (isToday(appointmentDateTime) && isAfter(appointmentDateTime, now)) {
        newNotifications.push({
          id: `today-${appointment.id}`,
          type: "reminder",
          title: "Cita hoy",
          message: `Tienes una cita con ${appointment.name} a las ${appointment.time}`,
          appointment,
          time: appointmentDateTime,
        })
      }

      // Notification for appointments tomorrow
      if (isTomorrow(appointmentDateTime)) {
        newNotifications.push({
          id: `tomorrow-${appointment.id}`,
          type: "upcoming",
          title: "Cita mañana",
          message: `Tienes una cita con ${appointment.name} mañana a las ${appointment.time}`,
          appointment,
          time: appointmentDateTime,
        })
      }

      // Notification for appointments in 1 hour
      const oneHourBefore = addHours(appointmentDateTime, -1)
      if (isAfter(now, oneHourBefore) && isBefore(now, appointmentDateTime)) {
        newNotifications.push({
          id: `hour-${appointment.id}`,
          type: "reminder",
          title: "Cita en 1 hora",
          message: `Tu cita con ${appointment.name} es en aproximadamente 1 hora`,
          appointment,
          time: appointmentDateTime,
        })
      }
    })

    // Sort by appointment time
    newNotifications.sort((a, b) => a.time.getTime() - b.time.getTime())

    setNotifications(newNotifications)
    setUnreadCount(newNotifications.length)
  }

  const clearNotifications = () => {
    setUnreadCount(0)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notificaciones</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs">
                Marcar como leídas
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-6">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No hay notificaciones nuevas</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === "reminder" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {notification.type === "reminder" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(notification.time, "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
