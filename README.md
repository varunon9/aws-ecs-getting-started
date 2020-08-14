# aws-ecs-getting-started
Getting started with AWS ECS | Deployment in production

## Prerequisite

1. [Install aws CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
2. [Install docker](https://docs.docker.com/engine/install/)
3. [Configure aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html): `aws configure`

## ECR

### Building docker image

1. Clone the repository `git clone https://github.com/varunon9/aws-ecs-getting-started.git`
2. Move to project `cd aws-ecs-getting-started`
3. Build docker image `docker build -t aws-ecs-getting-started .`
4. Verify that image has been successfully created `docker images --filter reference=aws-ecs-getting-started`
5. Verify that you can run it `docker run -t -i -p 3000:3000 aws-ecs-getting-started` and visiting http://localhost:3000/

### Authenticating docker to Amazon ECR registry

1. Make sure that your IAM user has ECR access (AmazonEC2ContainerRegistry* policy)
2. `aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com`
3. In above command replace <region> with your aws region e.g. ap-south-1 and replace <aws_account_id> with your AWS account ID.
4. You can find your AWS account ID from `consoleLoginLink` field of your aws IAM credentials. Visit [this](https://docs.aws.amazon.com/AmazonECR/latest/userguide/get-set-up-for-amazon-ecr.html) for more details.  

### Creating ECR repository (only one time)

```
aws ecr create-repository \
    --repository-name aws-ecs-getting-started \
    --image-scanning-configuration scanOnPush=true \
    --region <region>
```

This can also be done manually from [ECR console](https://ap-south-1.console.aws.amazon.com/ecr/home). Do note that for above command to work, your IAM user must have write access to ECR. 

### Pushing image to ECR

1. Tag the image `docker tag aws-ecs-getting-started:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/aws-ecs-getting-started:latest`
2. Push the image `docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/aws-ecs-getting-started:latest`
3. Check [docs](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html) for full reference

## ECS

### Creating Cluster

1. Make sure that your IAM user has ECS access (AmazonECS* policy)
2. `aws ecs create-cluster --cluster-name fargate-cluster`

### Register a Task Definition

