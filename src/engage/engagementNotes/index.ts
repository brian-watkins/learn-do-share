import { container, withReducer } from "state-party"

export interface EngagementNote {
  id: string
  content: string,
  date: string
}

export interface EngagementNoteContents {
  content: string
  date: string
}

interface SetNotes {
  type: "set-notes"
  notes: Array<EngagementNote>
}

export function setNotes(notes: Array<EngagementNote>): SetNotes {
  return {
    type: "set-notes",
    notes
  }
}

interface AddNote {
  type: "add-note"
  note: EngagementNote
}

export function addNote(note: EngagementNote): AddNote {
  return {
    type: "add-note",
    note
  }
}

interface CreateNote {
  type: "create-note"
  content: string
}

export function createNote(content: string): CreateNote {
  return {
    type: "create-note",
    content
  }
}

interface DeleteNote {
  type: "delete-note"
  note: EngagementNote
}

export function deleteNote(note: EngagementNote): DeleteNote {
  return {
    type: "delete-note",
    note
  }
}

type NotesMessage = SetNotes | AddNote | CreateNote | DeleteNote

export const engagementNotes = container<Array<EngagementNote>, NotesMessage>(withReducer([], (message, current: Array<EngagementNote>) => {
  switch (message.type) {
    case "set-notes":
      return message.notes
    case "add-note":
      return [ message.note, ...current ]
    case "create-note":
      const note = {
        id: `note-${current.length}`,
        content: message.content,
        date: new Date().toISOString()
      }
      return [ note, ...current ]
    case "delete-note":
      return current.filter(note => note.id !== message.note.id)
  }
}))
