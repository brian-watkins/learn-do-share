import { BulkOperationType } from "@azure/cosmos";
import { User } from "../api/common/user";
import { EngagementPlanReader } from "@/src/overview/backstage";
import { EngagementPlanReader as PlanReader } from "@/src/engage/backstage"
import { CosmosConnection } from "./cosmosConnection";
import { EngagementPlan } from "@/src/engage/engagementPlans";
import { LearningArea } from "@/src/engage/learningArea";
import { EngagementPlanWriter } from "@/src/engage/engagementPlans/saveEngagementPlan";


export class CosmosEngagementPlanRepository implements EngagementPlanReader, PlanReader, EngagementPlanWriter {

  constructor(private connection: CosmosConnection, private container: string = "engagement-plans") { }

  async readAll(user: User): Promise<EngagementPlan[]> {
    return this.connection.execute(this.container, async (plans) => {
      const { resources } = await plans.items.query({
        query: "SELECT * FROM plans p WHERE p.userId = @userId",
        parameters: [
          { name: "@userId", value: user.identifier }
        ]
      }, { partitionKey: user.identifier })
        .fetchAll()

      return resources
    })
  }

  async read(user: User, learningArea: LearningArea): Promise<EngagementPlan[]> {
    return this.connection.execute(this.container, async (plans) => {
      const { resources } = await plans.items.query({
        query: "SELECT * FROM plans p WHERE p.userId = @userId AND p.learningArea = @learningAreaId",
        parameters: [
          { name: "@userId", value: user.identifier },
          { name: "@learningAreaId", value: learningArea.id }
        ]
      }, { partitionKey: user.identifier })
        .fetchAll()

      return resources
    })
  }

  async write(user: User, plan: EngagementPlan): Promise<EngagementPlan> {
    return this.connection.execute(this.container, async (plans) => {
      const storeablePlan = Object.assign(plan, { userId: user.identifier })

      const { resource } = await plans.items.create(storeablePlan)

      if (!resource) {
        return Promise.reject("Unable to create plan!")
      }

      return resource
    })
  }

  async deleteAll(user: User, learningArea: string): Promise<void> {
    return this.connection.execute(this.container, async (plans) => {
      // Note: Seems like we should try to remove this query
      // But the frontend request doesn't seem to be all that much slower,
      // maybe a few ms. So doesn't matter a whole lot
      const { resources } = await plans.items
        .query({
          query: "SELECT * FROM plans WHERE plans.learningArea = @learningArea",
          parameters: [
            { name: "@learningArea", value: learningArea }
          ],
        }, { partitionKey: user.identifier })
        .fetchAll()

      await plans.items.batch(resources.map((resource) => {
        return {
          operationType: BulkOperationType.Delete,
          partitionKey: `["${user.identifier}"]`,
          id: resource.id
        }
      }), user.identifier)
    })
  }
}