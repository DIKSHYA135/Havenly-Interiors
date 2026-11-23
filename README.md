# Havenly Interiors — Full-Stack Luxury Interior Design Platform

A bespoke, full-stack luxury interior design and architectural practice web application. Built with **React 19**, **TypeScript**, and **Vite** on the frontend, a **Node.js** and **Express.js** REST API on the backend, and **MongoDB Atlas** for permanent cloud data storage.

Deployed to **Amazon Web Services (AWS) EC2** using **AWS CloudFormation (Infrastructure-as-Code)**, **Nginx** reverse proxy, **PM2** process management, and automated **GitHub Actions CI/CD**.

---

## 🏛️ Architecture Overview

```
                                [ CLIENT BROWSER ]
                                        │
                                        │ Public HTTP (Port 80) / HTTPS (Port 443)
                                        ▼
                      ┌───────────────────────────────────┐
                      │          AWS EC2 INSTANCE         │
                      │         (Ubuntu 24.04 LTS)        │
                      │                                   │
                      │   ┌───────────────────────────┐   │
                      │   │    NGINX (Reverse Proxy)  │   │
                      │   └─────────────┬─────────────┘   │
                      │                 │                 │
                      │    ┌────────────┴───────────┐     │
                      │    │                        │     │
                      │    ▼                        ▼     │
                      │  Static Build           Node API  │
                      │  (React/Vite SPA)       (Express) │
                      │  /var/www/app/dist      Port 5001 │
                      └─────────────────────────────┬─────┘
                                                    │
                                                    │ Mongoose TLS Connection
                                                    ▼
                                        [ MONGODB ATLAS CLOUD ]
                                        (Inquiries, Bookings, Admins)
```

### Key Architectural Layers:
1. **Frontend (React + Vite SPA):** Served by Nginx from `/var/www/app/dist` with client-side SPA routing fallback.
2. **Backend API (Node.js + Express):** Runs internally on port `5001`, managed by PM2 with automatic restart and reboot survival.
3. **Reverse Proxy (Nginx):** Public entry point on Port 80. Routes `/` to the React build and reverse-proxies `/api/` to Express on `127.0.0.1:5001`. Port 5001 is **never** exposed to the internet.
4. **Cloud Database (MongoDB Atlas):** Independent, 24/7 managed cloud database. Data persists across EC2 reboots and redeployments.
5. **CI/CD Pipeline (GitHub Actions):** Automatically tests, builds, provisions AWS infrastructure with CloudFormation, deploys code via SSH, and **fails the deployment** if the health check does not pass.

---

## 💰 AWS Cost & Free Tier Analysis

| AWS Resource | Configuration | Free Tier | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Amazon EC2** | `t2.micro` (1 vCPU, 1 GB RAM) | 750 hrs/month free (12 months) | **$0.00** |
| **EBS Storage** | 20 GB gp3 SSD | 30 GB/month free | **$0.00** |
| **Data Transfer** | Outbound HTTP/HTTPS | 100 GB/month free | **$0.00** |
| **CloudFormation** | Stack management | Always free | **$0.00** |
| **SSM Parameter Store** | SSH key storage (Standard tier) | 10,000 parameters free | **$0.00** |
| **MongoDB Atlas** | M0 Shared Cluster | Free forever (512 MB) | **$0.00** |
| **GitHub Actions** | CI/CD Runner | Unlimited for public repos | **$0.00** |
| **TOTAL** | | **Free Tier eligible** | **$0.00 / month** |

---

## 📁 Infrastructure Files

| File | Purpose |
| :--- | :--- |
| `infra/ec2-instance.yaml` | CloudFormation template: EC2 instance, security group (Ports 80, 443, 22), SSH KeyPair in SSM, and bootstrap UserData. |
| `infra/nginx.conf` | Nginx configuration: SPA routing, `/api/` reverse proxy to port 5001, gzip, security headers. |
| `backend/ecosystem.config.cjs` | PM2 configuration: Express on port 5001, fork mode, auto-restart, exponential backoff. |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD: build, test, provision CloudFormation, deploy via SSH, mandatory health verification. |

---

## 🛠️ Step-by-Step Production Deployment Guide

### Step 1: Set Up MongoDB Atlas (Cloud Database)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) (free).
2. Create a free **M0 cluster**.
3. Under **Security > Database Access**, create a database user with **Read and write to any database**.
4. Under **Security > Network Access**, add the EC2 instance's public IP address (or `0.0.0.0/0` temporarily during initial setup — **restrict this after deployment**).
5. Under **Deployment > Database**, click **Connect** > **Drivers** (Node.js) and copy the connection string:
   ```text
   mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/havenly_interiors?retryWrites=true&w=majority
   ```

> [!IMPORTANT]
> **MongoDB Atlas Network Access:** Using `0.0.0.0/0` (allow from anywhere) is acceptable for initial setup and AWS Learner Lab (where EC2 IPs change). For long-term production, restrict Network Access to your EC2 instance's public IP address. You can find the IP in the GitHub Actions deployment summary or in the AWS EC2 console.

---

### Step 2: Retrieve Your AWS Credentials

