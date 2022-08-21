import { behavior, effect, example, fact, pick, step } from "esbehavior";
import { Page } from "playwright";
import { FakeLearningArea } from "./fakes/learningArea";
import { learningAreaTestContext } from "./engageTestContextProxy"
import { backstageRequestsAreDelayed, someoneIsAuthenticated } from "./presuppositions"
import { FakeNote } from "./fakes/note";
import { visitTheLearningAreaPage } from "./steps";
import { expect } from "chai";

export default (page: Page) =>
  behavior("delete a note", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
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
          step("click to delete the second note", async (testContext) => {
            await testContext.selectAll("[data-engagement-note]")
              .getElement(1)
              .selectDescendantWithText("Delete Note")
              .click()
          })
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
      })
  ])