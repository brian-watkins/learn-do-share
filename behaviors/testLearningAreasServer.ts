import express from "express"
import { Server } from "http"
import { TestLearningArea } from "./testApp"
import { LearningArea } from "@/src/overview/learningAreas"
import { LearningArea as EngageLearningArea } from "@/src/engage/learningArea"


export class TestLearningAreasServer {
  private server: Server | null = null
  public areas: Array<TestLearningArea> = []

  async start(): Promise<void> {
    const app = express()
    app.get("/learning-areas", (req, res) => {
      res.json(this.areas?.map(toLearningArea) ?? [])
    })

    app.get("/learning-area/:areaId", (req, res) => {
      const area = this.areas.filter(area => area.id === req.params.areaId).map(toAreaToEngage)[0] ?? null
      res.json(area)
    })

    return new Promise((resolve) => {
      this.server = app.listen(7171, resolve)
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
