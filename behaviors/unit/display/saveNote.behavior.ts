import { behavior, example, step, effect, pick } from "esbehavior";
import { Page } from "playwright";
import { FakeLearningArea } from "./fakes/learningArea";
import { learningAreaTestContext } from "./engageTestContextProxy"
import { backstageRequestsAreDelayed, someoneIsAuthenticated } from "./presuppositions"
import { visitTheLearningAreaPage } from "./steps";
import { expect } from "chai";

export default (page: Page) =>
  behavior("save a note", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("while a note is being saved")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-person@email.com"),
        ],
        perform: [
          visitTheLearningAreaPage(),
          step("type a note", async (testContext) => {
            await testContext
              .select("[data-note-input]")
              .type("Here is a fun note!", { clear: true })
          }),
          step("save the note", async (testContext) => {
            await testContext
              .selectElementWithText("Save Note")
              .click()
          })
        ],
        observe: [
          effect("the save note button is disabled", async (testContext) => {
            const saveNoteButtonDisabledState = await testContext
              .selectElementWithText("Save Note")
              .isDisabled()
            expect(saveNoteButtonDisabledState).to.equal(true)
          }),
          effect("the save note input is disabled", async (testContext) => {
            const saveNoteInputDisabledState = await testContext
              .select("[data-note-input]")
              .isDisabled()
            expect(saveNoteInputDisabledState).to.equal(true)
          }),
          effect("the text is still in the input field", async (testContext) => {
            const saveNoteInputValue = await testContext
              .select("[data-note-input]")
              .getInputValue()
            expect(saveNoteInputValue).to.equal("Here is a fun note!")
          })
        ]
      })
  ])
