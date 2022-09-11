import { getBackstageResult } from "@/api/backstage/adapter"
import { EngagementNote, engagementNoteSaving, engagementNotesRetrieved } from "./engagementNotes/index"


// This is similar to what we did with elm-procedure but
// in this case ultimately what we want to do is not generate a
// new message but update the state (which will trigger an
// update to the view)

subscribe("engagementNoteCreationRequested")
  .update((_, state) => state.engagementNotes = engagementNoteSaving(state.engagementNotes.notes))
  .andDo(message => get(backstageResult(message))
    .update((result, state) => result.resolve({
      ok: value => state.engagementNotes = engagementNotesRetrieved([value, ...state.engagementNotes.notes]),
      error: err => {
        state.engagementNotes = engagementNotesRetrieved(state.engagementNotes.notes)
        state.type = "error"
      }
    }))
  )

function backstage(adapters: Adapters) {
  return when("engagementNoteCreationRequested")
    .handle((user, message) => {
      const note = await adapters.engagementNoteWriter.write(user, message.learningAreaId, message.contents)
      return displayableNote(note)
    })
}

// 1. subscribe to engagementNoteCreationRequest
// 2. When get that, the reducer will run the update function with the message and the state
// 3. When get that, the middleware will run the get function with the message
// 4. (3) results in a new message (name generated), call it AA
// 5. when get AA, the reducer will run the then function with the value and the state

// So basically, there's some kind of message name, whether from 'subscribe' or
// generated automatically with 'get'
// 'update' functions are triggered in the reducer when a message with that type is received
// 'do' functions register a new middleware action that is triggered when a message of that type
// is received. 

// Note that even if we follow a similar pattern for backstage, we probably want to
// keep the display and the backstage as decoupled as possible. So you can use the backstage
// pattern if you want but you don't have to

// would be interesting to think if the state could be localized to the usecase. 
// but then what state would the view actually get? If I did this, I'd probably need to
// introduce some kind of 'hooks' style function calling in the view functions that would
// allow a view function to get at some of the state somehow.
