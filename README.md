# CSE341 Project 2 API

A modern Node.js RESTful API for managing users and cars, built with Express, MongoDB, EJS, and session-based authentication.

## Features
- CRUD operations for users and cars
- MongoDB database integration
- Data validation and error handling
- Session-based authentication (express-session)
- MVC architecture (Models, Views, Controllers)
- Modern landing page (EJS view, custom CSS/JS)
- API documentation via Swagger (OpenAPI 3.0)

## Project Structure
```
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── common.js
├── src/
│   ├── app.js
│   ├── controllers/
│   │   ├── carController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── cars.json
│   │   └── users.json
│   ├── models/
│   │   ├── car.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   └── users.js
│   └── views/
│       └── index.ejs
├── swagger/
│   └── swagger.yaml
├── package.json
└── README.md
```

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file with your MongoDB URI and session secret:
     ```env
     MONGODB_URI=mongodb://localhost:27017/cse341project2
     SESSION_SECRET=your-session-secret
     PORT=3000
     ```
3. **Run the server:**
   ```bash
   npm run dev
   ```
4. **Access the app:**
   - Landing page: [http://localhost:3000/](http://localhost:3000/)
   - Swagger docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## API Endpoints
See [Swagger documentation](swagger/swagger.yaml) for full details.

- `/users` - Manage users (GET, POST, PUT, DELETE)
- `/cars` - Manage cars (GET, POST, PUT, DELETE)
- `/auth/register` - Register a new user
- `/auth/login` - Login with email and password

## Data Models
### User
- name, email, password, role, gender, address, phone, employment

### Car
- make, model, year, color, vin, mileage, bodyType, fuel, cc

## License
MIT
