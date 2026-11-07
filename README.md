# 004

## Jenkins prerequisites

Jenkins is available at [http://localhost:8090](http://localhost:8090). It runs
in Docker, leaving the existing services on ports 8080 and 8081 untouched.
Jenkins data is stored in the persistent `jenkins_home` Docker volume.

The initial setup unlock password is saved locally in
`C:\Users\Student\jenkins-004-credentials.txt`, outside this Git repository.
This is the one-time setup password, not the administrator password you choose
during setup. Do not copy passwords into tracked project files.

### Start Jenkins

From this repository in PowerShell:

```powershell
docker compose up -d --build
docker compose logs -f jenkins
```

Wait for Jenkins to start, then press Ctrl+C to stop following the logs (the
container keeps running). Open [http://localhost:8090](http://localhost:8090)
and get the initial unlock password with:

```powershell
docker compose exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Complete Jenkins' first-run setup and create an administrator account. The
Pipeline, Git, NodeJS, and Copy Artifact plugins are included in the image.

### Configure Node.js

In Jenkins, open **Manage Jenkins > Tools > NodeJS installations**, add an
installation named `NodeJS-22`, enable automatic installation, and select a
Node.js 22.x version. The CI pipeline refers to this exact tool name.

### Docker and application ports

The Jenkins container includes the Docker CLI and accesses the local Docker
daemon through its socket. This is required by the activity's CD pipeline.
Only Jenkins' web interface is published, and it is bound to localhost. Anyone
able to administer this Jenkins instance can control the local Docker daemon;
keep it for trusted local use.

Apache already uses port 8080 on this machine. When configuring deployment,
publish the app container on another available port (for example, `8082:80`)
and open `http://localhost:8082`.

### React app and test

This repository includes a React and TypeScript task tracker, automated
interaction tests, and an Nginx `Dockerfile` for deploying the built app.

Install dependencies and run the test and production build locally:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
```

To run the app locally, start the Vite development server:

```powershell
npm.cmd run dev
```

The test verifies task creation and validation, completing tasks, and filtering
the checklist. The CI job should check out this repository, run
`npm install`, `npm test -- --run`, and `npm run build`, then archive `dist`
and `Dockerfile` together. After creating and pushing a repository for this
project, use its Git URL as the CI job's source repository.

### Stop Jenkins

```powershell
docker compose down
```

This preserves Jenkins configuration and build history in `jenkins_home`.
To remove that data as well, explicitly remove the volume with
`docker compose down --volumes`.