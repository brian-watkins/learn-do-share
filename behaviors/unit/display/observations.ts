import { expect } from "chai"
import { effect, Observation } from "esbehavior"
import { EngageTestContextProxy } from "./engageTestContextProxy.js"

export function saveNoteButtonIsDisabled(isDisabled: boolean): Observation<EngageTestContextProxy> {
  return effect(`the save note button is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const saveNoteButtonDisabledState = await testContext
      .selectElementWithText("Save Note")
      .isDisabled()
    expect(saveNoteButtonDisabledState).to.equal(isDisabled)
  })
}

export function noteInputIsDisabled(isDisabled: boolean): Observation<EngageTestContextProxy> {
  return effect(`the save note input is ${isDisabled ? "disabled" : "enabled"}`, async (testContext) => {
    const saveNoteInputDisabledState = await testContext
      .select("[data-note-input]")
      .isDisabled()
    expect(saveNoteInputDisabledState).to.equal(isDisabled)
  })
}

export function errorMessageIsVisible(isVisible: boolean): Observation<EngageTestContextProxy> {
  return effect(`error display is ${ isVisible ? "visible" : "hidden" }`, async (testContext) => {
    const errorElement = testContext.select("[data-error]")

    let errorIsVisible: boolean
    if (isVisible) {
      errorIsVisible = await errorElement.isVisible()
    }
    else {
      errorIsVisible = !await errorElement.isHidden()
    }

    expect(errorIsVisible).to.equal(isVisible)
  })
}
