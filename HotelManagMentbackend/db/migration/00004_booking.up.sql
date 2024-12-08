-- TABLE: "Booking"
BEGIN;

CREATE TABLE
    "Booking" (
        "ID" serial PRIMARY KEY,
        "UserID" INT NOT NULL REFERENCES "User" ("ID") ON DELETE CASCADE,
        "RoomID" INT NOT NULL REFERENCES "Room" ("ID") ON DELETE CASCADE,
        "StartDate" DATE NOT NULL,
        "EndDate" DATE NOT NULL,
        "TotalPrice" NUMERIC(10, 2) NOT NULL,
        "Status" VARCHAR(50) DEFAULT 'pending' NOT NULL,
        "Created_At" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
    ) TABLESPACE pg_default;

COMMIT;
