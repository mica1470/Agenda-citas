import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Appointment } from "@/types/appointment"
import { googleCalendarService } from "./google-calendar-service"

class AppointmentService {
  private collectionName = "appointments"

  async createAppointment(appointmentData: Omit<Appointment, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...appointmentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      // Try to create Google Calendar event
      try {
        await googleCalendarService.createEvent({
          summary: `Cita con ${appointmentData.name}`,
          description: `Email: ${appointmentData.email}\nTeléfono: ${appointmentData.phone}\nNotas: ${appointmentData.notes || "Sin notas"}`,
          start: {
            dateTime: `${appointmentData.date}T${appointmentData.time}:00`,
            timeZone: "Europe/Madrid",
          },
          end: {
            dateTime: `${appointmentData.date}T${this.addHour(appointmentData.time)}:00`,
            timeZone: "Europe/Madrid",
          },
          attendees: [{ email: appointmentData.email }],
        })
      } catch (calendarError) {
        console.warn("No se pudo crear el evento en Google Calendar:", calendarError)
      }

      return docRef.id
    } catch (error) {
      console.error("Error al crear cita:", error)
      throw new Error("No se pudo crear la cita")
    }
  }

  async updateAppointment(id: string, appointmentData: Omit<Appointment, "id" | "userId">): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await updateDoc(docRef, {
        ...appointmentData,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error("Error al actualizar cita:", error)
      throw new Error("No se pudo actualizar la cita")
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error("Error al eliminar cita:", error)
      throw new Error("No se pudo eliminar la cita")
    }
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    try {
      const q = query(collection(db, this.collectionName), where("userId", "==", userId), orderBy("date", "asc"))

      const querySnapshot = await getDocs(q)
      const appointments: Appointment[] = []

      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data(),
        } as Appointment)
      })

      return appointments
    } catch (error) {
      console.error("Error al obtener citas:", error)
      throw new Error("No se pudieron cargar las citas")
    }
  }

  private addHour(time: string): string {
    const [hours, minutes] = time.split(":").map(Number)
    const newHours = (hours + 1) % 24
    return `${newHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }
}

export const appointmentService = new AppointmentService()
