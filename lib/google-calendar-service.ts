import { auth } from "./firebase"

interface CalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{ email: string }>
}

class GoogleCalendarService {
  private async getAccessToken(): Promise<string | null> {
    const user = auth.currentUser
    if (!user) return null

    try {
      // Get the access token from Firebase Auth
      const token = await user.getIdToken()
      return token
    } catch (error) {
      console.error("Error getting access token:", error)
      return null
    }
  }

  async createEvent(event: CalendarEvent): Promise<any> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating calendar event:", error)
      throw error
    }
  }

  async updateEvent(eventId: string, event: CalendarEvent): Promise<any> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating calendar event:", error)
      throw error
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    const accessToken = await this.getAccessToken()
    if (!accessToken) {
      throw new Error("No access token available")
    }

    try {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error deleting calendar event:", error)
      throw error
    }
  }
}

export const googleCalendarService = new GoogleCalendarService()
