# Learn / Do / Share

An app to keep track of what you're learning.


### Get Started

```
$ npm install
```


### Run Locally

```
$ npm run start
```


### Run Tests

```
$ npm run test
```

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


### Deploy Infrastructure

We are currently deploying our app to Azure. We are using Terraform to manage that
infrastructure. The terraform files are in `terraform`. To run Terraform locally,
first install the Azure CLI and Terraform. Then, one time only I think, init Terraform:

```
$ cd terraform
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
