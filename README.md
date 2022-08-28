# Learn / Do / Share

An app to keep track of what you're learning.


### Get Started

This project uses Node 16+, so you should install that.

Install the [Azure functions core tools](https://github.com/Azure/azure-functions-core-tools)
globally, then install the dependencies with:

```
$ npm install
```

You may also need to install terraform globally.


### Run Locally

```
$ npm run start
```


### Run Tests

There are two main parts to the test suite: 'integration' tests and 'unit' tests. The integration tests use the Azure Functions Core Tools, the Azure Static Web App Simulator, and a fake CosmosDB in an attempt to simulate the full stack of the application. The unit tests test the UI portion of the app in isolation from the backend. We use Playwright to run tests in a real browser environment.

To run all the tests:

```
$ npm run test
```

To run the integration tests:

```
$ npm run test:integration
```

To run the unit tests:

```
$ npm run test:unit
```

Both the integration and the unit tests can be run in 'debug' mode, which shows the tests running
in the browser:

```
$ npm run test:unit:debug
$ npm run test:integration:debug
```

To debug a particular unit test, it can be helpful to use Playwright's `pause` command. Just
insert `await page.pause()` into the test at the point you want to stop things.

There's also another set of unit tests that can be run with `npm run test:unit:tl`. This is the
same set of unit tests for the display, written using testing-library and the userEvent library.
The point of this test suite is just to experiment with testing-library and compare its
performance with the unit tests run using playwright.


### Typescript

Note that our code is written with Typescript, but we use tooling that's based on
esbuild to run our tests. This means that type checking does not occur when the
tests are run. It's faster, but there could be weird errors that take longer to
find. To check the types:

```
$ npm run validate
```


### Deploy

We have a github action that validates types, runs the tests, builds and deploys
our software to Azure as a static web app with a serverless function for the backstage
component. This all occurs via a github action that's defined in `.github/workflows`.


### Deploy a Preview Environment

Azure has the concept of preview environments. To create one, put your changes on a
branch and create a pull request to the main branch. This will automatically trigger
the workflow and deploy the changes in the pull request at a new (preview) url.

When you're done, merge the changes into master and close the pull request.
You'll need to go to the Azure portal and manually delete the preview environment.


### Deploy Infrastructure

We are currently deploying our app to Azure. We are using Terraform to manage that
infrastructure. The terraform files are in `terraform`. To run Terraform locally,
first install the Azure CLI and Terraform. Then, one time only I think, init Terraform:

```
$ cd ./azure/terraform
$ terraform init
$ az login
$ GITHUB_TOKEN=<some github token> terraform plan
```

A valid github token with repo access is needed to run terraform since it needs
to check on the status of a github actions secret.

Ordinarily, though, the terrform should be updated only via the github action. When
you make a change to any of the files in the terraform directory, be sure to run `plan`
first and then when you commit and push, a github action will run to automatically
apply the changes. Right now, there's no check on this, so whatever terraform says to
do will happen.
