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
        sqlc.arg('IsActive') :: BOOLEAN
    ) RETURNING *;