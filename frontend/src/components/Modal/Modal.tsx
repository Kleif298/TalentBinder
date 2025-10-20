import "./Modal.scss"
import { useState } from "react"

type Candidate = {
  firstName?: string
  lastName?: string
  email?: string
  professionalInterest?: string
  status?: string
  interests?: string[]
}

export function ModalCandidates({ onSave }: { onSave?: (candidate: Candidate) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  // simple, minimal local form state for demonstration
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [professionalInterest, setProfessionalInterest] = useState("")
  const [status, setStatus] = useState("default")
  const [interests, setInterests] = useState<string[]>([])

  const toggleInterest = (value: string) => {
    setInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]))
  }

  const handleSave = () => {
    const candidate: Candidate = {
      firstName,
      lastName,
      email,
      professionalInterest,
      status,
      interests,
    }
    if (onSave) onSave(candidate)
    setIsOpen(false)
    // reset minimal fields for simplicity
    setFirstName("")
    setLastName("")
    setEmail("")
    setProfessionalInterest("")
    setStatus("default")
    setInterests([])
  }

  return (
    <>
      <button className="modal-trigger" onClick={() => setIsOpen(true)}>
        Kandidat erstellen
      </button>

      {isOpen && (
        <>
          <div className="modal-overlay" onClick={() => setIsOpen(false)} />
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>Kandidat erstellen</h2>
              <button className="modal-close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="form-group">
                  <label htmlFor="firstName">Vorname</label>
                  <input id="firstName" type="text" placeholder="Max" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Nachname</label>
                  <input id="lastName" type="text" placeholder="Mustermann" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email-Adresse</label>
                  <input id="email" type="email" placeholder="max@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Branchen-Interessen</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={interests.includes("detailhandel")} onChange={() => toggleInterest("detailhandel")} /> Detailhandel
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={interests.includes("it")} onChange={() => toggleInterest("it")} /> IT
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={interests.includes("mediamatik")} onChange={() => toggleInterest("mediamatik")} /> Mediamatik
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={interests.includes("kundendialog")} onChange={() => toggleInterest("kundendialog")} /> Kundendialog
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="professionalInterest">Berufs-Interesse</label>
                  <input id="professionalInterest" type="text" placeholder="z.B. Softwareentwicklung" value={professionalInterest} onChange={(e) => setProfessionalInterest(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="default">◯ Standard</option>
                    <option value="favorite">⭐ Favorit</option>
                    <option value="unpopular">✕ Unpopulär</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>
                Abbrechen
              </button>
              <button className="btn btn-primary" onClick={handleSave}>Speichern</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default ModalCandidates
