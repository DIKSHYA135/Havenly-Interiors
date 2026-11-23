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
1. **Frontend (React + Vite SPA):** Served directly by Nginx from `/var/www/app/dist` for instant static delivery and client-side routing.
2. **Backend API (Node.js + Express):** Runs internally on port `5001` managed by PM2. Handles inquiries, consultation bookings, and JWT-authenticated admin operations.
3. **Reverse Proxy (Nginx):** Public entry point on Port 80 (and 443). Routes `/` to the React build and reverse-proxies `/api/` to Express.
4. **Cloud Database (MongoDB Atlas):** Independent, 24/7 managed cloud database. Data is never lost even if the EC2 instance restarts or stops.
5. **CI/CD Pipeline (GitHub Actions):** Automatically tests, builds, provisions AWS infrastructure with CloudFormation, and deploys new code on every git push to `main`.

---

## 💰 AWS Cost & Free Tier Analysis (Estimated Costs)

Before provisioning resources, here is the transparent cost analysis:

| AWS Resource | Configuration | AWS Free Tier Eligibility | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Amazon EC2** | `t2.micro` (1 vCPU, 1 GB RAM) | **750 hours/month free** for first 12 months | **$0.00** (Free Tier)<br>*(~$8.35/mo outside free tier)* |
| **EBS Storage** | 20 GB gp3 SSD | **30 GB/month free** | **$0.00** (Free Tier) |
| **Data Transfer** | Outbound HTTP/HTTPS | **100 GB/month free** from AWS | **$0.00** |
| **CloudFormation** | Stacks and change sets | **100% Free** (No charge for CloudFormation itself) | **$0.00** |
| **SSM Parameter Store** | KeyPair storage (Standard) | **10,000 parameters free** | **$0.00** |
| **MongoDB Atlas** | M0 Shared Cluster | **100% Free Forever** (512 MB storage, shared RAM) | **$0.00** |
| **GitHub Actions** | CI/CD Runner | **Unlimited free** for public repos (2,000 mins/mo private) | **$0.00** |
| **TOTAL ESTIMATED COST** | Full-Stack Production | **Free Tier Eligible** | **$0.00 / month** |

---

## 📁 Infrastructure Files Overview

Your project contains 4 dedicated infrastructure files created specifically for Havenly Interiors:

