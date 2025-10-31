# Kubernetes deployment for CineVision

This folder contains a simple, dev‑friendly Kubernetes setup for running the full stack on a local cluster (e.g., Minikube or kind).

## What’s included

- Namespace: `cinevision`
- Infra (single‑replica for dev): Postgres, Zookeeper, Kafka, Zipkin, Redis, MongoDB, Mongo Express, Keycloak
- Applications: `eureka-server`, `api-gateway`, `movie-service`, `user-service`, `email-service`, `frontend`
- Service types:
  - ClusterIP: internal services
  - NodePort: `frontend` (30000), `api-gateway` (30080) for easy local access

## Prerequisites

- Docker and a local k8s (Minikube or kind)
- Images built locally for each app:
  - cinevision/eureka-server:local
  - cinevision/api-gateway:local
  - cinevision/movie-service:local
  - cinevision/user-service:local
  - cinevision/email-service:local
  - cinevision/frontend:local

You can build them from the repo root using Dockerfiles already added:

```powershell
# From repo root
# Build backend services
docker build -t cinevision/eureka-server:local -f eureka-server/Dockerfile .
docker build -t cinevision/api-gateway:local -f api-gateway/Dockerfile .
docker build -t cinevision/movie-service:local -f movieService/Dockerfile .
docker build -t cinevision/user-service:local -f userService/Dockerfile .
docker build -t cinevision/email-service:local -f emailService/Dockerfile .

# Build frontend (Nginx)
docker build -t cinevision/frontend:local -f frontend/Dockerfile ./frontend
```

If you use Minikube, load images into the cluster:

```powershell
minikube start
minikube image load cinevision/eureka-server:local
minikube image load cinevision/api-gateway:local
minikube image load cinevision/movie-service:local
minikube image load cinevision/user-service:local
minikube image load cinevision/email-service:local
minikube image load cinevision/frontend:local
```

## Deploy

```powershell
kubectl apply -k k8s
```

Wait until all pods are running:

```powershell
kubectl get pods -n cinevision -w
```

## Access

- Frontend: http://$(minikube ip):30000
- API Gateway: http://$(minikube ip):30080
- Eureka: `kubectl port-forward -n cinevision svc/eureka-server 8761:8761` then http://localhost:8761
- Zipkin: `kubectl port-forward -n cinevision svc/zipkin 9411:9411` then http://localhost:9411
- Mongo Express: `kubectl port-forward -n cinevision svc/mongo-express 8091:8081` then http://localhost:8091
- Keycloak: `kubectl port-forward -n cinevision svc/keycloak 8181:8080` then http://localhost:8181

## Notes

- Environment variables are wired for in‑cluster DNS names (e.g., `postgres:5432`, `kafka:9092`, `http://eureka-server:8761/eureka`).
- For real environments, prefer Helm charts for Kafka/Keycloak/Databases and add persistence, probes, resources, secrets, and ingress.
- If services fail on missing configs, check the Spring `application.yml` for extra envs and add them into the corresponding Deployment.
