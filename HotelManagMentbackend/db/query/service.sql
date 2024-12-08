-- name: CreateService :one
INSERT INTO "Service" (
    "RoomID",
    "Description",
    "RequestedAt",
    "Status"
) VALUES (
    sqlc.arg('RoomID'),
    sqlc.arg('Description'),
    sqlc.arg('RequestedAt'),
    sqlc.arg('Status')
) RETURNING *;

-- name: GetServicesByRoomID :many
SELECT 
    *
FROM 
    "Service"
WHERE 
    "RoomID" = sqlc.arg('RoomID')
ORDER BY 
    "RequestedAt" DESC;


-- name: UpdateStatus :exec
UPDATE
    "Service"
SET
    "Status" = sqlc.arg('Status')
WHERE
    "ID" = sqlc.arg('ID');