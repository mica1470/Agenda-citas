export interface Appointment {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  date: string // YYYY-MM-DD format
  time: string // HH:MM format
  notes?: string
  googleCalendarEventId?: string
  createdAt?: any
  updatedAt?: any
}
