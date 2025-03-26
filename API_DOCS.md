# Birthday Reminder Service API Documentation

## A. Endpoints:

List of available endpoints:

A.1 `POST /api/users`

A.2 `GET /api/users/:id`

A.3  `PUT /api/users/:id`

A.4 `DELETE /api/users/:id`

## B. Workers:
B.1 `Birthday Messaging Worker`

## A.1 POST /api/users
_Request body:_

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "birthday": "1990-03-26",
  "timezone": "Europe/London"
}
```

###  _Response (201 - Created):_

Return 201 status code when success creating user
```json
{
    "message": "User created successfully",
    "data": {
        "_id": "67e3cfde8501c8bd611f7984",
        "name": "Alice",
        "email": "alice@example.com",
        "birthday": "1990-03-26T00:00:00.000Z",
        "timezone": "Europe/London"
    }
}
```

### _Response (400 - Bad Request):_

Return 400 status code when the request body is empty
```json
{
    "message": "Please fill the fields."
}
```


Return a 400 status code if the request body is missing any of the following fields: name, birthday, timezone, or email.
```json
{
    "message": "Please insert name",
    // OR
    "message": "Please insert email",
    // OR
    "message": "Please insert birthday",
    // OR
    "message": "Please insert timezone",
}
```


Return a 400 status code when an invalid email, birthday, or timezone is provided.
```json
{
    "message": "The email format is invalid",
    // OR
    "message": "The birthday format is invalid",
    // OR
    "message": "The timezone format is invalid"
}
```


Return a 400 status code when the invalid fields is given.
```json
{
    "message": "Invalid fields: invalidFields1, invalidFields2"
}
```


Return a 400 status code when the provided email is already taken.
```json
{
    "message": "The email taken@mail.com is already taken. Please choose a different email"
}
```

## A.2 GET /api/users/:id
_Request params:_

```json
{
    "id": "67e3cfde8501c8bd611f7984"
}
```

### _Response (200 - OK):_

Return 200 status code when successfully retrieving user by ID
```json
{
    "_id": "67e3cfde8501c8bd611f7984",
    "name": "Alice",
    "email": "alice@example.com",
    "birthday": "1990-03-26T00:00:00.000Z",
    "timezone": "Europe/London"
}
```

### _Response (400 - Bad Request):_

Return 400 status code when user ID is invalid.

```json
{
    "message": "Invalid ID format."
}
```

### _Response (404 - Not Found):_

Return 404 status code when user is not found.

```json
{
    "message": "User not found"
}
```

## A.3 PUT /api/users/:id
_Request params:_

```json
{
    "id": "67e3cfde8501c8bd611f7984"
}
```

_Request body:_

```json
{
    "name": "Alice",
    // AND OR
    "email": "alice@example.com",
    // AND OR
    "birthday": "1990-03-26T00:00:00.000Z",
    // AND OR
    "timezone": "Europe/London"
}
```

### _Response (200 - OK):_

Return 200 status code when successfully retrieving user by ID
```json
{
    "_id": "67e3cfde8501c8bd611f7984",
    "name": "Alice",
    "email": "alice@example.com",
    "birthday": "1990-03-26T00:00:00.000Z",
    "timezone": "Europe/London"
}
```

### _Response (400 - Bad Request):_

Return 400 status code when user ID is invalid.

```json
{
    "message": "Invalid ID format."
}
```

### _Response (404 - Not Found):_

Return 404 status code when user is not found.

```json
{
    "message": "User not found"
}
```

## A.4 DELETE /api/users/:id
_Request params:_

```json
{
    "id": "67e3cfde8501c8bd611f7984"
}
```

### _Response (200 - OK):_

Return 200 status code when successfully retrieving user by ID
```json
{
    "message": "User deleted successfully"
}
```

### _Response (400 - Bad Request):_

Return 400 status code when user ID is invalid.

```json
{
    "message": "Invalid ID format."
}
```

### _Response (404 - Not Found):_

Return 404 status code when user is not found.

```json
{
    "message": "User not found"
}
```


## B.1 Birthday Messaging Worker
The Birthday Worker is a scheduled background job that runs every hour using node-cron, a task scheduler for Node.js that allows running jobs at specified intervals. The worker checks if any users have a birthday at 9 AM in their respective timezones. If a user’s birthday matches the current date and their local time is 9 AM, the worker sends them a birthday email and logs the process.

### B.1.1 Case: User's Birthday Triggered
In this case, the worker identifies a user whose birthday matches the current date and their local time is 9 AM, triggering the birthday email.

```
Birthday Worker Scheduled to Run Every Hour
⏰ Running Birthday Worker...
🔍 Checking users with birthdays between 03-25 and 03-27
👥 Found 1 users in the database
🎉 Found 1 users with birthdays in range
🎉 Happy Birthday, Alice!
📩 Sending birthday email to: alice@example.com
```
### B.1.2 Case: User's Birthday Detected but Skipped
Here, the worker finds a user with a birthday on the current date but skips sending the email because their local time has not yet reached 9 AM.
```
Birthday Worker Scheduled to Run Every Hour
⏰ Running Birthday Worker...
🔍 Checking users with birthdays between 03-25 and 03-27
👥 Found 1 users in the database
🎉 Found 1 users with birthdays in range
⏳ Not 9 AM yet in Europe/London, skipping Alice
```

## Global Error

Return a 500 status code when an unexpected error occurs on the server, preventing the request from being processed successfully.
```json
{
    "message": "Internal Server Error",
    // OR
    "message": "MongoDB connection error.",
    // OR
    "message": "⚠️ Error in Birthday Worker.",
}
```