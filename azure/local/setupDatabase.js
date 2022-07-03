import waitOn from "wait-on"
import { seedNotes } from "./databaseSetup.js";
import { createTestDatabase } from './databaseSetup.js';

console.log("Waiting for fake cosmos db ...")

await new Promise((resolve) => {
  waitOn({
    resources: [
      `tcp:localhost:3021`
    ]
  }, (err) => {
    if (err) {
      console.log(err)
      reject()
    }
    resolve()
  })
})

console.log("Creating database and containers ...")

await createTestDatabase({
  endpoint: "https://localhost:3021",
  databaseName: "lds-local"
})

await seedNotes({
  endpoint: "https://localhost:3021",
  databaseName: "lds-local"
})

console.log("Done creating local database and containers!")