# SimpleTimeService

A production-ready microservice that returns the current timestamp and the requester's IP address. This project includes the application code, containerization setup, and Terraform IaC for deploying to AWS.

## Architecture Description

The application is deployed using **AWS ECS Fargate**, which is a serverless managed container service.

### Key Components:
- **VPC Layer**: A custom VPC with 2 Public Subnets and 2 Private Subnets across two Availability Zones for high availability.
- **Compute Layer**: ECS Fargate tasks running in **Private Subnets**. This ensures the application is not directly reachable from the internet, complying with security best practices.
- **Networking Layer**: An **Application Load Balancer (ALB)** in the Public Subnets acts as the entry point. It handles incoming HTTP traffic and routes it to the Fargate tasks.
- **Outbound Traffic**: A **NAT Gateway** in the Public Subnet allows private tasks to pull Docker images from DockerHub and perform other outbound tasks while remaining unreachable from the outside.
- **Security**: Security Groups strictly limit traffic. Only the ALB can access the container port (3000) of the Fargate tasks.

### Why this architecture?
I chose **ECS Fargate** because:
1. It is **serverless**, meaning no EC2 instances to manage or patch.
2. It natively supports **private subnet execution**, meeting the core requirement.
3. It integrates seamlessly with **AWS ALB** for robust load balancing and health checks.
4. It is faster to set up and more cost-effective for a single microservice compared to a full Kubernetes cluster (EKS).

## Project Structure
```text
.
├── app
│   ├── index.js          # App logic
│   ├── package.json      # Dependencies
│   └── Dockerfile        # Container definition (Non-root user)
└── terraform
    ├── main.tf           # Provider config
    ├── vpc.tf            # Network infrastructure
    ├── ecs.tf            # Container orchestration
    ├── alb.tf            # Load balancing
    ├── security.tf       # Firewall rules
    ├── variables.tf      # Variable definitions
    └── terraform.tfvars  # Configuration values
```

## Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- AWS Account and [CLI](https://aws.amazon.com/cli/) configured with local credentials.

## Deployment Instructions

### 1. Containerize the Application
Build and push the image to DockerHub (replace `YOUR_DOCKERHUB_USERNAME` with your actual username):
```bash
cd app
docker build -t YOUR_DOCKERHUB_USERNAME/simple-time-service:latest .
docker push YOUR_DOCKERHUB_USERNAME/simple-time-service:latest
```

### 2. Infrastructure Deployment
Navigate to the terraform directory:
```bash
cd terraform
```

Initialize Terraform:
```bash
terraform init
```

Review the execution plan:
```bash
terraform plan
```

Apply the changes:
```bash
terraform apply
```

### 3. Access the Application
Once the `apply` is complete, Terraform will output the `alb_hostname`. Access it in your browser or via curl:
```bash
curl http://<alb_hostname>
```

## Acceptance Criteria Check
- [x] **Registry**: Image is publicly available on DockerHub.
- [x] **JSON Response**: Returns `timestamp` and `ip`.
- [x] **Non-root user**: Dockerfile uses `USER appuser`.
- [x] **Small Image**: Uses `node:slim` multi-stage build.
- [x] **Private Subnets**: Compute resources run exclusively in private subnets.
- [x] **Terraform Only**: Infrastructure is fully automated via `terraform apply`.
