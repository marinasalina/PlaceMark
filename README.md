# Placemark Web Application

This project is a simple placemark application built with Hapi, Handlebars, and MongoDB. Users can sign up, log in, and create placemarks with a name, description, and location (latitude and longitude).

## Features
- User signup and login with cookie authentication
- Create, edit, and delete placemarks
- Categories and user dashboard
- REST API for users and placemarks (JSON-based)
- Full API test suite using Mocha and Chai
- Deployment on Render

## API Endpoints (Examples)
- `POST /api/users` – create a user  
- `POST /api/users/authenticate` – login and receive JWT  
- `POST /api/placemarks` – create a placemark  
- `GET /api/placemarks` – list all placemarks  

## Testing
The project includes unit tests for:
- User creation and authentication
- Placemark CRUD operations
- Token verification and error handling

Run tests with:
npm run test

## Deployment
Live version on Render:  
https://placemark-2tud.onrender.com

## Technologies Used
- Node.js / Hapi
- Handlebars templates
- MongoDB Atlas
- JWT + Cookie authentication
- Mocha + Chai for testing

## Notes
This project was developed as part of a learning exercise. Git history was partially lost due to an early mistake with branches, but the final version contains all working code.
