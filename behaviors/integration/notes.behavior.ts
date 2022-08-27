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
      .description("Deleting a note")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1)]),
          fact("there is a note for a user", (testContext) => {
            testContext
              .withEngagementNotes([
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 1)
              ])
          }),
          someoneIsAuthenticated("person@email.com"),
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1)),
          step("delete the note", async (testContext) => {
            await testContext.display
              .selectElementWithText("Delete Note")
              .click()
            await testContext.display.waitForRequestsToComplete()
          })
        ],
        observe: [
          observeNoteCount(0)
        ]
      }).andThen({
        perform: [
          reloadThePage(),
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          observeNoteCount(0)
        ]
      }),
    example(testContext())
      .description("When markdown is used in the note")
      .script({
        suppose: [
          thereAreLearningAreas([FakeLearningArea(1)]),
          someoneIsAuthenticated("someone-cool@person.com")
        ],
        perform: [
          visitTheLearningArea(FakeLearningArea(1)),
          typeNote(`
Here is a *note* with some

- cool markup
- and other fun stuff
          `),
          clickToSaveNote()
        ],
        observe: [
          outcome("the markdown is converted to HTML when the note is displayed", [
            noteContainsHtmlTagWithText("EM", "note"),
            noteContainsHtmlTagWithText("LI", "cool markup")
          ])
        ]
      }).andThen({
        perform: [
          reloadThePage(),
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          outcome("the markdown is converted to HTML when the saved note is displayed", [
            noteContainsHtmlTagWithText("EM", "note"),
            noteContainsHtmlTagWithText("LI", "cool markup")
          ])
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

function typeNote(content: string, description: string = "text is typed into the note input field"): Action<TestContext> {
  return step(description, async (testContext) => {
    await testContext.display
      .select(noteInputView())
      .fill(content, { clear: true })
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

function noteContainsHtmlTagWithText(tag: string, text: string): Observation<TestContext> {
  return effect(`The note contains a ${tag} with the expected text`, async (testContext) => {
    const emphasizedTextTag = await testContext.display
      .select(notesView())
      .selectDescendantWithText(text)
      .tagName()

    expect(emphasizedTextTag).to.equal(tag)
  })
}