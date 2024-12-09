--TABLE: "Hotel"
BEGIN;

CREATE TABLE "Hotel" (
    "ID" serial PRIMARY KEY,
    "Name" VARCHAR(150) NOT NULL,
    "Address" VARCHAR(255) NOT NULL,
    "City" VARCHAR(100) NOT NULL,
    "Rating" NUMERIC(3, 2) DEFAULT 0 CHECK (
        "Rating" >= 0
        AND "Rating" <= 5
    ) NOT NULL,
    "HotelImg" TEXT NOT NULL,
    "Created_At" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
) TABLESPACE pg_default;

COMMIT;