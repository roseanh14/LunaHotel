# Luna Hotel – Reservation System

## Project Description

Luna Hotel is a web application designed for managing hotel reservations.  
The application allows registered users to browse available rooms, create reservations, and manage their bookings. Administrators can manage rooms, users, and all reservations within the system.

The goal of this project is to develop a modern single page application using Spring Boot as the backend and React as the frontend. The project demonstrates database integration, layered architecture, JWT-based authentication, and application testing.

---

## Technologies Used

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT Authentication
- MySQL
- Maven

### Frontend
- React.js
- React Router
- MUI or Tailwind CSS

---

## Application Architecture

The backend follows a layered architecture:

- Model (Entities)
- Repository (DAO layer)
- Service layer
- Controller layer

The application communicates via REST API and follows the Single Page Application (SPA) rendering pattern.

---

## Main Features

### User Features
- User registration
- User authentication (JWT)
- View available rooms
- Filter rooms by capacity or price
- Create a reservation
- View personal reservations
- Cancel a reservation

### Administrator Features
- Create, update, and delete rooms
- View all reservations
- Manage users

---

## Database Model

The application contains at least three main entities:

### User
- id
- username
- email
- password
- role (USER / ADMIN)

### Room
- id
- number
- type
- pricePerNight
- capacity
- description

### Reservation
- id
- checkInDate
- checkOutDate
- totalPrice
- user (ManyToOne relationship)
- room (ManyToOne relationship)

Relationships:
- One user can have multiple reservations (1:N)
- One room can have multiple reservations (1:N)
- Each reservation belongs to exactly one user and one room

---

## Additional Non-Trivial Functionality

The project will include one additional non-trivial feature as required by the assignment.

Two possible options are currently considered:

1. Automatic OpenAPI 3 documentation generation using springdoc-openapi (Swagger).
2. Přihlašování pomocí SSO (Google, Microsoft...).

The final selection will be made after consultation, based on technical feasibility and overall project scope.
---

## Database Diagram

![ER Diagram](Luna%20ER%20diagram.png)
