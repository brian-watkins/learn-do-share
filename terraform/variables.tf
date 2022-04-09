variable "resource_group_name" {
  default = "Learn-Do-Share"
}

variable "resource_group_location" {
  default = "eastus2"
}

variable "cosmos_db_account_name" {
  default = "lds-database"
}

variable "github_token" {
  description = "GitHub access token used to configure the provider"
}