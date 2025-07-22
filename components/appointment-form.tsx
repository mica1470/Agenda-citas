"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Appointment } from "@/types/appointment"
import { format } from "date-fns"
import { Calendar, Clock, User, Mail, Phone, FileText, X } from "lucide-react"

interface AppointmentFormProps {
  appointment?: Appointment | null
  onSave: (appointment: Omit<Appointment, "id" | "userId">) => void
  onCancel: () => void
}

export function AppointmentForm({ appointment, onSave, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (appointment) {
      setFormData({
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || "",
      })
    } else {
      // Set default date to today
      const today = new Date()
      setFormData((prev) => ({
        ...prev,
        date: format(today, "yyyy-MM-dd"),
      }))
    }
  }, [appointment])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    }

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = "La fecha no puede ser anterior a hoy"
      }
    }

    if (!formData.time) {
      newErrors.time = "La hora es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {appointment ? "Editar Cita" : "Nueva Cita"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Nombre completo
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ingresa el nombre completo"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="ejemplo@correo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Teléfono
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+34 123 456 789"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className={errors.time ? "border-red-500" : ""}
              />
              {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Notas (opcional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notas adicionales sobre la cita..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : appointment ? "Actualizar" : "Crear Cita"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
