---
id: object-storage
title: Object Storage
sidebar_label: Object Storage
sidebar_position: 6
---

# Object Storage

| Setting | Value |
|---------|-------|
| **Object Storage Provider** | Minio / GarageHQ (development) · FlashBlade (production) |
| **Enable SSL** | Recommended for development — **Required for production** |
| **Object GET Access** | Presigned URLs only — **Disable ALL public access** |
| **Bucket Creation** | Manual (development) · Platform creates it (production) |

- [Download GarageHQ](https://garagehq.deuxfleurs.fr/)
- [Download Minio](https://dl.min.io/server/minio/release/)
- Related library: [Boto3](./backend#object-storage-adapter--boto3)
- [Background: What is Object Storage?](https://www.youtube.com/watch?v=dEcQK4-pqiw)

## Object Storage Provider

FlashBlade is unavailable for development environments. Use compatible local object storage clients that Boto3 can interact with:

**Local options (recommended):**
- **GarageHQ** — preferred
- **MinIO** — widely used but discouraged by the author

**Why not AWS S3 directly?** Due to environment differences (non-local), it creates friction between development and production environments. There is also no way to use custom SSL certs in AWS.

:::tip
Local clients such as Minio/GarageHQ are recommended for development because they enable the development environment to be closer to production, and they allow you to enforce custom SSL certificates.
:::

## SSL

SSL is required in production environments (certificates will be provided to you) to ensure secure communication and protect data in transit.

**For development:** Local object storage clients like MinIO or GarageHQ allow you to enforce SSL, which helps mimic production behaviour and catch configuration issues early.

:::note
SSL configuration is currently a work in progress for connecting to managed services in production.
:::

## Object GET Access — Presigned URLs

![Presigned URL flow](/img/image13.png)

**It is mandatory to use presigned URLs in both development and production environments.**

Without presigned URLs, anyone with the object link can access it at any time, bypassing access controls. With presigned URLs, access is temporary and time-limited, and permissions are enforced for each request.

### Flow

1. The frontend requests data from the backend, including images for a specific use case
2. The backend retrieves the presigned URL for each image from the object storage server **(using Boto3)** using the image's name or ID (from the database)
3. The backend responds to the frontend with the presigned URLs
4. The frontend uses the presigned URLs to access the images securely and temporarily

[Learn more about Presigned URLs](https://fourtheorem.com/the-illustrated-guide-to-s3-pre-signed-urls/)

:::caution
All public access should be assumed to be disabled. Attempting to access an object via its direct link as if it were public will cause errors — the object will not be displayed. **This is also the behaviour in production.**
:::

## Bucket Creation

In production, there is no need to create a bucket — the platform team creates one for you, and you do not have permission to create one.

:::important
**Create the bucket manually in the development client** rather than automatically in the application. This reduces the amount of code change needed when moving from development to production.
:::
