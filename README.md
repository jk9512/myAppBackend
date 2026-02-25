# Business Website Management System - Backend

This is the robust Express.js & Node.js backend server for the Business Website Management System. It handles API requests, database interactions, authentication, and role-based access control.

## 🚀 Technologies Used

- **Node.js** & **Express.js** 
- **MongoDB** & **Mongoose** (Database & Object Data Modeling)
- **JWT (JSON Web Tokens)** & **Bcryptjs** (Security & Authentication)
- **Swagger UI Express** & **Swagger JSDoc** (Interactive API Documentation)
- **Cors** & **Dotenv** (Middleware & Configuration)
- **Multer** (File uploads and Buffer storage)

## 📂 Project Structure

- `models/`: Mongoose schemas and models (User, Role, Portfolio, Contact, etc.)
- `controllers/`: Request handler functions mapped to endpoints
- `routes/`: Express route definitions connecting endpoints to controllers
- `middleware/`: Custom Express middlewares (Auth, Error Handler, etc.)
- `config/`: Database connection and Swagger documentation configuration
- `utils/`: Helper functions and database seeders

## ⚙️ Environment Variables

Create a `.env` file in the root of the `server` directory and configure the following:

```env
# Server Port
PORT=5000

# MongoDB Connection String (Local or Atlas)
MONGO_URI=mongodb://localhost:27017/BusinessWebsite

# JWT Secret Key for token signing
JWT_SECRET=your_super_secret_jwt_key_here

# Environment Type (development / production)
NODE_ENV=development
```

## 🛠️ Scripts & Usage

In the project directory, you can run:

### `npm install`
Installs all required dependencies.

### `npm run dev`
Starts the server using `nodemon` for automatic restarts upon file changes. Ideal for development.
By default, the server will run on [http://localhost:5000](http://localhost:5000).

### `npm start`
Starts the server using `node`. This is the command used in production environments.

### `npm run seed`
Executes the seeder utility (`utils/seeder.js`) to populate the database with default data (e.g., initial Admin User, static Roles) if the collections are empty. This is automatically run on startup as well in `server.js`.

## 📚 API Documentation (Swagger)

The interactive API documentation powered by Swagger is available when the server is running. You can explore, test, and understand all the available endpoints at:

🔗 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

## 🚀 Deployment

The backend server is perfectly configured to be deployed on platforms like **Render**, **Heroku**, or **DigitalOcean**. 
Update the `NODE_ENV` to `production` and configure the allowed CORS origins properly to accept requests from your deployed frontend client.
