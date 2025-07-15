# Clasicos API

## Overview  
I created the Clasicos API in NestJS using TypeScript, leveraging core NestJS mechanisms: modules, controllers, services, guards, middleware, DTOs, entities, decorators, and test files.

## Database & ORM  
I used a MySQL database together with Prisma.

## Testing  
I performed unit tests of services and controllers with Jest.

## DTO & Validation  
In DTOs I used the Class Transformer library and, above all, Class Validator. They integrate perfectly with the entire NestJS ecosystem.

## Deployment  
Since this is a non‑commercial project, the backend has been deployed on Vercel, which is sufficient for maintaining the application in its current version. As the application grows (for example, towards WebSockets), one should consider migrating to another provider such as Google Cloud Platform or Amazon Web Services.