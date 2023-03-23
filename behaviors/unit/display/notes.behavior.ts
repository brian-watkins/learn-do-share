import { FakeLearningArea } from "behaviors/integration/testApp.js";
import { expect } from "chai";
import { behavior, effect, step, Action, example } from "esbehavior";
import { Page } from "playwright";
import { EngageTestContextProxy, learningAreaTestContext } from "./engageTestContextProxy.js";
import { saveNoteButtonIsDisabled } from "./observations.js";
import { someoneIsAuthenticated } from "./presuppositions.js";
import { visitTheLearningAreaPage } from "./steps.js";

export default (page: Page) =>
  behavior("notes", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("When no text has been entered into the note input")
      .script({
        suppose: [
          someoneIsAuthenticated("someone-cool@person.com"),
        ],
        perform: [
          visitTheLearningAreaPage()
        ],
        observe: [
          saveNoteButtonIsDisabled(true)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("When typing into the note input")
      .script({
        suppose: [
          someoneIsAuthenticated("someone-cool@person.com"),
        ],
        perform: [
          visitTheLearningAreaPage(),
          step("record the note input height", async (testContext) => {
            const clientHeight = await getNoteInputHeight(testContext)
            testContext.attributes["default-note-input-height"] = clientHeight
          }),
          typeNote("This is such a super long note that you will take forever to actually read it and then what will happen? You will just have to read it again because it is so long and really cool at the same time.", "a long note is typed into the note")
        ],
        observe: [
          effect("the note input height increased to accomodate lots of text", async (testContext) => {
            const currentNoteInputHeight = await getNoteInputHeight(testContext)
            expect(currentNoteInputHeight).to.be.greaterThan(testContext.attributes["default-note-input-height"])
          })
        ]
      }).andThen({
        perform: [
          typeNote("This is now a short note!", "a shorter text is typed into the note input field")
        ],
        observe: [
          effect("the note input height decreased", async (testContext) => {
            const currentNoteInputHeight = await getNoteInputHeight(testContext)
            expect(currentNoteInputHeight).to.equal(testContext.attributes["default-note-input-height"])
          })
        ]
      })
  ])

async function getNoteInputHeight(testContext: EngageTestContextProxy): Promise<number> {
  return await testContext
    .select("[data-note-input]")
    .getProperty("clientHeight")
}

function typeNote(text: string, message: string): Action<EngageTestContextProxy> {
  return step(message, async (testContext) => {
    await testContext
      .select("[data-note-input]")
      .fill(text, { clear: true })
  })
}