#### If using AWS Academy / Learner Lab:
1. Start your lab session.
2. Click **AWS Details** > **Show** (next to AWS CLI).
3. Copy the three values: `aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`.

#### If using a Standard Personal AWS Account:
1. Go to AWS Console > IAM > Users > Security credentials.
2. Create an **Access key** for CLI use.
3. Copy your `Access Key ID` and `Secret Access Key`.

---

### Step 3: Configure GitHub Repository Secrets & Variables (ALL REQUIRED)

Go to your GitHub repository **Settings > Secrets and variables > Actions**.

Under the **Secrets** tab, add **all** of the following:

| Secret Name | Required | Description |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | **Yes** | Your AWS access key ID |
| `AWS_SECRET_ACCESS_KEY` | **Yes** | Your AWS secret access key |
| `AWS_SESSION_TOKEN` | Learner Lab only | Your AWS session token (omit for standard accounts) |
| `MONGODB_URI` | **Yes** | Full MongoDB Atlas connection string (see Step 1) |
| `JWT_SECRET` | **Yes** | A secure random string, 32+ characters (used to sign admin JWT tokens) |
| `ADMIN_EMAIL` | **Yes** | Admin login email (e.g. `admin@havenlyinteriors.com`) |
| `ADMIN_PASSWORD` | **Yes** | Admin login password (choose a strong password) |

> [!CAUTION]
> The deployment workflow **will fail** if `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, or `ADMIN_PASSWORD` are missing. There are no hardcoded defaults. You must set all required secrets before deploying.

Under the **Variables** tab, add:
- **Name:** `AWS_REGION` — **Value:** `us-east-1` (or your chosen region)

---

### Step 4: Push to GitHub & Deploy

```bash
git add .
git commit -m "feat(aws): production deployment with CI/CD"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run backend tests against a CI MongoDB container.
2. Build the React/Vite frontend.
3. Validate that all required secrets are configured.
4. Provision or update the CloudFormation stack (EC2 + security group + SSH key).
5. SSH into EC2, pull code, install dependencies, write `.env`, seed admin, build frontend.
6. Configure Nginx and start the backend via PM2.
7. **Verify the public `/api/health` endpoint returns HTTP 200** — deployment fails if it does not.

---

### Step 5: Verify Live Application

1. Open the **Actions** tab on your GitHub repository.
2. Click on the completed workflow run.
3. The **Deployment Summary** shows your live URLs:
   - **Live Website:** `http://<EC2-PUBLIC-IP>`
   - **Admin Dashboard:** `http://<EC2-PUBLIC-IP>/admin`
   - **Health Check:** `http://<EC2-PUBLIC-IP>/api/health`

---

## 🔄 How to Update Your Website

1. Make edits locally and test with `npm run dev`.
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update portfolio and services"
   git push origin main
   ```
3. GitHub Actions automatically rebuilds, deploys, and verifies the health check.

---

## 🔧 Live Server Maintenance Commands

```bash
# PM2 status and logs
pm2 status
pm2 logs havenly-backend

# Restart backend
pm2 restart havenly-backend

# Nginx status and config test
sudo systemctl status nginx
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔒 Security Practices

- **No hardcoded secrets.** All credentials are injected via GitHub Secrets at deploy time. The `.env` file is created on EC2 with `chmod 600` and is excluded from git via `.gitignore`.
- **SSH keys are ephemeral.** The private key is retrieved from AWS SSM Parameter Store during deployment, used once, and securely deleted (`shred`) in an always-run cleanup step.
- **Port 5001 is not exposed.** The EC2 security group only opens ports 80 (HTTP), 443 (HTTPS), and 22 (SSH). Express is accessed only via Nginx reverse proxy on `127.0.0.1`.
- **Backend protections:** Rate limiting, Helmet security headers, CORS origin validation, bcrypt password hashing, JWT authentication.
- **MongoDB Atlas access:** Restrict Network Access to your EC2 public IP after initial deployment (do not leave `0.0.0.0/0` permanently in production).

---

## 🛑 How to Avoid Unnecessary AWS Charges

- **Pause:** In EC2 Console, select your instance > **Instance state** > **Stop instance**.
- **Delete everything:** In CloudFormation Console, select `havenly-stack` > **Delete**. This terminates the EC2 instance, deletes the security group, and removes the SSH key pair.

---

## 🔧 Troubleshooting

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| Workflow fails at "Validate required secrets" | Missing GitHub Secrets | Add all required secrets in Settings > Secrets |
| Health check fails after deployment | MongoDB Atlas unreachable from EC2 | Add EC2 public IP (or `0.0.0.0/0`) to Atlas Network Access |
| `502 Bad Gateway` on the live site | Backend crashed or not running | SSH in and run `pm2 logs havenly-backend` to check errors |
| SSH timeout during deployment | EC2 still initializing | Re-run the workflow; first boot takes a few minutes |
| Tests fail in CI | Backend code or test issues | Fix locally, run `npm run test:backend` with a local MongoDB |
| AWS credentials expired (Learner Lab) | Lab session timed out | Restart lab, copy new credentials, update GitHub Secrets |
