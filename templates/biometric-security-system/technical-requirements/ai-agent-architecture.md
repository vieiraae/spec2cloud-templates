
# AI Agent Technical Requirements

## Architecture

- Web UI with a chat interface that allows the user to retrieve weather information. The UI frontend will call the agent backend trough an API.
- Backend with the AI Agent implemention using the Microsoft Agent Framework and the Azure AI Agent Service. The agent will invoke the Weather MCP tool to retrieve live weather information for the city specified in the chat prompt
- Custom MCP server with mocked/random weather information for a given city using stremable HTTP
- Azure AI Foundry with a model deployment that will be used to assist the user getting weather information

## Components

- The UI should Next.js + Tailwind and it should present a good looking weather theme
- The backend should be developed in Python using the Microsoft Agent Framework and use the Azure AI Agent Service
- The Weather MCP Server should be developed in Python using FastMCP and the streamable HTTP protocol

## Infrastructure

Azure will be used to provide the following services under the resource group lab-weather-agent in the eastus2 region. All the following resources should be deployed in the same region as the resource group:
- Azure AI Foundry service, with a default project named default and with the model gpt-4.1 deployed.
- Azure Container App environment in the consumption Plan with a container app for the backend agent and another one for the weather MCP server
- Azure Container Registry connected to Azure Container Apps

## Deployment

BICEP will be used to provision the infrastructure on Azure with the Azure Developer CLI. The container apps will use cloud build so that docker is not needed in the local machine. 
The frontend with the UI, the backend agent and the weather MCP servers should be deployed to container apps and the endpoints should be updated accordingly. When the deployment finishes a working weather APP should be available to the user.
