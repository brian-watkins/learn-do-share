import { User } from "@/api/common/user";
import { EngagementPlanReader as EngagePlanReader } from "@/src/engage/backstage"
import { EngagementPlanReader as OverviewPlanReader } from "@/src/overview/backstage"
import { EngagementPlan } from "@/src/engage/engagementPlans";
import { LearningArea } from "@/src/engage/learningArea";
import { EngagementPlanWriter } from "@/src/engage/engagementPlans/writeEngagementPlans";
import fetch from "node-fetch";

export class HttpEngagementPlanReader implements EngagePlanReader, OverviewPlanReader {
  
  async readAll(user: User): Promise<EngagementPlan[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/plans`)
    const data = await response.json()
    return data as Array<EngagementPlan>
  }
  
  async read(user: User, learningArea: LearningArea): Promise<EngagementPlan[]> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/plans?learningAreaId=${learningArea.id}`)
    const data = await response.json()
    return data as Array<EngagementPlan>
  }

}

export class HttpEngagementPlanWriter implements EngagementPlanWriter {
  
  async write(user: User, plan: EngagementPlan): Promise<EngagementPlan> {
    const response = await fetch(`http://localhost:7171/user/${user.identifier}/plans`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan
      })
    })
    const data = await response.json()
    return data as EngagementPlan
  }
  
  async deleteAll(user: User, learningArea: string): Promise<void> {
    await fetch(`http://localhost:7171/user/${user.identifier}/plans?learningAreaId=${learningArea}`, {
      method: "DELETE"
    })
  }

}