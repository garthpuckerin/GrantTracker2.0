-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for better performance
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'PI', 'FINANCE', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE grant_status AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'NOT_AWARDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE renewal_status AS ENUM ('PENDING', 'SUBMITTED', 'AWARDED', 'NOT_AWARDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE budget_category AS ENUM ('PERSONNEL', 'TRAVEL', 'SUPPLIES', 'EQUIPMENT', 'INDIRECT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM ('NARRATIVE', 'BUDGET_JUSTIFICATION', 'RENEWAL', 'REPORT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;