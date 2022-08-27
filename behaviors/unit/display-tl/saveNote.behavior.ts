import { behavior, example, step, effect, pick, Action, Observation } from "esbehavior";
import { FakeLearningArea } from "./fakes/learningArea";
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps";
import { expect } from "chai";
import { noteInputIsDisabled, saveNoteButtonIsDisabled } from "./observations"
import { EngageTestContext, learningAreaTestContext } from "./engageTestContext"

export default
  behavior("save a note", [
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("while a note is being saved")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-person@email.com"),
        ],
        perform: [
          visitTheLearningAreaPage(),
          createNote("Here is a fun note!")
        ],
        observe: [
          ...noteInput({
            hasText: "Here is a fun note!",
            isDisabled: true
          })
        ]
      }),
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when saving a note fails due to a server error")
      .script({
        suppose: [
          backstageRequestsFailDueToServerError(),
          someoneIsAuthenticated("fun-person@email.com")
        ],
        perform: [
          visitTheLearningAreaPage(),
          createNote("Here is a cool note!"),
          waitForResponseFromBackstage()
        ],
        observe: [
          ...noteInput({
            hasText: "Here is a cool note!",
            isDisabled: false
          })
        ]
      }),
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when saving a note fails due to a network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
          someoneIsAuthenticated("fun-person@email.com")
        ],
        perform: [
          visitTheLearningAreaPage(),
          createNote("Here is an awesome note!"),
          waitForResponseFromBackstage()
        ],
        observe: [
          ...noteInput({
            hasText: "Here is an awesome note!",
            isDisabled: false
          })
        ]
      })
  ])

function createNote(text: string): Action<EngageTestContext> {
  return step("create a note", async (testContext) => {
    await testContext
      .select("[data-note-input]")
      .fill(text, { clear: true })
    await testContext
      .selectElementWithText("Save Note")
      .click()
  })
}

interface NoteInputOptions {
  hasText: string
  isDisabled: boolean
}

function noteInput(options: NoteInputOptions): Array<Observation<EngageTestContext>> {
  return [
    saveNoteButtonIsDisabled(options.isDisabled),
    noteInputIsDisabled(options.isDisabled),
    effect("the text is still in the input field", async (testContext) => {
      const saveNoteInputValue = await testContext
        .select("[data-note-input]")
        .getInputValue()
      expect(saveNoteInputValue).to.equal(options.hasText)
    })
  ]
}