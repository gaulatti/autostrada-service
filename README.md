# Autostrada Backend Service

A robust **NestJS** backend service powering the Autostrada web performance monitoring platform. Built with TypeScript, this service provides secure API endpoints for tracking, analyzing, and reporting website performance metrics collected via Google PageSpeed Insights and Lighthouse reports.

## Description

The Autostrada Backend Service is the core component of the Autostrada platform, responsible for:

1. **Managing Performance Data**: Storing and processing website performance data collected from various sources
2. **Authentication & Authorization**: Handling user authentication through AWS Cognito integration
3. **API Endpoints**: Providing RESTful and gRPC endpoints for the frontend and other services to consume
4. **Data Analysis**: Processing and analyzing performance metrics to generate insights
5. **Integration**: Communicating with other microservices (like the Autostrada Plugin) to coordinate data collection and processing

## Project Setup

Before running the service, ensure you have the required environment variables configured in a `.env` file. You can use the `.env.template` as a starting point:

```bash
# Clone the repository
git clone https://github.com/gaulatti/autostrada.git
cd autostrada/service

# Install dependencies
npm install

# Create .env file from template
cp .env.template .env
# Edit the .env file with your specific configuration

# Run database migrations
npm run db:migrate
```

## Running the Service

The service can be run in various modes depending on your needs:

```bash
# Development mode
npm run start

# Watch mode with auto-reload
npm run start:dev

# Production mode
npm run start:prod
```

## Database Management

Autostrada uses Sequelize as an ORM for database interactions:

```bash
# Run database migrations
npm run db:migrate

# Sync database schema (development only)
npm run db:sync
```

## Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
# Build Docker image
docker build -t autostrada-service .

# Run container
docker run -p 3000:3000 -p 50051:50051 --env-file .env autostrada-service
```

## Testing

The service includes comprehensive test coverage:

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Generate test coverage report
npm run test:cov
```

## Key Components

### 1. Core Modules
- **Authentication**: Integrates with AWS Cognito for secure user authentication
- **Models**: Defines data models for performance metrics, scans, targets, etc.
- **API Controllers**: Exposes RESTful endpoints for frontend consumption

### 2. Scanning Framework
- **Scan Orchestration**: Coordinates with the Plugin service to run performance scans
- **Results Processing**: Processes and stores scan results
- **Scheduling**: Manages scan scheduling and triggers

### 3. Analytics Engine
- **Metrics Aggregation**: Collects and aggregates performance metrics
- **Trend Analysis**: Identifies performance trends over time
- **Reporting**: Generates reports on website performance

## Environment Variables

The service requires several environment variables for proper operation:

| Variable             | Description                                       |
|----------------------|---------------------------------------------------|
| AWS_ACCOUNT_ID       | AWS account identifier                            |
| AWS_REGION           | AWS region for services                           |
| COGNITO_USER_POOL_ID | AWS Cognito user pool ID for authentication       |
| DB_CREDENTIALS       | Database connection credentials                   |
| DB_DATABASE          | Database name                                     |
| DB_HOST              | Database host address                             |
| DB_PASSWORD          | Database password                                 |
| DB_PORT              | Database port                                     |
| DB_USERNAME          | Database username                                 |
| SERVICE_FQDN         | Fully qualified domain name for the service       |
| GRPC_PORT            | Port for gRPC communication                       |
| HTTP_PORT            | Port for HTTP API                                 |

## Contributing

Contributions to the Autostrada backend service are welcome. Please follow the project's coding standards and submit pull requests for review.
