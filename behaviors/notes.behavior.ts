import { expect } from "chai";
import { behavior, example, fact, effect, pick } from "esbehavior";
import { goBackToLearningAreas, loginUser, reloadTheApp, selectLearningArea } from "./actions";
import { notesView } from "./effects";
import { FakeEngagementNote, FakeLearningArea, testContext } from "./testApp";

export default
  behavior("viewing engagement notes", [
    example(testContext())
      .description("when there are notes for a learning area")
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
      })
  ])