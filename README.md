## Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Update the values in `.env` with your local configuration
4. Run `go mod download`
5. Run `docker compose up -d`
6. Run the app with `cd backend && go run cmd/api/main.go`