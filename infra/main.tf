terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=3.0.0"
    }
  }
}


provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-gym-partner-app"
  location = var.location
}

resource "azurerm_static_site" "gym-partner-swa" {
  name                = "gym-partner-app"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_tier            = "Free"
}

resource "azurerm_consumption_budget_subscription" "monthly_budget" {
  name            = "gym-partner-budget"
  subscription_id = var.subscription_id

  amount   = var.budget_amount
  time_grain = "Monthly"

  time_period {
    start_date = formatdate("YYYY-MM-DD", timestamp())
  }

  notification {
    enabled        = true
    threshold      = 80  # Notify at 80% of budget
    operator       = "GreaterThan"
    contact_emails = var.alert_emails
    contact_groups = []
  }
}
