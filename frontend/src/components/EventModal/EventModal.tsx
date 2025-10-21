import React, { useState } from "react"
import "./EventModal.scss"

interface EventFormData {
  title: string
  description: string
  startingAt: string
  duration: string
  invitationsSendingAt: string
  registrationsClosingAt: string
}

const EventModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventFormData | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    startingAt: "",
    duration: "",
    invitationsSendingAt: "",
    registrationsClosingAt: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.title || !formData.description || !formData.startingAt) {
      setError("Titel, Beschreibung und Startdatum sind erforderlich")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:4000/api/dashboard/registerEvents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startingAt: formData.startingAt,
          duration: formData.duration,
          invitationsSendingAt: formData.invitationsSendingAt,
          registrationsClosingAt: formData.registrationsClosingAt,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Event erfolgreich erstellt!")
        setFormData({
          title: "",
          description: "",
          startingAt: "",
          duration: "",
          invitationsSendingAt: "",
          registrationsClosingAt: "",
        })
        setTimeout(() => {
          setIsOpen(false)
          setSuccess("")
        }, 1500)
      } else {
        setError(data.message || "Fehler beim Erstellen des Events")
      }
    } catch (err) {
      setError("Fehler beim Verbinden mit dem Server")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="modal-trigger" onClick={() => setIsOpen(true)}>
        Event erstellen
      </button>

      {isOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsOpen(false)} />
          <div className="modal">
            <div className="modal-header">
              <h2>Event erstellen</h2>
              <button className="modal-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Titel *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="z.B. Recruiting Event 2025"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Beschreibung *</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Beschreibe das Event..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startingAt">Startdatum & Zeit *</label>
                    <input
                      id="startingAt"
                      type="datetime-local"
                      name="startingAt"
                      value={formData.startingAt}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="duration">Dauer</label>
                    <input
                      id="duration"
                      type="time"
                      name="duration"
                      placeholder="z.B. 2 Stunden"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="invitationsSendingAt">Einladungen senden am</label>
                    <input
                      id="invitationsSendingAt"
                      type="date"
                      name="invitationsSendingAt"
                      value={formData.invitationsSendingAt}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="registrationsClosingAt">Anmeldeschluss</label>
                    <input
                      id="registrationsClosingAt"
                      type="date"
                      name="registrationsClosingAt"
                      value={formData.registrationsClosingAt}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)} disabled={loading}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Wird gespeichert..." : "Speichern"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}


export default EventModal;