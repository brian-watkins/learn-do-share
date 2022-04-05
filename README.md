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
```

Then, to update, make sure to login to Azure and just run terraform apply:

```
$ cd terraform
$ az login
$ terraform apply
```

We hope to automate this with a github action at some point.