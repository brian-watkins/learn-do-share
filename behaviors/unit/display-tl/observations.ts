import { expect } from "chai"
import { effect, Observation } from "esbehavior"
import { EngageTestContext } from "./engageTestContext"

export function saveNoteButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContext> {
  return effect(`the save note button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const saveNoteButtonDisabledState = await testContext
      .selectElementWithText("Save Note")
      .isDisabled()
    expect(saveNoteButtonDisabledState).to.equal(isDisabled)
  })
}

export function noteInputIsDisabled(isDisabled: boolean): Observation<EngageTestContext> {
  return effect(`the save note input is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const saveNoteInputDisabledState = await testContext
      .select("[data-note-input]")
      .isDisabled()
    expect(saveNoteInputDisabledState).to.equal(isDisabled)
  })
}