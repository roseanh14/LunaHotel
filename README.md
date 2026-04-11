# Luna Hotel – Reservation System

Portfolio **full-stack** project: **Spring Boot** REST API, **React (Vite)** SPA, **MySQL**, **JWT** auth, **OpenAPI 3 / Swagger UI**, and **Redis** caching for room reads.

---

## Overview

Luna Hotel is a web application for managing hotel reservations. Registered users can browse rooms, search by availability, book stays, and look up bookings. Administrators can manage rooms, bookings, and users.

The app follows the **single-page application (SPA)** pattern: the React client consumes a **REST API**; navigation is client-side via **React Router**.

---

## Repository layout

| Path        | Description                                      |
|------------|---------------------------------------------------|
| `Backend/` | Spring Boot API (JPA, Security, JWT, OpenAPI, Redis cache) |
| `Frontend/`| React + Vite SPA                                  |
| `docs/`    | Optional extra documentation / assets             |

Root **`Luna ER diagram.png`** — entity-relationship diagram for the data model.

---

## Tech stack

### Backend
- **Java 17**
- **Spring Boot 3** (Web, Data JPA, Security, Validation, Cache)
- **Spring Security** + **JWT** (jjwt)
- **MySQL**
- **Redis** — response caching for room read endpoints (Spring Cache)
- **springdoc-openapi** — **OpenAPI 3** + **Swagger UI**
- **Maven**, **Lombok**

### Frontend
- **React 19** + **React Router 7**
- **Vite**
- **Axios**
- **react-datepicker**
- Custom **CSS** (teal / mint theme; no mandatory UI kit)

---

## Architecture

### Backend (layered)
- **Entities** — JPA models (`User`, `Room`, `Booking`, …)
- **Repositories** — Spring Data JPA
- **Services** — business logic (interfaces + implementations)
- **Controllers** — REST endpoints, DTOs
- **Security** — JWT filter, `SecurityConfig`, method-level `@PreAuthorize` where used

### Frontend
- **Pages / feature folders** under `src/components/` (`auth`, `booking_rooms`, `admin`, `home`, `profile`, `common`)
- **Shared services** — `ApiService.js`, route guards
- **Reusable components** — e.g. `Pagination`, `RoomSearch`, `RoomResult` (used in multiple screens with different props)

---

## Main features

**Users**
- Register / login (JWT stored client-side)
- Browse rooms, search by dates & type, room detail & booking flow
- Find booking by confirmation code
- Profile

**Administrators**
- CRUD rooms (with photo upload where implemented)
- Manage bookings
- User administration (as implemented in API + UI)

---

## Data model (summary)

Three core JPA entities (see ER diagram for relationships):

- **User** — identity, credentials (hashed), role (`USER` / `ADMIN`), contact fields  
- **Room** — type, price, description, photo reference, link to bookings  
- **Booking** — check-in/out, guests, confirmation code, links to **User** and **Room**

Relationships: one user → many bookings; one room → many bookings.

---

## API documentation & caching

### OpenAPI 3 (springdoc-openapi)

- **Swagger UI:** `http://localhost:4040/swagger-ui.html` (may redirect to `/swagger-ui/index.html`)
- **OpenAPI JSON:** `http://localhost:4040/v3/api-docs`
- Public: `/auth/**`. For other endpoints, use **Authorize** in Swagger with `Bearer <token>` from login.

### Redis caching (Spring Cache)

- **Cached:** read-heavy **room** operations in `RoomService` (all rooms, by id, room types, availability queries).
- **Evicted** when rooms or bookings change (`RoomService` mutations, `BookingService` save/cancel).
- **TTL:** 10 minutes (`CacheRedisConfig`).
- **Requirement:** Redis on **`localhost:6379`** when running the full stack (see below).

---

## How to run locally

### Prerequisites
- **JDK 17**
- **Node.js** (LTS recommended) + npm
- **MySQL** — create DB and user as in `Backend/src/main/resources/application.properties`
- **Redis** — for backend with cache enabled (or use Docker Compose in `Backend/`)

### 1. MySQL
Adjust `Backend/src/main/resources/application.properties` (`spring.datasource.*`) to match your instance.

### 2. Redis (example: Docker)

From the `Backend` folder:

```bash
docker compose up -d
```

Or run any Redis 7+ on port **6379**.

### 3. Backend

```bash
cd Backend
./mvnw spring-boot:run
```

Windows (PowerShell):

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

Default API port: **4040** (see `application.properties`).

### 4. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Point the frontend API base URL to your backend (e.g. via `.env` / `ApiService.js` — typically `http://localhost:4040`).

### Tests (backend)

Integration tests use Spring profile **`test`** (`application-test.properties`): Redis auto-config is **disabled** and cache type **`none`**, so **MySQL** (or your test DB setup) is still required for `@SpringBootTest` that hits the database.

```bash
cd Backend
./mvnw test
```

---

## ER diagram

![ER Diagram](Luna%20ER%20diagram.png)

---

## License

This repository is provided as a **portfolio / showcase** project. Add a license file if you want to clarify reuse terms.
