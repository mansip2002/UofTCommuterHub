
# Frontend
az containerapp up \
  --name 'uoft-commuter-hub' \
  --resource-group 'expensify-temp' \
  --location eastus \
  --environment 'uoft-commuter-hub-env' \
  --context-path . \
  --source . \
  --ingress external \
  --target-port 10000
  
# Backend (ensure to update the BASE_URL env variable before running)
az containerapp up \
  --name 'maryam-capstone-backend' \
  --resource-group 'expensify-temp' \
  --location eastus \
  --environment 'maryam-capstone-backend-env' \
  --context-path api \
  --source api \
  --ingress external \
  --target-port 5000 