| File Path | Purpose |
| :--- | :--- |
| [`infra/ec2-instance.yaml`](file:///Users/dikshyashreesh/Desktop/Havenly%20interior/infra/ec2-instance.yaml) | CloudFormation template that provisions the EC2 instance, security group (Ports 80, 443, 22), automated KeyPair in SSM Parameter Store, and instance bootstrap UserData. |
| [`infra/nginx.conf`](file:///Users/dikshyashreesh/Desktop/Havenly%20interior/infra/nginx.conf) | Production Nginx web server configuration with SPA routing fallback, `/api/` reverse proxying to `5001`, `/uploads/` proxy, gzip compression, and security headers. |
| [`backend/ecosystem.config.cjs`](file:///Users/dikshyashreesh/Desktop/Havenly%20interior/backend/ecosystem.config.cjs) | PM2 configuration file for the Express backend running on internal port `5001` with `exec_mode: 'fork'` (optimized for single-core `t2.micro`). |
| [`.github/workflows/deploy.yml`](file:///Users/dikshyashreesh/Desktop/Havenly%20interior/.github/workflows/deploy.yml) | GitHub Actions CI/CD pipeline that builds, tests, provisions CloudFormation, connects via SSH, deploys code, and verifies health. |

---

## 🛠️ Step-by-Step Production Deployment Guide

Follow these 5 beginner-friendly steps to launch your application on AWS:

### Step 1: Set Up MongoDB Atlas (Cloud Database)
1. Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 cluster**.
3. Under **Security > Database Access**, create a user (e.g. `havenly_user` with a secure password). Grant **Read and write to any database**.
4. Under **Security > Network Access**, click **Add IP Address** > choose **Allow Access from Anywhere** (`0.0.0.0/0`) > click **Confirm**.
5. Under **Deployment > Database**, click **Connect** > choose **Drivers** (Node.js).
6. Copy the connection string and format it with your database name `havenly_interiors`:
   ```text
   mongodb+srv://havenly_user:YOUR_PASSWORD@cluster0.abcde.mongodb.net/havenly_interiors?retryWrites=true&w=majority
   ```

---

### Step 2: Retrieve Your AWS Credentials

#### If using AWS Academy / Learner Lab:
1. Start your lab session in AWS Learner Lab.
2. Click **AWS Details** > **Show** (next to AWS CLI).
3. Copy:
   - `aws_access_key_id`
   - `aws_secret_access_key`
   - `aws_session_token`

#### If using a Standard Personal AWS Account:
1. Log into the AWS Console > IAM > Users > Security credentials.
2. Create an **Access key** for CLI/Application use outside AWS.
3. Copy your `Access Key ID` and `Secret Access Key`.

---

### Step 3: Configure GitHub Repository Secrets & Variables

1. Go to your GitHub repository: [`https://github.com/DIKSHYA135/Havenly-Interiors`](https://github.com/DIKSHYA135/Havenly-Interiors).
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Under the **Secrets** tab, click **New repository secret** and add:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `AWS_ACCESS_KEY_ID` | `AKIA...` or `ASIA...` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your secret access key string | Your AWS secret key |
| `AWS_SESSION_TOKEN` | Your session token string | Required for AWS Learner Lab (omit for standard accounts) |
| `MONGODB_URI` | `mongodb+srv://havenly_user:...` | Full connection URI from Step 1 |
| `JWT_SECRET` | Secure 32+ char random string | Secret for signing admin JWT tokens |
| `ADMIN_EMAIL` | `admin@havenlyinteriors.com` | Default admin email login |
| `ADMIN_PASSWORD` | `AdminHavenly2026!` | Default admin password |

4. Under the **Variables** tab (next to *Secrets*), click **New repository variable**:
   - **Name:** `AWS_REGION`
   - **Value:** `us-east-1` (or your chosen AWS region)

---

### Step 4: Push to GitHub & Deploy Automatically

Commit and push your changes to trigger the automated CI/CD pipeline:

```bash
# Verify status and staging
git add .
git commit -m "feat(aws): configure full-stack CloudFormation, Nginx, PM2, and CI/CD"
git push origin main
```

---

### Step 5: Verify Live Application

1. Open the **Actions** tab on your GitHub repository.
2. Click on the running workflow **Deploy Havenly Interiors to AWS EC2**.
3. Once completed (approx. 3–4 minutes for the first run), scroll down to the **Deployment Summary**:
   - **Live Website:** `http://<EC2-PUBLIC-IP>`
   - **Admin Dashboard:** `http://<EC2-PUBLIC-IP>/admin`
   - **Health Check:** `http://<EC2-PUBLIC-IP>/api/health`
4. Test the live consultation booking form on the homepage.
5. Log into the Admin Dashboard at `http://<EC2-PUBLIC-IP>/admin` to verify that your consultation submissions appear in real time.

---

## 🔄 How to Update Your Website in the Future

Whenever you make improvements, add new portfolio projects, or change styling:
1. Make your edits locally.
2. Test locally using `npm run dev` and `npm run build`.
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update portfolio showcase and services"
   git push origin main
   ```
4. GitHub Actions will automatically rebuild the frontend, test the backend, connect to EC2 via SSH, update the code, and reload PM2 with zero downtime.

---

## 🔧 Live Server Maintenance & Useful Commands

If you ever SSH into the EC2 instance:

```bash
# Check PM2 backend status
pm2 status

# View live backend application logs
pm2 logs havenly-backend

# Restart the Express backend
pm2 restart havenly-backend

# Check Nginx status
sudo systemctl status nginx

# Test Nginx configuration syntax
sudo nginx -t

# View Nginx access & error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔒 Security Best Practices Implemented

- **No Hardcoded Secrets:** `.env` files are excluded in `.gitignore`. Secrets are injected at runtime via GitHub Secrets.
- **SSM Parameter Store KeyPair:** The EC2 private SSH key is generated by AWS CloudFormation and stored directly in AWS Systems Manager Parameter Store. No private `.pem` keys are checked into source control.
- **Reverse Proxy Shield:** Port 5001 is kept private to internal localhost (`127.0.0.1:5001`). External users only access Port 80 / 443 through Nginx.
- **Rate Limiting & Helmet:** Backend API requests are rate-limited, sanitized, and secured with HTTP security headers.
- **CORS Protection:** Express only accepts requests from configured client origins.

---

## 🛑 How to Avoid Unnecessary AWS Charges

When you are done testing or no longer need the EC2 instance running:
- **To pause charges:** In the AWS EC2 Console, select your instance > **Instance state** > **Stop instance**. (You will only be billed pennies for the EBS disk).
- **To completely delete all AWS resources:**
  1. Go to the **CloudFormation** console.
  2. Select the stack `havenly-stack`.
  3. Click **Delete**. This will terminate the EC2 instance, delete the security group, and remove the key pair.
