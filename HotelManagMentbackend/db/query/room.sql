-- name: CreateRoom :one
INSERT INTO
    "Room" (
        "HotelID",
        "RoomType",
        "Price",
        "IsAvailable",
        "RoomImg"
    )
VALUES
    (
        sqlc.arg('HotelID'),
        sqlc.arg('RoomType'),
        sqlc.arg('Price'),
        sqlc.arg('IsAvailable'),
        sqlc.arg('RoomImg')
    ) RETURNING *;

-- name: GetRoomsByHotelID :many
SELECT
    r."ID" AS RoomID,
    r."RoomType",
    r."Price",
    r."IsAvailable",
    h."Name" AS HotelName,
    h."Address" AS HotelAddress
FROM
    "Room" r
    JOIN "Hotel" h ON r."HotelID" = h."ID"
WHERE
    h."ID" = sqlc.arg('ID')
ORDER BY
    r."Price" ASC;

-- name: GetAllRoomsWithHotels :many
SELECT
    r."ID" AS RoomID,
    r."RoomType",
    r."Price",
    r."IsAvailable",
    h."ID" AS HotelID,
    h."Name" AS HotelName,
    h."Address" AS HotelAddress
FROM
    "Room" r
    JOIN "Hotel" h ON r."HotelID" = h."ID"
ORDER BY
    h."Name" ASC,
    r."Price" ASC;

-- name: UpdateByHotelPrice :exec
UPDATE
    "Room"
SET
    "Price" = sqlc.arg('Price')
WHERE
    "ID" = sqlc.arg('ID');

-- name: UpdateByRoomType :exec
UPDATE
    "Room"
SET
    "RoomType" = sqlc.arg('RoomType')
WHERE
    "ID" = sqlc.arg('ID');