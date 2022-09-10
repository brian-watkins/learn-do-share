import { EngagementPlanReader } from "@/src/engage/backstage";
import { EngagementPlanReader as EngagementPlanOverviewReader } from "@/src/overview/backstage"
import { EngagementLevel, EngagementPlan } from "@/src/engage/engagementPlans";
import { EngagementPlanWriter } from "@/src/engage/engagementPlans/writeEngagementPlans";
import { expect } from "chai";
import { behavior, effect, example, step } from "esbehavior";
import { TestLearningArea } from "./fakes/LearningArea";
import { TestUser } from "./fakes/User";

export default (name: string, engagementPlanReader: EngagementPlanReader & EngagementPlanOverviewReader, engagementPlanWriter: EngagementPlanWriter) =>
  behavior(`Reading, Writing, and Deleting Engagement Plans for ${name}`, [
    example({ init: () => new Map<string, EngagementPlan>() })
      .script({
        perform: [
          step("write two engagement plans for a user", async (context) => {
            const plan1 = await engagementPlanWriter.write(TestUser(1), {
              learningArea: TestLearningArea(1).id,
              level: EngagementLevel.Learning
            })
            context.set("plan-1", plan1)
            const plan2 = await engagementPlanWriter.write(TestUser(1), {
              learningArea: TestLearningArea(1).id,
              level: EngagementLevel.Doing
            })
            context.set("plan-2", plan2)
          }),
          step("write engagement plan for another learning area", async (context) => {
            const plan = await engagementPlanWriter.write(TestUser(1), {
              learningArea: TestLearningArea(2).id,
              level: EngagementLevel.Learning
            })
            context.set("plan-4", plan)
          }),
          step("write an engagement plan for another user", async (context) => {
            const plan = await engagementPlanWriter.write(TestUser(2), {
              learningArea: TestLearningArea(1).id,
              level: EngagementLevel.Learning
            })
            context.set("plan-3", plan)
          })
        ],
        observe: [
          effect("two plans were created for one user for the learning area", async (context) => {
            const plans = await engagementPlanReader.read(TestUser(1), TestLearningArea(1))
            expect(plans).to.have.length(2)
            expect(plans).to.deep.include(context.get("plan-1"))
            expect(plans).to.deep.include(context.get("plan-2"))
          }),
          effect("all plans for a user can be read", async (context) => {
            const plans = await engagementPlanReader.readAll(TestUser(1))
            expect(plans).to.have.length(3)
            expect(plans).to.deep.include(context.get("plan-1"))
            expect(plans).to.deep.include(context.get("plan-2"))
            expect(plans).to.deep.include(context.get("plan-4"))
          }),
          effect("one plan was created for another user", async (context) => {
            const plans = await engagementPlanReader.read(TestUser(2), TestLearningArea(1))
            expect(plans).to.have.length(1)
            expect(plans).to.deep.include(context.get("plan-3"))
          }),
          effect("all plans for the other user can be read", async (context) => {
            const plans = await engagementPlanReader.readAll(TestUser(2))
            expect(plans).to.have.length(1)
            expect(plans).to.deep.include(context.get("plan-3"))
          })
        ]
      }).andThen({
        perform: [
          step("the plans are deleted for a user for the learning area", async () => {
            await engagementPlanWriter.deleteAll(TestUser(1), TestLearningArea(1).id)
          })
        ],
        observe: [
          effect("no plans are read for that learning area for that user", async () => {
            const plans = await engagementPlanReader.read(TestUser(1), TestLearningArea(1))
            expect(plans).to.be.empty
          }),
          effect("plans for the other learning area are still available", async (context) => {
            const plans = await engagementPlanReader.read(TestUser(1), TestLearningArea(2))
            expect(plans).to.have.length(1)
            expect(plans).to.deep.include(context.get("plan-4"))
          }),
          effect("the other user's plans are still available", async (context) => {
            const plans = await engagementPlanReader.read(TestUser(2), TestLearningArea(1))
            expect(plans).to.have.length(1)
            expect(plans).to.deep.include(context.get("plan-3"))
          })
        ]
      })
  ])
