-- name: CreateHotel :one
INSERT INTO "Hotel" (
    "Name",
    "Address",
    "City",
    "Rating"
) VALUES (
    sqlc.arg('Name'),
    sqlc.arg('Address'),
    sqlc.arg('City'),
    sqlc.arg('Rating')
) RETURNING *;

-- name: GetListHotel :many
SELECT  
    *
FROM
    "Hotel"
ORDER BY
    "Created_At" DESC;

-- name: GetListRating :many
SELECT
    *
FROM
    "Hotel"
ORDER BY
    "Rating" DESC;

-- name: FindByHotelName :one
SELECT
    *
FROM
    "Hotel"
WHERE
    "Name" = sqlc.arg('Name')
LIMIT 1;

-- name: UpdateByRating :exec
UPDATE
    "Hotel"
SET
    "Rating" = sqlc.arg('Rating')
WHERE
    "ID" = sqlc.arg('ID');

-- name: UpdateByName :exec
UPDATE  
    "Hotel"
SET
    "Name" = sqlc.arg('Name')
WHERE
    "ID" = sqlc.arg('ID');

-- name: UpdateByAddress :exec
UPDATE
    "Hotel"
SET
    "Address" = sqlc.arg('Address')
WHERE
    "ID" = sqlc.arg('ID');

-- name: DeleteFromHotelID :exec
DELETE FROM
    "Hotel"
WHERE
    "ID" = sqlc.arg('ID');