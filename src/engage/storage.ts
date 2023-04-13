import { BackstageError, getBackstageResult } from "@/api/backstage/adapter.js"
import { deleteEngagementPlans } from "./engagementPlans/deleteEngagementPlans.js";
import { error, meta, ok, pending, Provider, useProvider, useWriter } from "loop";
import { engagementLevels, engagementPlan, setEngagementLevels } from "./engagementPlans/index.js";
import { writeEngagementPlan } from "./engagementPlans/saveEngagementPlan.js";
import { Session, session } from "./session.js";
import { Model } from "./model.js";
import { createNoteMessage } from "./engagementNotes/saveNote.js";
import { Result } from "../util/result.js";
import { addNote, EngagementNote, engagementNotes, setNotes } from "./engagementNotes/index.js";
import { deleteNoteMessage } from "./engagementNotes/deleteNote.js";
import { learningArea } from "./learningArea.js";

export function init(model: Model) {
  const provider: Provider = {
    provide: (_, set) => {
      console.log("***** GOT MODEL", model)
      set(meta(learningArea), ok(model.learningArea))

      if (model.type === "personalized") {
        console.log("SETTING STUFF")
        set(meta(engagementLevels), ok(setEngagementLevels(model.engagementLevels)))
        set(meta(engagementNotes), ok(setNotes(model.engagementNotes)))
        set(meta(session), ok<Session>({
          type: "personalized-session",
          user: model.user,
        }))
      }
    }
  }

  useProvider(provider)
}

// Writers

console.log("Hello writers!")

useWriter(engagementLevels, {
  write: async (message, get, set) => {
    console.log("Writing engagement levels", message)
    const area = get(learningArea)
    set(pending(message))
    switch (message.type) {
      case "add-plan":
        const result = await getBackstageResult(writeEngagementPlan(engagementPlan(area, message.level)))
        result.when({
          ok: () => {
            set(ok(message))
          },
          error: () => {
            set(error(message))
          }
        })
        break
      case "clear-levels":
        const deleteResult = await getBackstageResult(deleteEngagementPlans(area))
        deleteResult.when({
          ok: () => {
            set(ok(message))
          },
          error: () => {
            set(error(message))
          }
        })
        break
    }
  }
})

useWriter(engagementNotes, {
  write: async (message, get, set) => {
    console.log("Writing engagement notes", message)
    const area = get(learningArea)
    set(pending(message))
    switch (message.type) {
      case "create-note":
        const result: Result<EngagementNote, BackstageError> = await getBackstageResult(createNoteMessage(area, message.content))
        result.when({
          ok: (note) => {
            set(ok(addNote(note)))
          },
          error: () => {
            set(error(message))
          }
        })
        break
      case "delete-note":
        const deleteResult = await getBackstageResult(deleteNoteMessage(message.note))
        deleteResult.when({
          ok: () => {
            set(ok(message))
          },
          error: () => {
            set(error(message))
          }
        })
        break
    }
  }
})