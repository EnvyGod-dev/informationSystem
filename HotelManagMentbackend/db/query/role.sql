-- name: CreateRole :one
INSERT INTO "Role" (
    "RoleName",
    "Description"
) VALUES (
    sqlc.arg('RoleName'),
    sqlc.arg('Description')
) RETURNING *;

-- name: GetRoles :many
SELECT 
    *
FROM 
    "Role"
ORDER BY 
    "RoleName" ASC;

-- name: UpdateRole :exec
UPDATE 
    "Role"
SET 
    "RoleName" = sqlc.arg('RoleName'),
    "Description" = sqlc.arg('Description')
WHERE 
    "ID" = sqlc.arg('ID');

-- name: DeleteRole :exec
DELETE FROM 
    "Role"
WHERE 
    "ID" = sqlc.arg('ID');
