-- name: CreateUser :one
INSERT INTO
    "User" (
        "LastName",
        "FirstName",
        "UserName",
        "Email",
        "IsHashedPassword",
        "IsAdmin",
        "IsUser",
        "IsReception",
        "IsFinance",
        "IsHouseKeeper",
        "IsActive"
    )
VALUES
    (
        sqlc.arg('LastName') :: VARCHAR(100),
        sqlc.arg('FirstName') :: VARCHAR(100),
        sqlc.arg('UserName') :: VARCHAR(100),
        sqlc.arg('Email') :: VARCHAR(100),
        sqlc.arg('IsHashedPassword') :: TEXT,
        sqlc.arg('IsAdmin') :: BOOLEAN,
        sqlc.arg('IsUser') :: BOOLEAN,
        sqlc.arg('IsReception') :: BOOLEAN,
        sqlc.arg('IsFinance') :: BOOLEAN,
        sqlc.arg('IsHouseKeeper') :: BOOLEAN,
        sqlc.arg('IsActive') :: BOOLEAN
    ) RETURNING *;

-- name: GetListUser :many
SELECT 
    *
FROM
    "User"
WHERE
    "IsAdmin" = FALSE 
    OR
    "IsUser" = TRUE
ORDER BY 
    "Created_At" DESC;

-- name: UpdateUserEmail :exec
UPDATE
    "User"
SET 
    "Email" = sqlc.arg('Email')
WHERE
    "ID" = sqlc.arg('ID');

-- name: UpdateUserPassword :exec
UPDATE
    "User"
SET
    "IsHashedPassword" = sqlc.arg('IsHashedPassword')
WHERE
    "ID" = sqlc.arg('ID');

-- name: DeleteUserByID :exec
DELETE FROM
    "User"
WHERE
    "ID" = sqlc.arg('ID');

-- name: GetListAdmin :many
SELECT
    *
FROM
    "User"
WHERE
    "IsAdmin" = TRUE
    OR
    "IsUser" = FALSE
ORDER BY
    "Created_At" DESC;

-- name: GetListReception :many
SELECT
    *
FROM
    "User"
WHERE
    "IsReception" = TRUE
ORDER BY
    "Created_At" DESC;

-- name: GetListHouseKeeper :many
SELECT
    *
FROM
    "User"
WHERE
    "IsHouseKeeper" = TRUE
ORDER BY
    "Created_At" DESC;

-- name: GetListFinance :many
SELECT
    *
FROM
    "User"
WHERE
    "IsFinance" = TRUE
ORDER BY
    "Created_At" DESC;

-- name: GetUserName :one
SELECT
    *
FROM
    "User"
WHERE
    "UserName" = sqlc.arg('UserName')
LIMIT 1;

-- name: FindByUserId :one
SELECT
    *
FROM
    "User"
WHERE
    "ID" = sqlc.arg('ID')
LIMIT 1;