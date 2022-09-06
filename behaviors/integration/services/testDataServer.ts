import express from "express"
import { Server } from "http"
import { TestEngagementNote, TestEngagementPlan, TestLearningArea } from "../testApp"
import { LearningArea } from "@/src/overview/learningAreas"
import { LearningArea as EngageLearningArea } from "@/src/engage/learningArea"


export class TestDataServer {
  private server: Server | null = null
  public areas: Array<TestLearningArea> = []
  public notes: Array<TestEngagementNote> = []
  public plans: Array<TestEngagementPlan> = []

  async start(port: number = 7171): Promise<void> {
    const app = express()
    app.use(express.json())

    app.get("/learning-areas", (_, res) => {
      res.json(this.areas?.map(toLearningArea) ?? [])
    })

    app.get("/learning-area/:areaId", (req, res) => {
      const area = this.areas.filter(area => area.id === req.params.areaId).map(toAreaToEngage)[0] ?? null
      res.json(area)
    })

    app.get("/user/:userId/plans", (req, res) => {
      const allPlans = this.plans
        .filter(plan => plan.userId === req.params.userId)

      if (req.query.learningAreaId) {
        res.json(allPlans.filter(plan => plan.learningArea === req.query.learningAreaId))
      } else {
        res.json(allPlans)
      }
    })

    app.post("/user/:userId/plans", (req, res) => {
      const plan = req.body.plan
      this.plans.push(new TestEngagementPlan(req.params.userId, plan.learningArea, plan.level))
      res.json(plan)
    })

    app.delete("/user/:userId/plans", (req, res) => {
      this.plans = this.plans
        .filter(plan => plan.userId !== req.params.userId || plan.learningArea !== req.query.learningAreaId)
      res.end()
    })

    app.delete("/user/:userId/notes/:noteId", (req, res) => {
      this.notes = this.notes
        .filter((note) => note.id !== req.params.noteId)
      res.end()
    })

    app.post("/user/:userId/notes", (req, res) => {
      const note = new TestEngagementNote(req.params.userId, req.body.learningAreaId, this.notes.length)
        .withContent(req.body.content.content)
        .withDate(new Date(req.body.content.date))
        
      this.notes.push(note)
      res.json(note)
    })

    app.get("/user/:userId/notes", (req, res) => {
      const learningAreaNotes = this.notes
        .filter(note => req.params.userId === note.user)
        .filter(note => note.learningAreaId === req.query["learningAreaId"])
        .sort((noteA, noteB) => noteA.date.localeCompare(noteB.date))
        .reverse()

      res.json(learningAreaNotes)
    })

    app.get("/user/:userId/noteCounts", (req, res) => {
      const noteMap = this.notes
        .filter(note => req.params.userId === note.user)
        .reduce((acc, current) => {
          if (!acc[current.learningAreaId]) {
            acc[current.learningAreaId] = 0
          }
          acc[current.learningAreaId] += 1
          return acc
        }, {} as { [key: string]: number })

      res.json(Object.entries(noteMap).map(entry => {
        return {
          learningAreaId: entry[0],
          noteCount: entry[1]
        }
      }))
    })

    return new Promise((resolve) => {
      this.server = app.listen(port, () => {
        resolve()
      })
    })
  }

  async stop(): Promise<void> {
    return new Promise((resolve) => {
      this.server?.close(() => { resolve() })
    })
  }
}

function toLearningArea(area: TestLearningArea): LearningArea {
  return {
    id: area.id,
    title: area.title,
    category: area.category
  }
}

function toAreaToEngage(area: TestLearningArea): EngageLearningArea {
  return {
    id: area.id,
    content: area.content,
    title: area.title,
    category: area.category
  }
}
