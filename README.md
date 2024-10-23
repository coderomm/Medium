# Blog Project

This is a simple blog project built using React for the frontend, Cloudflare Workers for the backend, and Postgres SQL with Prisma ORM for database management. The project is deployed on Cloudflare Workers, and the backend can be accessed at [backend.omopyt2020.workers.dev](https://backend.omopyt2020.workers.dev).

## Features

- User Signup and Signin with authentication.
- Create, update, and view blog posts.
- Authentication is handled using JSON Web Tokens (JWT).
- Prisma ORM is used for database interactions with PostgreSQL.

---

## Table of Contents

- [Blog Project](#blog-project)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Environment Setup](#environment-setup)
  - [API Endpoints](#api-endpoints)
    - [User Authentication](#user-authentication)
      - [Sign Up](#sign-up)
      - [Sign In](#sign-in)
    - [Blog Management](#blog-management)
      - [Create Blog](#create-blog)
      - [Update Blog](#update-blog)
      - [Get All Blogs](#get-all-blogs)
      - [Get Blog by ID](#get-blog-by-id)
  - [Database Setup](#database-setup)
  - [Deployment](#deployment)
  - [License](#license)
    - [Notes:](#notes)

---

## Technologies Used

- **Frontend**: React
- **Backend**: Cloudflare Workers
- **Routing**: Hono (a lightweight router for Cloudflare Workers)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Deployment**: Cloudflare Workers

---

## Project Structure

```
.
├── frontend/          # React frontend files
├── backend/           # Cloudflare Workers backend code
├── prisma/            # Prisma schema and migration files
├── README.md          # Documentation
└── package.json       # Project dependencies
```

---

## Environment Setup

To run the backend locally and deploy it to Cloudflare Workers, follow these steps:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Prisma**:
   Initialize Prisma and generate client:
   ```bash
   npx prisma init
   npx prisma generate
   ```

3. **Configure Environment Variables**:
   Create a `.env` file for your project and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

4. **Deploy to Cloudflare Workers**:
   Use the Cloudflare Workers CLI to deploy:
   ```bash
   npx wrangler publish
   ```

---

## API Endpoints

### User Authentication

#### Sign Up
**POST** `/api/v1/user/signup`

- **Description**: Register a new user.
- **Expected Payload**:
   ```json
   {
     "username": "your_username",
     "password": "your_password",
     "name": "Your Name"
   }
   ```
   
- **Response**:
   - Success: 201 Created
   - Failure: 400 Bad Request

#### Sign In
**POST** `/api/v1/user/signin`

- **Description**: Authenticate and log in a user.
- **Expected Payload**:
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```
   
- **Response**:
   - Success: 200 OK (with JWT)
   - Failure: 401 Unauthorized

---

### Blog Management

#### Create Blog
**POST** `/api/v1/blog/`

- **Description**: Create a new blog post.
- **Expected Payload**:
   ```json
   {
     "title": "Blog Title",
     "content": "Blog content",
     "authorId": "JWT Token's Author ID"
   }
   ```

- **Response**:
   - Success: 201 Created
   - Failure: 400 Bad Request

#### Update Blog
**PUT** `/api/v1/blog/`

- **Description**: Update an existing blog post.
- **Expected Payload**:
   ```json
   {
     "where": {
       "id": "Blog Post ID",
       "authorId": "JWT Token's Author ID"
     },
     "data": {
       "title": "Updated Title",
       "content": "Updated Content"
     }
   }
   ```

- **Response**:
   - Success: 200 OK
   - Failure: 404 Not Found

#### Get All Blogs
**GET** `/api/v1/blog/all`

- **Description**: Retrieve all blog posts.
- **Response**:
   - Success: 200 OK (list of blog posts)
   - Failure: 404 Not Found

#### Get Blog by ID
**GET** `/api/v1/blog/:id`

- **Description**: Retrieve a specific blog post by ID.
- **Response**:
   - Success: 200 OK (blog post)
   - Failure: 404 Not Found

---

## Database Setup

This project uses **PostgreSQL** with **Prisma ORM**. To set up the database:

1. **Configure Prisma**: Update the `prisma/schema.prisma` file with your database details.

2. **Migrate Database**: Run the following commands to create tables in the database:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma Client**: After migrating, generate the Prisma Client:
   ```bash
   npx prisma generate
   ```

---

## Deployment

To deploy the backend to **Cloudflare Workers**, use the following command:

```bash
npx wrangler publish
```

Ensure your database credentials are properly configured in the `.env` file for deployment.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

### Notes:

- Be sure to secure your API by implementing additional security measures such as rate limiting and input validation to protect your endpoints.
- JWT should be securely stored and handled on the frontend.

---

That's it! You're now ready to run your blog project with Cloudflare Workers and PostgreSQL.