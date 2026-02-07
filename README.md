# Medical Center Claim Software

A full-stack application for managing medical insurance claims, built with React, Ruby on Rails, and PostgreSQL.

![Claims Dashboard](https://img.shields.io/badge/Status-Completed-green) ![React](https://img.shields.io/badge/React-18.3-blue) ![Rails](https://img.shields.io/badge/Rails-7.0-red) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## Overview

This application allows medical centers to:
- Import claims data from CSV files
- Manage patients and claims through a clean interface
- Export claims data back to CSV
- Track import history and status

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OscarRapale/Medical_Claim_Software.git
   cd medical_claim_software
   ```

2. **Build and start the containers**
   ```bash
   docker-compose build
   docker-compose up
   ```

3. **Create the database** (in a new terminal)
   ```bash
   docker-compose exec backend rails db:create db:migrate
   ```

4. **Create a test user** (optional)
   ```bash
   docker-compose exec backend rails console
   ```
   Then run:
   ```ruby
   User.create!(email: 'admin@test.com', password: 'password123', role: 'admin')
   exit
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Default Credentials
```
Email: admin@test.com
Password: password123
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Ant Design |
| Backend | Ruby on Rails 7 (API mode) |
| Database | PostgreSQL 15 |
| Authentication | JWT |
| Containerization | Docker & Docker Compose |

## Project Structure

```
Medical_Claim_Software/
├── backend/                 # Rails API
│   ├── app/
│   │   ├── controllers/     # API endpoints
│   │   ├── models/          # Database models
│   │   └── services/        # Business logic (CSV import/export)
│   ├── config/
│   └── db/
│       └── migrate/         # Database migrations
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   └── services/        # API service
├── docker-compose.yml
└── README.md
```

## Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | integer | Primary key |
| email | string | Unique |
| password_digest | string | Hashed password |
| role | string | admin / staff |
| created_at | datetime | |

### Patients
| Column | Type | Notes |
|--------|------|-------|
| id | integer | Primary key |
| first_name | string | |
| last_name | string | |
| dob | date | Date of birth |
| created_at | datetime | |

### Claims
| Column | Type | Notes |
|--------|------|-------|
| id | integer | Primary key |
| patient_id | FK | References patients |
| claim_import_id | FK | References claim_imports |
| claim_number | string | Unique identifier |
| service_date | date | |
| amount | decimal | |
| status | string | pending/submitted/denied/paid |
| created_at | datetime | |

### ClaimImports
| Column | Type | Notes |
|--------|------|-------|
| id | integer | Primary key |
| file_name | string | Original filename |
| total_records | integer | |
| processed_records | integer | |
| status | string | pending/completed/failed |
| created_at | datetime | |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| GET | `/auth/me` | Get current user |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | List all patients |
| GET | `/patients/:id` | Get patient details |
| POST | `/patients` | Create patient |
| PUT | `/patients/:id` | Update patient |
| DELETE | `/patients/:id` | Delete patient |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/claims` | List all claims |
| GET | `/claims/:id` | Get claim details |
| POST | `/claims` | Create claim |
| PUT | `/claims/:id` | Update claim |
| DELETE | `/claims/:id` | Delete claim |
| GET | `/claims/export` | Export claims to CSV |

### Claim Imports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/claim_imports` | List import history |
| GET | `/claim_imports/:id` | Get import details |
| POST | `/claim_imports` | Upload CSV file |

## CSV Import Format

The CSV file must include the following columns:

```csv
patient_first_name,patient_last_name,patient_dob,claim_number,service_date,amount,status
John,Doe,1990-05-15,CLM-001,2024-01-15,250.00,pending
```

| Column | Format | Description |
|--------|--------|-------------|
| patient_first_name | string | Patient's first name |
| patient_last_name | string | Patient's last name |
| patient_dob | YYYY-MM-DD | Patient's date of birth |
| claim_number | string | Unique claim identifier |
| service_date | YYYY-MM-DD | Date of service |
| amount | decimal | Claim amount |
| status | string | pending/submitted/denied/paid |

## Features

### Login Page
- Secure JWT authentication
- Clean, professional interface

### Claims List
- Sortable columns
- Filter by status
- Search by claim ID or patient name
- Export to CSV
- Delete claims

### Import Claims
- Drag and drop CSV upload
- Real-time processing feedback
- Error reporting for invalid rows
- Import history tracking

## Security

- Password hashing with bcrypt
- JWT token authentication
- Protected API endpoints
- CORS configuration for frontend access

## Testing the Application

1. **Login** with the demo credentials
2. **Import claims** using the sample CSV file
3. **View claims** in the Claims list
4. **Filter and sort** the claims table
5. **Export claims** to download a CSV file

## Assumptions

1. Patient uniqueness is determined by first name + last name + date of birth combination
2. Claim numbers must be unique across the system
3. CSV imports create new patients if they don't exist
4. All authenticated users can perform all operations (no role-based restrictions implemented)
5. File storage is local (not cloud-based)

## Development

### Running without Docker

**Backend:**
```bash
cd backend
bundle install
rails db:create db:migrate
rails server -p 3000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| DATABASE_URL | - | PostgreSQL connection string |
| JWT_SECRET_KEY | Rails secret | JWT signing key |
| VITE_API_URL | http://localhost:3000 | Backend API URL |

## Docker Commands

```bash
# Build containers
docker-compose build

# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Run Rails console
docker-compose exec backend rails console

# Run database migrations
docker-compose exec backend rails db:migrate

# Reset database
docker-compose exec backend rails db:drop db:create db:migrate
```

## Author

Oscar Rapale Méndez - Full Stack Developer

## License

This project was created as part of a technical challenge.