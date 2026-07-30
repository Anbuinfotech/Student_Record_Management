# Student Record Management System

A full-stack CRUD application to manage student records.

- **Backend:** Java 25, Spring Boot 3, Spring Data JPA, MySQL
- **Frontend:** React 18 (Vite), Axios
- **Deployment:** Frontend on **Vercel**, Backend on **Render** or **Railway**, Database on **Railway/Aiven MySQL**

> Vercel does not support running a Java backend (its serverless functions only
> support Node.js, Python, Go, and Ruby). So in this project, only the React
> frontend is deployed to Vercel. The Spring Boot API is deployed separately
> to Render or Railway (both have free tiers), and the frontend calls it over
> HTTPS.

---

## Project Structure

```
student-record-management/
├── backend/                # Spring Boot REST API
│   ├── src/main/java/com/srms/studentrecord/
│   │   ├── controller/      # StudentController - REST endpoints
│   │   ├── service/         # StudentService - business logic
│   │   ├── repository/      # StudentRepository - JPA data access
│   │   ├── entity/          # Student entity
│   │   ├── exception/       # Custom exceptions + global handler
│   │   └── config/          # CORS config
│   ├── src/main/resources/
│   │   ├── application.properties        # production (MySQL, env-driven)
│   │   └── application-local.properties  # local dev (H2 in-memory)
│   └── pom.xml
│
└── frontend/                # React (Vite) app
    ├── src/
    │   ├── components/       # StudentForm, StudentList, SearchBar
    │   ├── services/         # studentService.js (Axios API calls)
    │   ├── App.jsx
    │   └── main.jsx
    ├── vercel.json
    └── package.json
```

---

## 1. Run the backend locally

**Requirements:** JDK 17+, Maven (or use the included `mvnw` if you add the wrapper), MySQL (or skip MySQL and use the `local` profile with H2).

### Option A — Quick start with H2 (no MySQL install needed)
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
This starts the API at `http://localhost:8080` with an in-memory database.
You can browse the DB at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:studentdb`, user: `sa`, no password).

### Option B — With real MySQL
1. Create a database:
   ```sql
   CREATE DATABASE student_records;
   ```
2. Set environment variables (or edit `application.properties` directly):
   ```bash
   export DB_URL=jdbc:mysql://localhost:3306/student_records
   export DB_USERNAME=root
   export DB_PASSWORD=yourpassword
   ```
3. Run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

Tables are auto-created by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) — no manual schema needed.

### API Endpoints
| Method | Endpoint                          | Description               |
|--------|------------------------------------|----------------------------|
| GET    | `/api/students`                   | Get all students           |
| GET    | `/api/students/{id}`              | Get one student             |
| POST   | `/api/students`                   | Create a student            |
| PUT    | `/api/students/{id}`              | Update a student            |
| DELETE | `/api/students/{id}`              | Delete a student            |
| GET    | `/api/students/search/name?query=`| Search by name              |
| GET    | `/api/students/search/course?query=`| Search by course           |

---

## 2. Run the frontend locally

**Requirements:** Node.js 18+

```bash
cd frontend
npm install
cp .env.example .env     # then edit VITE_API_URL if needed
npm run dev
```

Opens at `http://localhost:5173`, calling the backend at `http://localhost:8080/api` by default.

---

## 3. Deploy the backend (Render — free tier)

1. Push the `backend/` folder to a GitHub repo (or the whole project, Render lets you set a root directory).
2. Go to [render.com](https://render.com) → **New +** → **Web Service** → connect your repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Docker *or* Java (Render auto-detects Maven; build command `mvn clean package -DskipTests`, start command `java -jar target/*.jar`)
   - **Instance Type:** Free
4. Add Environment Variables:
   - `DB_URL` = your MySQL JDBC URL (see step 4 below)
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `CORS_ORIGINS` = your Vercel frontend URL, e.g. `https://your-app.vercel.app`
5. Deploy. Render gives you a URL like `https://student-record-api.onrender.com`.

**Alternative:** Railway (railway.app) works the same way and can also host the MySQL database in one place — often the simplest option for a fresher project.

---

## 4. Set up MySQL (free options)

- **Railway** → New Project → Provision MySQL → copy the connection details it gives you into `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`.
- **Aiven** (aiven.io) → free MySQL plan → same idea.

Format for `DB_URL`:
```
jdbc:mysql://<host>:<port>/<database>?useSSL=true&requireSSL=false
```

---

## 5. Deploy the frontend to Vercel

1. Push `frontend/` to GitHub (can be the same repo).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Environment Variable:
   - `VITE_API_URL` = your deployed backend URL + `/api`, e.g.
     `https://student-record-api.onrender.com/api`
5. Deploy. Vercel gives you `https://your-app.vercel.app`.
6. Go back to Render/Railway and set `CORS_ORIGINS` to this exact Vercel URL, then redeploy the backend.

---

## Resume-worthy talking points

- RESTful API design with proper HTTP status codes (201, 204, 404, 409, 400)
- Layered architecture: Controller → Service → Repository
- Bean Validation (`@Valid`, `@NotBlank`, `@Email`, `@Pattern`) with a global exception handler returning structured JSON errors
- CORS configured via environment variable rather than hardcoded
- Separate `local` Spring profile (H2) vs production profile (MySQL) — shows awareness of environment-based configuration
- Frontend/backend split deployment (a common real-world pattern for Java + Vercel)

## Possible extensions
- Spring Security + JWT login for admin-only access
- Pagination & sorting on the students list
- Upload student photo (multipart file handling)
- Export records to CSV/PDF
- Docker Compose for one-command local setup
