import { expect } from "chai";
import { behavior, example, fact, effect, step, pick } from "esbehavior";
import { goBackToLearningAreas, loginUser, reloadTheApp, reloadThePage, selectLearningArea } from "./actions";
import { notesView } from "./effects";
import { theAppShowsTheLearningAreas } from "./presuppositions";
import { FakeEngagementNote, FakeLearningArea, testContext } from "./testApp";

export default
  behavior("engagement notes", [
    example(testContext())
      .description("viewing existing notes")
      .script({
        suppose: [
          fact("there is a learning area with notes for users", (testContext) => {
            testContext
              .withLearningAreas([
                FakeLearningArea(1),
                FakeLearningArea(2)
              ])
              .withEngagementNotes([
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 1)
                  .withContent("This is my first cool note!"),
                FakeEngagementNote("person@email.com", FakeLearningArea(1), 2)
                  .withContent("This is my second cool note!"),
                FakeEngagementNote("another-person@email.com", FakeLearningArea(1), 3)
                  .withContent("This is some other note!"),
              ])
          }),
          fact(`the app is on the page for the learning area with notes`, async (testContext) => {
            await testContext.startAtLearningArea(FakeLearningArea(1))
          })
        ],
        perform: [
          loginUser("person@email.com"),
        ],
        observe: [
          effect("it shows the notes", async (testContext) => {
            const noteContents = await testContext.display
              .selectAll(notesView())
              .mapElements(element => element.text())

            expect(noteContents).to.deep.equal([
              "This is my first cool note!",
              "This is my second cool note!",
            ])
          })
        ]
      }).andThen({
        perform: [
          reloadTheApp(),
          loginUser("another-person@email.com"),
          selectLearningArea(FakeLearningArea(1)),
        ],
        observe: [
          effect("it shows the notes", async (testContext) => {
            const noteContents = await testContext.display
              .selectAll(notesView())
              .mapElements(element => element.text())

            expect(noteContents).to.deep.equal([
              "This is some other note!",
            ])
          })
        ]
      }).andThen({
        perform: [
          goBackToLearningAreas(),
          selectLearningArea(FakeLearningArea(2))
        ],
        observe: [
          effect("it shows no notes", async (testContext) => {
            const noteContents = await testContext.display
              .selectAll(notesView())
              .mapElements(element => element.text())

            expect(noteContents).to.have.length(0)
          })
        ]
      }),
    example(testContext())
      .description("creating a new note")
      .script({
        suppose: [
          fact("there is a learning area", (testContext) => {
            testContext
              .withLearningAreas([
                FakeLearningArea(1)
              ])
          }),
          theAppShowsTheLearningAreas()
        ],
        perform: [
          loginUser("fun-person@email.com"),
          selectLearningArea(FakeLearningArea(1)),
          step("a note is created", async (testContext) => {
            await testContext.display
              .select("[data-note-input]")
              .type("This is the best note ever!")
            await testContext.display
              .selectElementWithText("Save Note")
              .click()
            await testContext.display.waitForRequestsToComplete()
          })
        ],
        observe: [
          effect("the note is shown in the list", async (testContext) => {
            const noteContents = await testContext.display
              .selectAll(notesView())
              .mapElements(element => element.text())

            expect(noteContents).to.deep.equal(["This is the best note ever!"])
          }),
          effect("the note input is cleared", async (testContext) => {
            const inputValue = await testContext.display.select("[data-note-input]").getInputValue()
            expect(inputValue).to.equal("")
          })
        ]
      }).andThen({
        perform: [
          reloadThePage(),
          selectLearningArea(FakeLearningArea(1))
        ],
        observe: [
          effect("the note persists", async (testContext) => {
            const noteContents = await testContext.display
              .selectAll(notesView())
              .mapElements(element => element.text())

            expect(noteContents).to.deep.equal(["This is the best note ever!"])
          })
        ]
      })
  ])