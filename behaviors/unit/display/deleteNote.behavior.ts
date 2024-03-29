import { Action, behavior, effect, example, fact, Observation, Presupposition, step } from "esbehavior";
import { Page } from "playwright";
import { FakeLearningArea } from "./fakes/learningArea";
import { EngageTestContextProxy, learningAreaTestContext } from "./engageTestContextProxy"
import { backstageRequestsAreDelayed, backstageRequestsFailDueToNetworkError, backstageRequestsFailDueToServerError, someoneIsAuthenticated } from "./presuppositions"
import { FakeNote, TestEngagementNote } from "./fakes/note";
import { visitTheLearningAreaPage, waitForResponseFromBackstage } from "./steps";
import { expect } from "chai";
import { errorMessageIsVisible } from "./observations";

export default (page: Page) =>
  behavior("delete a note", [
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("while a note is deleting")
      .script({
        suppose: [
          backstageRequestsAreDelayed(),
          someoneIsAuthenticated("fun-person@email.com"),
          thereAreNotes([
            FakeNote("fun-person@email.com", FakeLearningArea(1), 1),
            FakeNote("fun-person@email.com", FakeLearningArea(1), 2),
            FakeNote("fun-person@email.com", FakeLearningArea(1), 3)
          ])
        ],
        perform: [
          visitTheLearningAreaPage(),
          clickToDeleteNote(1)
        ],
        observe: [
          deleteNoteButtonIsDisabledForNote(0, false),
          deleteNoteButtonIsDisabledForNote(1, true),
          deleteNoteButtonIsDisabledForNote(2, false),
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the request to delete the note results in a server error")
      .script({
        suppose: [
          backstageRequestsFailDueToServerError(),
          someoneIsAuthenticated("fun-person@email.com"),
          thereAreNotes([
            FakeNote("fun-person@email.com", FakeLearningArea(1), 1).withContent("my original note was this text"),
            FakeNote("fun-person@email.com", FakeLearningArea(1), 2)
          ])
        ],
        perform: [
          visitTheLearningAreaPage(),
          clickToDeleteNote(0),
          waitForResponseFromBackstage()
        ],
        observe: [
          deleteNoteButtonIsDisabledForNote(0, false),
          textIsVisibleForNote(0, "my original note was this text"),
          errorMessageIsVisible(true)
        ]
      }),
    example(learningAreaTestContext(page, FakeLearningArea(1)))
      .description("when the request to delete the note results in a network error")
      .script({
        suppose: [
          backstageRequestsFailDueToNetworkError(),
          someoneIsAuthenticated("fun-person@email.com"),
          thereAreNotes([
            FakeNote("fun-person@email.com", FakeLearningArea(1), 1).withContent("my original note was funny")
          ])
        ],
        perform: [
          visitTheLearningAreaPage(),
          clickToDeleteNote(0),
        ],
        observe: [
          deleteNoteButtonIsDisabledForNote(0, false),
          textIsVisibleForNote(0, "my original note was funny"),
          errorMessageIsVisible(true)
        ]
      })
  ])

function clickToDeleteNote(index: number): Action<EngageTestContextProxy> {
  return step(`click to delete note at index ${index}`, async (testContext) => {
    await testContext.selectAll("[data-engagement-note]")
      .getElement(index)
      .selectDescendantWithText("Delete Note")
      .click()
  })
}

function deleteNoteButtonIsDisabledForNote(index: number, isDisabled: boolean): Observation<EngageTestContextProxy> {
  return effect(`the delete note button at index ${index} is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const deleteNoteButtonDisabledState = await testContext
      .selectAll("[data-engagement-note]")
      .getElement(index)
      .selectDescendantWithText("Delete Note")
      .isDisabled()
    expect(deleteNoteButtonDisabledState).to.deep.equal(isDisabled)
  })
}

function thereAreNotes(notes: Array<TestEngagementNote>): Presupposition<EngageTestContextProxy> {
  return fact(`there are ${notes.length} notes`, (testContext) => {
    testContext.withNotes(notes)
  })
}

function textIsVisibleForNote(index: number, text: string): Observation<EngageTestContextProxy> {
  return effect(`we see the text for note ${index}`, async (testContext) => {
    const elementIsVisible = await testContext
      .selectAll("[data-engagement-note]")
      .getElement(index)
      .selectDescendantWithText(text)
      .isVisible()
    expect(elementIsVisible).to.equal(true)
  })
}