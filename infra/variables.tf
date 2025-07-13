variable "alert_emails" {
  description = "List of emails to notify for budget alerts"
  type        = list(string)
  default     = ["chad.riedeman@gmail.com"]
}

variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "eastus"
}

variable "budget_amount" {
  description = "Monthly budget in dollars"
  type        = number
  default     = 1
}

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}