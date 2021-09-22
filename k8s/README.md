# node-example.juffalow.com

## Build, tag and push

```shell
docker build -t juffalow/node-express-kubernetes-example .

docker tag juffalow/node-express-kubernetes-example registry.digitalocean.com/juffalow/node-express-kubernetes-example:latest

docker push registry.digitalocean.com/juffalow/node-express-kubernetes-example:latest
```

## Kubernetes setup

```shell
kubectl apply -f ./secret.yaml

kubectl apply -f ./deployment.yaml

kubectl apply -f ./service.yaml

kubectl apply -f ./ingress.yaml

kubectl apply -f ./production_issuer.yaml
```

## Get current setup

```shell
kubectl get deployment node-express-kubernetes-example-deployment -o wide
```

## Logs

```shell
kubectl logs -f -l app=node-express-kubernetes-example-deployment
```

## Re-deploy

```shell
kubectl rollout restart deployment/node-express-kubernetes-example-deployment
```

## Deploy a specific version / tag

```shell
kubectl set image deployment/node-express-kubernetes-example-deployment node-express-kubernetes-example-application=registry.digitalocean.com/juffalow/node-express-kubernetes-example:<tag>
```
