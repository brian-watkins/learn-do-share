import { Action, behavior, effect, example, fact, pick, step } from "esbehavior";
import { FakeLearningArea } from "./fakes/learningArea";
import { EngageTestContext, learningAreaTestContext } from "./engageTestContext"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { FakeNote } from "./fakes/note";
import { visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps";
import { expect } from "chai";

export default
  behavior("delete a note", [
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("while a note is deleting")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-person@email.com"),
          fact("there are three notes", (testContext) => {
            testContext.withNotes([
              FakeNote("fun-person@email.com", FakeLearningArea(1), 1),
              FakeNote("fun-person@email.com", FakeLearningArea(1), 2),
              FakeNote("fun-person@email.com", FakeLearningArea(1), 3)
            ])
          })
        ],
        perform: [
          visitTheLearningAreaPage(),
          clickToDeleteNote(1)
        ],
        observe: [
          effect("the delete note button is disabled on the second note", async (testContext) => {
            const deleteNoteButtonDisabledStates = await testContext
              .selectAll("[data-engagement-note]")
              .mapElements(element => {
                return element.selectDescendantWithText("Delete Note").isDisabled()
              })
            expect(deleteNoteButtonDisabledStates).to.deep.equal([false, true, false])
          })
        ]
      }),
    example(learningAreaTestContext(FakeLearningArea(1)))
      .description("when the request to delete the note results in a server error")
      .script({
        suppose: [
          backstageRequestsFailDueToServerError(),
          someoneIsAuthenticated("fun-person@email.com"),
          fact("there is a note", (testContext) => {
            testContext.withNotes([
              FakeNote("fun-person@email.com", FakeLearningArea(1), 1)
            ])
          })
        ],
        perform: [
          visitTheLearningAreaPage(),
          clickToDeleteNote(0),
          waitForResponseFromBackstage()
        ],
        observe: [
          effect("the delete note button is enabled", async (testContext) => {
            const deleteNoteButtonDisabledState = await testContext
              .selectElementWithText("Delete Note")
              .isDisabled()
            expect(deleteNoteButtonDisabledState).to.deep.equal(false)
          })
        ]
      })
  ])

  function clickToDeleteNote(index: number): Action<EngageTestContext> {
    return step(`click to delete note at index ${index}`, async (testContext) => {
      await testContext.selectAll("[data-engagement-note]")
        .getElement(index)
        .selectDescendantWithText("Delete Note")
        .click()
    })
  }