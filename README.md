# Node Express Kubernetes Example

Simple NodeJS application to explain basic parts of Kubernetes.

* [Run simple Node.js application in Kubernetes cluster (DigitalOcean)](https://juffalow.com/blog/javascript/run-simple-node-application-in-kubernetes-cluster)

## Routes

The `/app-id` route returns random string generated on application start, so that user can see if he is connecting to different pods (containers).

```json
{"appId":"1.13.647"}
```

Another request should return a different number in the end.

```json
{"appId":"1.13.539"}
```

The `/evn/:name` route returns environment variable as a proof that the application has access to values passed from *Kubernetes Secret*. For example you can try `/env/secretParameter`.

```json
{"secretParameter":"DatabaseCredentials"}
```

## Test readiness probe

If starting of a *pod* can take some time, you can define a `readinessProbe`. This is also usable if the *pod* has some unfinished work and is not available to receive any other requests. The check in this case is set to http get, so if it returns http status code `200` kubernetes will include the *pod* and if it returns status code `500` it will exclude the *pod*.

You can test it by refreshing the page and checking the `appId` and then visit [http://&lt;IP address&gt;/ready/toggle](https://kubernetes.kontentino.dev/ready/toggle), which will toggle the readiness for 10 seconds. During this time one of the app ids should not occure again.

## Test liveness probe

If some fatal error occured or something else that actually blocked the whole process and the app is basically dead, the `livenessProbe` check detects it and restarts the *pod*. To see this in action, you need to check *pods*:

```shell
kubectl get pods
```

This will return:

```
NAME                                                 READY   STATUS    RESTARTS   AGE
node-docker-kubernetes-deployment-78f7d56b4b-2sg69   1/1     Running   0          5m37s
node-docker-kubernetes-deployment-78f7d56b4b-d8n9h   1/1     Running   0          5m26s
```

If you visit [http://&lt;IP address&gt;/alive/toggle](https://kubernetes.kontentino.dev/alive/toggle) and refresh the app a few times, one of the ids should not occure for a while. And if you check the *pods* again, the `restarts` info in one of the *pods* should show you `1`:

```
NAME                                                 READY   STATUS    RESTARTS   AGE
node-docker-kubernetes-deployment-78f7d56b4b-2sg69   1/1     Running   1          5m37s
node-docker-kubernetes-deployment-78f7d56b4b-d8n9h   1/1     Running   0          5m26s
```

## Test

```js
let number = 0;

const load = async () => {
  return fetch('https://node-test.kontentinoservices.dev/app-id')
    .then(response => response.json())
    .then((data) => {
      console.log(`${number} App ID: ${data.appId}`);
    });
}

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

while (true) {
  number++;
  await load();
  await sleep(1000);
}
```

## Links

* [Kubernetes Tutorial - Step by Step Introduction to Basic Concepts](https://auth0.com/blog/kubernetes-tutorial-step-by-step-introduction-to-basic-concepts/)
* [Use Images in Your Registry with Kubernetes](https://www.digitalocean.com/docs/images/container-registry/quickstart/#use-images-in-your-registry-with-kubernetes)
* [Docker best practices with Node.js](https://dev.to/nodepractices/docker-best-practices-with-node-js-4ln4)
* [Node.js Best Practices - Docker](https://github.com/goldbergyoni/nodebestpractices/tree/master/sections/docker)

## License

[MIT license](./LICENSE)
