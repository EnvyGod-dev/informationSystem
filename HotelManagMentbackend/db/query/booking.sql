-- name: CreateBooking :one
INSERT INTO
    "Booking" (
        "UserID",
        "RoomID",
        "StartDate",
        "EndDate",
        "TotalPrice",
        "Status"
    )
VALUES
    (
        sqlc.arg('UserID'),
        sqlc.arg('RoomID'),
        sqlc.arg('StartDate'),
        sqlc.arg('EndDate'),
        sqlc.arg('TotalPrice'),
        sqlc.arg('Status')
    ) RETURNING *;

-- name: GetListBooking :many
SELECT
    *
FROM
    "Booking";

-- name: UpdateBooking :exec
UPDATE
    "Booking"
SET
    "StartDate" = sqlc.arg('StartDate'),
    "EndDate" = sqlc.arg('EndDate'),
    "TotalPrice" = sqlc.arg('TotalPrice'),
    "Status" = sqlc.arg('Status')
WHERE
    "ID" = sqlc.arg('ID');

-- name: DeleteBooking :exec
DELETE FROM
    "Booking"
WHERE
    "ID" = sqlc.arg('ID');

-- name: GetExpiredBookings :many
SELECT
    *
FROM
    "Booking"
WHERE
    "EndDate" < CURRENT_DATE;

-- name: GetActiveOrNewBookings :many
SELECT
    *
FROM
    "Booking"
WHERE
    "Status" IN ('active', 'new');

-- name: SearchBookingsByDateAndPrice :many
SELECT
    *
FROM
    "Booking"
WHERE
    "EndDate" >= sqlc.arg('MinEndDate')
    AND "TotalPrice" >= sqlc.arg('MinPrice');

-- name: GetBookingsOrderedByStartDate :many
SELECT
    *
FROM
    "Booking"
ORDER BY
    "StartDate" ASC;

-- name: GetUserBookings :many
SELECT
    *
FROM
    "Booking"
WHERE
    "UserID" = sqlc.arg('UserID');

-- name: DeleteBookingIfOwner :exec
DELETE FROM
    "Booking"
WHERE
    "ID" = sqlc.arg('ID')
    AND "UserID" = sqlc.arg('UserID');

-- name: GetBookingUserId :many
SELECT
    *
FROM
    "Booking"
WHERE
    "UserID" = sqlc.arg('UserID');