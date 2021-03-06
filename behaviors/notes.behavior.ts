import { expect } from "chai";
import { behavior, example, fact, effect, step, pick, outcome, Observation, Action } from "esbehavior";
import { goBackToLearningAreas, reloadTheApp, reloadThePage, selectLearningArea, visitTheLearningArea } from "./actions";
import { noteInputView, notesView } from "./effects";
import { someoneIsAuthenticated, thereAreLearningAreas } from "./presuppositions";
import { FakeEngagementNote, FakeLearningArea, TestContext, testContext } from "./testApp";

export default
  behavior("engagement notes", [
    example(testContext())
      .description("viewing existing notes")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1), FakeLearningArea(2)]),
          fact("one learning area has notes for two users", (testContext) => {
            testContext
              .withEngagementNotes([
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 1)
                  .withContent("This is my first cool note!")
                  .withDate(new Date(2022, 6, 7, 12, 34, 22)),
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 3)
                  .withContent("This is my third cool note!")
                  .withDate(new Date(2022, 6, 9, 8, 11, 7)),
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 2)
                  .withContent("This is my second cool note!")
                  .withDate(new Date(2022, 6, 7, 14, 33, 22)),
                FakeEngagementNote("another-person@email.com", FakeLearningArea(1), 4)
                  .withContent("This is another cool note!")
                  .withDate(new Date(2022, 6, 12, 23, 11, 22)),
              ])
          }),
          someoneIsAuthenticated("person@email.com"),
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1))
        ],
        observe: [
          outcome("it shows the person's notes in reverse chronological order", [
            observeNoteCount(3),
            effect("the third note is shown", observeTextsInNote(0, [
              "July 9, 2022",
              "This is my third cool note!"
            ])),
            effect("the second note is shown", observeTextsInNote(1, [
              "July 7, 2022",
              "This is my second cool note!"
            ])),
            effect("the first note is shown", observeTextsInNote(2, [
              "July 7, 2022",
              "This is my first cool note!"
            ]))
          ])
        ]
      }).andThen({
        suppose: [
          someoneIsAuthenticated("another-person@email.com")
        ],
        perform: [
          reloadTheApp(),
          selectLearningArea(FakeLearningArea(1)),
        ],
        observe: [
          outcome("it shows another person's note", [
            observeNoteCount(1),
            effect("the note is shown", observeTextsInNote(0, [
              "July 12, 2022",
              "This is another cool note!"
            ])),
          ])
        ]
      }).andThen({
        perform: [
          goBackToLearningAreas(),
          selectLearningArea(FakeLearningArea(2))
        ],
        observe: [
          effect("it shows no notes", async (testContext) => {
            const noteLength = await testContext.display
              .selectAll(notesView())
              .count()

            expect(noteLength).to.equal(0)
          })
        ]
      }),
    example(testContext())
      .description("creating a new note")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1)]),
          fact("the date is July 17, 2022", (testContext) => {
            testContext.setDate(new Date(2022, 6, 17, 13, 34, 22))
          }),
          someoneIsAuthenticated("fun-person@email.com"),
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1)),
          typeNote("This is the best note ever!"),
          clickToSaveNote(),
          step("time passes until it is the next day", async (testContext) => {
            await testContext.display.tickClock(27 * 60 * 60 * 1000)
          }),
          typeNote("This is an even better note!"),
          clickToSaveNote()
        ],
        observe: [
          observeNoteCount(2),
          outcome("the second created note is displayed first", [
            effect("the content is shown", observeTextsInNote(0, ["This is an even better note!"])),
            effect("the note is shown to have been created on July 18, 2022", observeTextsInNote(0, ["July 18, 2022"]))
          ]),
          outcome("the first created note is displayed second", [
            effect("the content is shown", observeTextsInNote(1, ["This is the best note ever!"])),
            effect("the note is shown to have been created on July 17, 2022", observeTextsInNote(1, ["July 17, 2022"]))
          ]),
          effect("the note input is cleared", async (testContext) => {
            const inputValue = await testContext.display.select(noteInputView()).getInputValue()
            expect(inputValue).to.equal("")
          })
        ]
      }).andThen({
        perform: [
          reloadThePage(),
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          observeNoteCount(2),
          effect("the second persisted note is shown first", observeTextsInNote(0, [
            "July 18, 2022",
            "This is an even better note!"
          ])),
          effect("the first peristed note is shown second", observeTextsInNote(1, [
            "July 17, 2022",
            "This is the best note ever!"
          ]))
        ]
      }),
    example(testContext())
      .description("When typing into the note input")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1)]),
          someoneIsAuthenticated("someone-cool@person.com"),
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1)),
          step("record the note input height", async (testContext) => {
            const clientHeight = await getNoteInputHeight(testContext)
            testContext.attributes["default-note-input-height"] = Number(clientHeight)
          }),
          typeNote("This is such a super long note that you will take forever to actually read it and then what will happen? You will just have to read it again because it is so long and really cool at the same time.")
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
      }),
    example(testContext())
      .description("When no text has been entered into the note input")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1)]),
          someoneIsAuthenticated("someone-cool@person.com"),
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("the save note button is disabled", async (testContext) => {
            const saveNoteButtonDisabledStatus = await testContext.display
              .selectElementWithText("Save Note")
              .getAttribute("disabled")

            expect(saveNoteButtonDisabledStatus).to.equal("true")
          })
        ]
      })
  ])

function observeTextsInNote(index: number, texts: Array<string>): (context: TestContext) => Promise<void> {
  return async (testContext) => {
    const noteContents = await testContext.display
      .selectAll(notesView())
      .getElement(index)
      .text()

    for (let i = 0; i < texts.length; i++) {
      expect(noteContents).to.contain(texts[i])
    }
  }
}

function observeNoteCount(expectedCount: number): Observation<TestContext> {
  return effect(`there are ${expectedCount} notes`, async (testContext) => {
    const noteCount = await testContext.display
      .selectAll(notesView())
      .count()

    expect(noteCount).to.equal(expectedCount)
  })
}

function getNoteInputHeight(testContext: TestContext): Promise<number> {
  return testContext.display
    .select(noteInputView())
    .getProperty("clientHeight")
}

function typeNote(content: string, description: string = "text is typed into the note input field"): Action<TestContext> {
  return step(description, async (testContext) => {
    await testContext.display
      .select(noteInputView())
      .type(content, { clear: true })
  })
}

function clickToSaveNote(): Action<TestContext> {
  return step("the save note button is clicked", async (testContext) => {
    await testContext.display
      .selectElementWithText("Save Note")
      .click()
    await testContext.display.waitForRequestsToComplete()
  })
}
