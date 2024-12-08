-- name: CreatePayment :one
INSERT INTO "Payment" (
    "BookingID",
    "Amount",
    "PaymentDate",
    "Status"
) VALUES (
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
