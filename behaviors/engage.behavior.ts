import { EngagementLevel } from "@/src/engage/engagementPlans";
import { Action, behavior, example, fact, outcome, pick, procedure, step } from "esbehavior";
import { engagementLevelSelected, noEngagementLevelsSelected } from "./effects";
import { loginUser, reloadTheApp, goBackToLearningAreas, selectLearningArea, reloadThePage } from "./actions";
import { FakeLearningArea, TestContext, testContext, TestLearningArea } from "./testApp";
import { theAppShowsTheLearningAreas } from "./presuppositions";

export default
  behavior("indicate engagement with a learning area", [
    example(testContext())
      .description("engagement levels are persisted for a particular user")
      .script({
        suppose: [
          fact("there are learning areas", (testContext) => {
            testContext.withLearningAreas([
              FakeLearningArea(1),
              FakeLearningArea(2),
              FakeLearningArea(3),
              FakeLearningArea(4),
            ])
          }),
          theAppShowsTheLearningAreas()
        ],
        perform: [
          loginUser("funny-person@email.com"),
          procedure("Commit to learn Learning Area 1", [
            selectLearningArea(FakeLearningArea(1)),
            increaseEngagementLevel(FakeLearningArea(1), "I'm ready to learn!"),
          ]),
          goBackToLearningAreas(),
          procedure("Commit to learn and do Learning Area 2", [
            selectLearningArea(FakeLearningArea(2)),
            increaseEngagementLevel(FakeLearningArea(2), "I'm ready to learn!"),
            increaseEngagementLevel(FakeLearningArea(2), "Let's do it!"),
          ]),
          goBackToLearningAreas(),
          procedure("Commit to learn, do, and share Learning Area 4", [
            selectLearningArea(FakeLearningArea(4)),
            increaseEngagementLevel(FakeLearningArea(4), "I'm ready to learn!"),
            increaseEngagementLevel(FakeLearningArea(4), "Let's do it!"),
            increaseEngagementLevel(FakeLearningArea(4), "I'm ready to share!"),
          ]),
          goBackToLearningAreas()
        ],
        observe: [
          outcome("Commitments to engage are displayed", [
            engagementLevelSelected(FakeLearningArea(1), "Learning"),
            engagementLevelSelected(FakeLearningArea(2), "Learning"),
            engagementLevelSelected(FakeLearningArea(2), "Doing"),
            engagementLevelSelected(FakeLearningArea(4), "Learning"),
            engagementLevelSelected(FakeLearningArea(4), "Doing"),
            engagementLevelSelected(FakeLearningArea(4), "Sharing")
          ])
        ]
      })
      .andThen({
        perform: [
          reloadThePage(),
        ],
        observe: [
          outcome("the engagement levels persist", [
            engagementLevelSelected(FakeLearningArea(1), "Learning"),
            engagementLevelSelected(FakeLearningArea(2), "Learning"),
            engagementLevelSelected(FakeLearningArea(2), "Doing"),
            engagementLevelSelected(FakeLearningArea(4), "Learning"),
            engagementLevelSelected(FakeLearningArea(4), "Doing"),
            engagementLevelSelected(FakeLearningArea(4), "Sharing")
          ])
        ]
      }).andThen({
        perform: [
          reloadTheApp(),
          loginUser("some-other-user@email.com")
        ],
        observe: [
          outcome("other users do not share the same commitments to engage", [
            noEngagementLevelsSelected(FakeLearningArea(1)),
            noEngagementLevelsSelected(FakeLearningArea(2)),
            noEngagementLevelsSelected(FakeLearningArea(4))
          ])
        ]
      }),
    example(testContext())
      .description("clear engagement levels")
      .script({
        suppose: [
          fact("there is a learning area", (testContext) => {
            testContext.withLearningAreas([
              FakeLearningArea(1)
            ])
          }),
          fact("the user is committed to learn, do, and share Learning Area 1", (testContext) => {
            testContext
              .withEngagementPlan("funny-person@email.com", FakeLearningArea(1), EngagementLevel.Learning)
              .withEngagementPlan("funny-person@email.com", FakeLearningArea(1), EngagementLevel.Doing)
              .withEngagementPlan("funny-person@email.com", FakeLearningArea(1), EngagementLevel.Sharing)
          }),
          theAppShowsTheLearningAreas()
        ],
        perform: [
          loginUser("funny-person@email.com")
        ],
        observe: [
          engagementLevelSelected(FakeLearningArea(1), "Learning"),
          engagementLevelSelected(FakeLearningArea(1), "Doing"),
          engagementLevelSelected(FakeLearningArea(1), "Sharing")
        ]
      }).andThen({
        perform: [
          selectLearningArea(FakeLearningArea(1)),
          increaseEngagementLevel(FakeLearningArea(1), "I'm done for now!"),
        ],
        observe: [
          noEngagementLevelsSelected(FakeLearningArea(1))
        ]
      }).andThen({
        perform: [
          reloadThePage(),
        ],
        observe: [
          noEngagementLevelsSelected(FakeLearningArea(1))
        ]
      })
  ])

function increaseEngagementLevel(learningArea: TestLearningArea, engagementLevelButton: string): Action<TestContext> {
  return step(`Clicked '${engagementLevelButton}' for ${learningArea.title}`, async (testContext) => {
    await testContext.display
      .select("article", { withText: learningArea.title })
      .selectDescendantWithText(engagementLevelButton)
      .click()
    await testContext.display
      .select("article", { withText: learningArea.title })
      .selectDescendantWithText(engagementLevelButton)
      .isHidden()
  })
}

