terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "lds-tf"
    storage_account_name = "lds935433"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

provider "github" {
  owner = "brian-watkins"
}


# Cosmos DB

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.resource_group_location
}

resource "azurerm_cosmosdb_account" "cosmosdb" {
  name                      = var.cosmos_db_account_name
  location                  = azurerm_resource_group.rg.location
  resource_group_name       = azurerm_resource_group.rg.name
  offer_type                = "Standard"
  kind                      = "GlobalDocumentDB"
  enable_automatic_failover = false

  # Note that the first ip address is my IP (probably not the greatest idea but whatever)
  # The next 5 ip addresses are to allow access from Azure Portal
  # The 0.0.0.0 block allows access from within Azure Data centers only
  # See https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-configure-firewall
  ip_range_filter = "73.114.216.99,104.42.195.92,40.76.54.131,52.176.6.30,52.169.50.45,52.187.184.26,0.0.0.0"

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = var.resource_group_location
    failover_priority = 0
  }

  capabilities {
    name = "EnableServerless"
  }
}

resource "azurerm_cosmosdb_sql_database" "db" {
  name                = "lds"
  resource_group_name = azurerm_cosmosdb_account.cosmosdb.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
}

resource "azurerm_cosmosdb_sql_container" "engagement_plans_container" {
  name                = "engagement-plans"
  resource_group_name = azurerm_cosmosdb_account.cosmosdb.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_path  = "/userId"
}

resource "azurerm_cosmosdb_sql_container" "engagement_notes_container" {
  name                = "engagement-notes"
  resource_group_name = azurerm_cosmosdb_account.cosmosdb.resource_group_name
  account_name        = azurerm_cosmosdb_account.cosmosdb.name
  database_name       = azurerm_cosmosdb_sql_database.db.name
  partition_key_path  = "/userId"
}

# Application Insights

resource "azurerm_log_analytics_workspace" "logs" {
  name                = "lds-logs"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
}

resource "azurerm_application_insights" "metrics" {
  name                = "lds-appinsights"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.logs.id
  application_type    = "web"
}


# Static Web App

resource "azurerm_static_site" "display" {
  name                = "lds-display"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
}

resource "azurerm_resource_group_template_deployment" "display-config" {
  deployment_mode     = "Incremental"
  name                = "display-config"
  resource_group_name = azurerm_resource_group.rg.name

  template_content = file("display_template.json")
  parameters_content = jsonencode({
    staticSites_display_name = {
      value = azurerm_static_site.display.name
    },
    appInsightsKey = {
      value = azurerm_application_insights.metrics.instrumentation_key
    },
    cosmosDBEndpoint = {
      value = azurerm_cosmosdb_account.cosmosdb.endpoint
    },
    cosmosDBReadWriteKey = {
      value = azurerm_cosmosdb_account.cosmosdb.primary_key
    }
  })
}


# GitHub Action Secrets

resource "github_actions_secret" "api-key" {
  repository      = "learn-do-share"
  secret_name     = "AZURE_STATIC_WEB_APPS_API_KEY"
  plaintext_value = azurerm_static_site.display.api_key
}

resource "github_actions_secret" "app-insights-connection-string" {
  repository      = "learn-do-share"
  secret_name     = "VITE_APP_INSIGHTS_CONNECTION_STRING"
  plaintext_value = azurerm_application_insights.metrics.connection_string
}

resource "github_actions_secret" "cosmosdb-endpoint" {
  repository      = "learn-do-share"
  secret_name     = "COSMOS_DB_ENDPOINT"
  plaintext_value = azurerm_cosmosdb_account.cosmosdb.endpoint
}

resource "github_actions_secret" "cosmosdb-key" {
  repository      = "learn-do-share"
  secret_name     = "COSMOS_DB_READ_WRITE_KEY"
  plaintext_value = azurerm_cosmosdb_account.cosmosdb.primary_key
}

resource "github_actions_secret" "cosmosdb-name" {
  repository      = "learn-do-share"
  secret_name     = "COSMOS_DB_NAME"
  plaintext_value = azurerm_cosmosdb_sql_database.db.name
}
