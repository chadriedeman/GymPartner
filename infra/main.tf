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
  name     = "rg-gympartner-swa"
  location = "eastus"
}

resource "azurerm_static_site" "gympartner_swa" {
  name                = "gympartner-static-webapp-${random_id.suffix.hex}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku_tier            = "Free"

  repository_url = "https://github.com/chadriedeman/GymPartner"
  branch         = "main"

  # You can set the app_location, api_location, output_location if you want:
  # app_location    = "/"
  # api_location    = "api"
  # output_location = "build"
}

resource "random_id" "suffix" {
  byte_length = 3
}