# aws-ecs-getting-started
Getting started with AWS ECS | Deployment in production

## Prerequisite

1. [Install aws CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. [Install docker](https://docs.docker.com/engine/install/)
3. [Configure aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html): `aws configure`

![docker and aws cli version check](./screenshots/aws-docker-cli-version.png)

## ECR

### Building docker image

1. Clone the repository `git clone https://github.com/varunon9/aws-ecs-getting-started.git`
2. Move to project `cd aws-ecs-getting-started`
3. Build docker image `docker build -t aws-ecs-getting-started .`
4. Verify that image has been successfully created `docker images --filter reference=aws-ecs-getting-started`
5. Verify that you can run it `docker run -t -i -p 3000:3000 aws-ecs-getting-started` and visiting http://localhost:3000/

![docker run](./screenshots/docker-images-run.png)

### Authenticating docker to Amazon ECR registry

1. Make sure that your IAM user has ECR access (AmazonEC2ContainerRegistry* policy)
2. `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com`
3. In above command replace `<region>` with your aws region e.g. ap-south-1 and replace `<aws_account_id>` with your AWS account ID.
4. You can find your AWS account ID from `consoleLoginLink` field of your aws IAM credentials. Visit [this](https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html) for more details.  

### Creating ECR repository (only one time)

```
aws ecr create-repository \
    --repository-name aws-ecs-getting-started \
    --image-scanning-configuration scanOnPush=true \
    --region <region>
```

In above command replace `<region>` with your aws region. This can also be done manually from [ECR console](https://ap-south-1.console.aws.amazon.com/ecr/home).
Do note that for above command to work, your IAM user must have write access to ECR. 

### Pushing image to ECR

1. Tag the image `docker tag aws-ecs-getting-started:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/aws-ecs-getting-started:latest`
2. Push the image `docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/aws-ecs-getting-started:latest`
3. Check [docs](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html) for full reference

![Push docker image to ECR](./screenshots/docker-push-image.png)

## ECS

### Creating Cluster

1. Make sure that your IAM user has ECS access (AmazonECS* policy)
2. `aws ecs create-cluster --cluster-name fargate-cluster`

![Creating cluster](./screenshots/create-cluster.png)

### Register a Task Definition

1. Visit [Cloudwatch console](https://ap-south-1.console.aws.amazon.com/cloudwatch/home) and create a log group `/ecs/aws-ecs-getting-started`.
2. Edit `fargate-task.json` file and replace all occurence of `<aws_account_id>` with your AWS account ID and `<region>` with your aws region
3. `aws ecs register-task-definition --cli-input-json file:///home/varunkumar/Desktop/github/aws-ecs-getting-started/fargate-task.json`
4. Do note that in above command , I have specified full path of fargate-task.json file
5. Once task definition registration is complete, you can use `aws ecs list-task-definitions` to verify

![list-task-definitions](./screenshots/list-task-definitions.png)

### Creating Service

```
aws ecs create-service \
--cluster fargate-cluster \
--service-name fargate-service \
--task-definition fargate-getting-started:1 \
--desired-count 1 \
--launch-type "FARGATE" \
--network-configuration "awsvpcConfiguration={subnets=[subnet-0709b5cf9b2d2307e,subnet-0f6d05d93d223f83d],securityGroups=[sg-0f81747b2bb8d612b],assignPublicIp=ENABLED}"
```

In above command replace `subnet-0709b5cf9b2d2307e & subnet-0f6d05d93d223f83d` with your Subnet IDs and `sg-0f81747b2bb8d612b` with your Security group ID. Visit [AWS VPC console](https://ap-south-1.console.aws.amazon.com/vpc/home) for details.
All the subnet IDs as well as security group must be from the same VPC. Make sure to allow inbound traffics from port 3000 in security group because this is where our app will run.

![security-group](./screenshots/security-group.png)

You can verify service creation using `aws ecs list-services --cluster fargate-cluster`

![list-services](./screenshots/list-services.png)

### Describe the Runing Service

1. To get more information `aws ecs describe-services --cluster fargate-cluster --services fargate-service`

### Visiting the app

Visit [ECS console](https://ap-south-1.console.aws.amazon.com/ecs/home) to check the cluster, service and task definition that we just created. In tasks subtab, you can see that our task is running. From Network section, you can grab public IP of task and visit it on port 3000.
In my case it is http://13.235.0.104:3000/

![network-public-ip](./screenshots/network-public-ip.png)

### Checking the logs

You can check all logs of this task under logs subtab or on [Cloudwatch console](https://ap-south-1.console.aws.amazon.com/cloudwatch/home)

![cloudwatch-logs](./screenshots/cloudwatch-log.png)

### Deploy after changing codebase

If you make change to your codebase (node app), you can follow following steps to re-deploy it-

1. Rebuild image `docker build -t aws-ecs-getting-started .`
2. Tag it `docker tag aws-ecs-getting-started:latest <aws_account_id>.dkr.ecr.ap-south-1.amazonaws.com/aws-ecs-getting-started:1.1`
3. Push image to ECR `sudo docker push <aws_account_id>.dkr.ecr.ap-south-1.amazonaws.com/aws-ecs-getting-started:1.1`
4. Edit `fargate-task.json` file with updated image (the one that you just pushed to ECR) and update task definition using `aws ecs register-task-definition --cli-input-json file:///home/varunkumar/Desktop/github/aws-ecs-getting-started/fargate-task.json`
5. List task definitions to get latest revision `aws ecs list-task-definitions`
6. Update service to use new task definition `aws ecs update-service --service fargate-service --task-definition fargate-getting-started:3 --cluster fargate-cluster`

## Cleaning UP

1. Delete the service `aws ecs delete-service --cluster fargate-cluster --service fargate-service --force`
2. Delete the cluster `aws ecs delete-cluster --cluster fargate-cluster`