# Argo CD deployment (CD) for CineVision

This folder provides Argo CD resources to continuously deploy the manifests under `k8s/` from this Git repo.

## What you get
- AppProject `cinevision` (limits sources and destinations)
- Application `cinevision` which tracks `main` branch at path `k8s/`
- Automated sync: prune + selfHeal enabled

## Install Argo CD (dev/minikube)
```powershell
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait until all Argo CD pods are ready
kubectl get pods -n argocd -w
```

## Access Argo CD UI
```powershell
kubectl port-forward -n argocd svc/argocd-server 8088:80
# Open http://localhost:8088
```
Default admin password (first time):
- PowerShell (Windows):
```powershell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | ForEach-Object { [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }
```
- bash (macOS/Linux):
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d; echo
```

## Register this repo in Argo CD
Apply project and application:
```powershell
kubectl apply -f k8s/argocd/project.yaml
kubectl apply -f k8s/argocd/application.yaml
```
Argo CD will auto-sync and deploy everything under `k8s/` into namespace `cinevision`.

## Notes
- The Application is set to `CreateNamespace=true` to auto-create `cinevision` if missing.
- To change branch or path, edit `k8s/argocd/application.yaml` (targetRevision/path).
- For private repos, configure a repository credential/secret in Argo CD or use a GitHub App integration.
