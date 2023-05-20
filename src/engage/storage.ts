import { BackstageError, getBackstageResult } from "@/api/backstage/adapter.js"
import { deleteEngagementPlans } from "./engagementPlans/deleteEngagementPlans.js";
import { Provider, Store } from "state-party";
import { engagementLevels, engagementPlan, setEngagementLevels } from "./engagementPlans/index.js";
import { writeEngagementPlan } from "./engagementPlans/saveEngagementPlan.js";
import { session } from "./session.js";
import { Model } from "./model.js";
import { createNoteMessage } from "./engagementNotes/saveNote.js";
import { Result } from "../util/result.js";
import { addNote, EngagementNote, engagementNotes, setNotes } from "./engagementNotes/index.js";
import { deleteNoteMessage } from "./engagementNotes/deleteNote.js";
import { learningArea } from "./learningArea.js";

export function init(store: Store, model: Model) {
  const provider: Provider = {
    provide: ({ set }) => {
      set(learningArea, model.learningArea)

      switch (model.type) {
        case "personalized":
          set(engagementLevels, setEngagementLevels(model.engagementLevels))
          set(engagementNotes, setNotes(model.engagementNotes))
          set(session, {
            type: "personalized-session",
            user: model.user,
          })
          break
        case "informative":
          set(session, {
            type: "public-session"
          })
          break
      }
    }
  }

  store.useProvider(provider)


  // Writers

  store.useWriter(engagementLevels, {
    write: async (message, { get, pending, ok, error }) => {
      const area = get(learningArea)
      pending(message)
      switch (message.type) {
        case "add-plan":
          const result = await getBackstageResult(writeEngagementPlan(engagementPlan(area, message.level)))
          result.when({
            ok: () => {
              ok(message)
            },
            error: () => {
              error(message)
            }
          })
          break
        case "clear-levels":
          const deleteResult = await getBackstageResult(deleteEngagementPlans(area))
          deleteResult.when({
            ok: () => {
              ok(message)
            },
            error: () => {
              error(message)
            }
          })
          break
      }
    }
  })

  store.useWriter(engagementNotes, {
    write: async (message, { get, pending, ok, error }) => {
      const area = get(learningArea)
      pending(message)
      switch (message.type) {
        case "create-note":
          const result: Result<EngagementNote, BackstageError> = await getBackstageResult(createNoteMessage(area, message.content))
          result.when({
            ok: (note) => {
              ok(addNote(note))
            },
            error: () => {
              error(message)
            }
          })
          break
        case "delete-note":
          const deleteResult = await getBackstageResult(deleteNoteMessage(message.note))
          deleteResult.when({
            ok: () => {
              ok(message)
            },
            error: () => {
              error(message)
            }
          })
          break
      }
    }
  })
}