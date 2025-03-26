# Birthday Reminder Service

## Overview
The **Birthday Reminder Service** is a scheduled background job that runs every hour to check if any users have a birthday at 9 AM in their respective timezones. If a user’s birthday matches the current date and their local time is 9 AM, the worker sends them a birthday email and logs the process.

This worker is implemented using Node.js, MongoDB, and node-cron, ensuring reliable background job execution.

## Features
- Automatically checks for users with birthdays every hour.

- Sends a birthday email to users at 9 AM in their local timezone.

- Logs the process for debugging and monitoring.

- Includes error handling for missing data and system failures.

## Installation
Clone the repository.
```ts
https://github.com/eduardusoldi/birthday-reminder-service.git
```

Set up environment variables:
Create a .env file in the root directory and define the following:
```ts
PORT=5000
MONGO_URI=mongodb://localhost:27017/mydatabase
dbName=mydatabase
```
Use the command below to start the service with Docker Compose:
```ts
docker-compose up -d
```

## Testing
Run unit test using Jest and supertest:
```ts
npm run test
```

## API Documentation
For detailed information on available endpoints, request formats, and responses, check out the [API Documentation](./API_DOCS.md).