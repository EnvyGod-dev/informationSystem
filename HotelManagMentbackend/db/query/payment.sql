-- name: CreatePayment :one
INSERT INTO
    "Payment" (
        "BookingID",
        "Amount",
        "PaymentDate",
        "Status"
    )
VALUES
    (
        sqlc.arg('BookingID'),
        sqlc.arg('Amount'),
        sqlc.arg('PaymentDate'),
        sqlc.arg('Status')
    ) RETURNING *;

-- name: GetPayments :many
SELECT
    *
FROM
    "Payment"
ORDER BY
    "PaymentDate" DESC;

-- name: UpdatePaymentStatus :exec
UPDATE
    "Payment"
SET
    "Status" = sqlc.arg('Status')
WHERE
    "ID" = sqlc.arg('ID');

-- name: GetDetailedPayments :many
SELECT
    p."ID" AS PaymentID,
    p."Amount",
    p."PaymentDate",
    p."Status" AS PaymentStatus,
    b."ID" AS BookingID,
    b."StartDate",
    b."EndDate",
    b."TotalPrice",
    b."Status" AS BookingStatus,
    u."ID" AS UserID,
    u."FirstName",
    u."LastName",
    u."Email",
    r."ID" AS RoomID,
    r."RoomType",
    r."Price" AS RoomPrice
FROM
    "Payment" p
    JOIN "Booking" b ON p."BookingID" = b."ID"
    JOIN "User" u ON b."UserID" = u."ID"
    JOIN "Room" r ON b."RoomID" = r."ID"
ORDER BY
    p."PaymentDate" DESC;

-- name: GetUserPayments :many
SELECT
    p."ID" AS PaymentID,
    p."Amount",
    p."PaymentDate",
    p."Status",
    b."ID" AS BookingID,
    b."StartDate",
    b."EndDate",
    b."TotalPrice",
    b."Status" AS BookingStatus
FROM
    "Payment" p
    JOIN "Booking" b ON p."BookingID" = b."ID"
WHERE
    b."UserID" = sqlc.arg('UserID')
ORDER BY
    p."PaymentDate" DESC;

-- name: FindByPaymentID :one
SELECT
    *
FROM
    "Payment"
WHERE
    "ID" = sqlc.arg('ID')
LIMIT
    1;

-- name: DeletePaymentId :exec
DELETE FROM
    "Payment"
WHERE
    "ID" = sqlc.arg('ID');