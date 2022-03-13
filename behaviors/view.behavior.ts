import { behavior, condition, effect, example } from "esbehavior"
import chai, { expect } from "chai"
import chaiAsPromised from "chai-as-promised"
chai.use(chaiAsPromised)
import { TestApp } from "./testApp"

export default
  behavior("viewing items", [
    example({
      init: async () => {
        const app = new TestApp()
        return app.start()
      },
      teardown: async (testApp) => {
        testApp.stop()
      }
    })
      .description("there are no learning items available")
      .script({
        observe: [
          effect("it shows that there are no items", async (testApp) => {
            await expect(testApp.display.pageText()).to.eventually.contain("There is nothing to learn!")
          })
        ]
      })
  ])