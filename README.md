# Mind Forge

## Mind Forge is an e-Learning Platform built on Next.Js(frontend), Node.Js (backend), AWS DynamoDB, Docker, AWS EKS, deployed on AWS

### Tech Stack
Backend
+ User authentication is managed using **JWT (JSON Web Tokens)** with custom authentication system
+ Backend is built using Express.js, AWS sdk, multer (to handle file uploads), Docker and many more production grade dependencies.
+ Backend image is built using Docker which is then uploaded on AWS Elastic Container Registry and deployed using AWS Lambda.
+ AWS API Gateway is working as proxy for route handlers to let express routing take care of different endpoints exposed from the backend
+ AWS DynamoDB is used as database
+ AWS sdk is used to generate a preSignedUrl to be sent to the frontend to upload a video lecture directly to S3 bucket
+ Stripe is integrate for smooth checkout flow and creating payment intents for course purchases

Frontend
+ User authentication is managed using **JWT (JSON Web Tokens)** with custom authentication system
+ Checkout flow is integrated using Stripe
+ UI is built using framer-motion, tailwind CSS and shadcn-ui library to give modern and elegant dark theme design
+ Frontend is deployed on Vercel

### Features
Frontend
+ Login as a 'teacher' to create, edit and delete courses.
+ Teacher can add sections / modules to courses, upload video lectures for each lesson.
+ Login as a User / Student to checkout listed courses and enroll in the course.
+ Students can track their progress for each course as they successively complete lectures in that course
+ Lecture is marked as complete upon 80% of the video has been viewed by the student
+ Signed in Users can also track their billing  history on the app by navigating to Manage account -> Billing tab.

**Required .env Variables for server**
```javascript
PORT=PORT_NUMBER
NODE_ENV=development #change this to 'production' during deployment

AWS_REGION=YOUR-AWS-REGION
S3_BUCKET_NAME=YOUR-S3-BUCKET-NAME
CLOUDFRONT_DOMAIN=YOUR-CLOUDFRONT-DOMAIN

STRIPE_SECRET_KEY=YOUR-STRIPE-SECRET-KEY

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
JWT_EXPIRES_IN=7d
```

**Required .env Variables for client**
```javascript
NEXT_PUBLIC_API_BASE_URL=BACKEND_URL_GOES_HERE
NEXT_PUBLIC_LOCAL_URL=FRONTEND_URL_GOES_HERE

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=YOUR-STRIPE-PUBLIC-KEY
```

**Commands for backend**\
Command to connect to local DynamoDB instance using Windows CMD, please enusre you JAVA installed on your machine (prerequisite)
```
java "-Djava.library.path=ADD_PATH_TO/DynamoDBLocal_lib" -jar "ADD_PATH_TO/DynamoDBLocal.jar" -sharedDb -dbPath "ADD_PATH_TO_SERVER_DIRECTORY_OF_THIS_PROJECT"
```

Command to build Docker image, please ensure you have docker installed and configured on your machine and your current working directory is 
`server`.
```
docker build --provenance=false -t your-image-name .
```
`--provenance=false` flag was required to fix image build errors on AWS side referencing the solution from [this](https://github.com/docker/buildx/issues/1509#issuecomment-1378538197) post

**Test credentials to login as Teacher**
> Email: teacher@gmail.com\
> Password: mind2025forge

**Test credentials to login as Student / User**
> Email: student@gmail.com\
> Password: mind2025forge