-- name: AssignRoleToUser :one
INSERT INTO "UserRole" (
    "UserID",
    "RoleID",
    "Assigned_At"
) VALUES (
    sqlc.arg('UserID'),
    sqlc.arg('RoleID'),
    CURRENT_TIMESTAMP
) RETURNING *;

-- name: GetUserRoles :many
SELECT 
    ur."UserID",
    ur."RoleID",
    r."RoleName",
    r."Description",
    ur."Assigned_At"
FROM 
    "UserRole" ur
JOIN 
    "Role" r ON ur."RoleID" = r."ID"
WHERE 
    ur."UserID" = sqlc.arg('UserID');

-- name: RemoveRoleFromUser :exec
DELETE FROM 
    "UserRole"
WHERE 
    "UserID" = sqlc.arg('UserID') AND 
    "RoleID" = sqlc.arg('RoleID');

-- name: GetAllUserRoles :many
SELECT 
    u."ID" AS UserID,
    u."UserName",
    r."RoleName",
    r."Description",
    ur."Assigned_At"
FROM 
    "UserRole" ur
JOIN 
    "User" u ON ur."UserID" = u."ID"
JOIN 
    "Role" r ON ur."RoleID" = r."ID"
ORDER BY 
    u."UserName" ASC, r."RoleName" ASC;

