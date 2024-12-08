BEGIN;

CREATE TABLE
    "Role" (
        "ID" serial PRIMARY KEY,
        "RoleName" VARCHAR(50) UNIQUE NOT NULL,
        "Description" TEXT,
        CONSTRAINT "chk_valid_role_names" CHECK (
            "RoleName" IN ('admin', 'receptionist', 'housekeeper', 'finance manager', 'user')
        )
    ) TABLESPACE pg_default;

COMMIT;
