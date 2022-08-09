import { BulkOperationType } from "@azure/cosmos";
import { User } from "../api/common/user";
import { EngagementPlanReader } from "@/src/overview/backstage";
import { EngagementPlanWriter } from "@/src/engage/engagementPlans/writeEngagementPlans";
import { CosmosConnection } from "./cosmosConnection";
import { EngagementPlan } from "@/src/engage/engagementPlans";

const PLANS_CONTAINER = "engagement-plans"

export class CosmosEngagementPlanRepository implements EngagementPlanReader, EngagementPlanWriter {

  constructor(private connection: CosmosConnection) { }

  async read(user: User): Promise<EngagementPlan[]> {
    return this.connection.execute(PLANS_CONTAINER, async (plans) => {
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

  async write(user: User, plan: EngagementPlan): Promise<EngagementPlan> {
    return this.connection.execute(PLANS_CONTAINER, async (plans) => {
      const storeablePlan = Object.assign(plan, { userId: user.identifier })

      const { resource } = await plans.items.create(storeablePlan)

      if (!resource) {
        return Promise.reject("Unable to create plan!")
      }

      return resource
    })
  }

  async deleteAll(user: User, learningArea: string): Promise<void> {
    return this.connection.execute(PLANS_CONTAINER, async (plans) => {
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