// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: userRole.sql

package db

import (
	"context"
	"time"
)

const assignRoleToUser = `-- name: AssignRoleToUser :one
INSERT INTO "UserRole" (
    "UserID",
    "RoleID",
    "Assigned_At"
) VALUES (
    $1,
    $2,
    CURRENT_TIMESTAMP
) RETURNING "UserID", "RoleID", "Assigned_At"
`

type AssignRoleToUserParams struct {
	UserID int32
	RoleID int32
}

func (q *Queries) AssignRoleToUser(ctx context.Context, arg AssignRoleToUserParams) (UserRole, error) {
	row := q.db.QueryRowContext(ctx, assignRoleToUser, arg.UserID, arg.RoleID)
	var i UserRole
	err := row.Scan(&i.UserID, &i.RoleID, &i.AssignedAt)
	return i, err
}

const getAllUserRoles = `-- name: GetAllUserRoles :many
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
    u."UserName" ASC, r."RoleName" ASC
`

type GetAllUserRolesRow struct {
	Userid      int32
	UserName    string
	RoleName    string
	Description string
	AssignedAt  time.Time
}

func (q *Queries) GetAllUserRoles(ctx context.Context) ([]GetAllUserRolesRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllUserRoles)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllUserRolesRow
	for rows.Next() {
		var i GetAllUserRolesRow
		if err := rows.Scan(
			&i.Userid,
			&i.UserName,
			&i.RoleName,
			&i.Description,
			&i.AssignedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getUserRoles = `-- name: GetUserRoles :many
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
    ur."UserID" = $1
`

type GetUserRolesRow struct {
	UserID      int32
	RoleID      int32
	RoleName    string
	Description string
	AssignedAt  time.Time
}

func (q *Queries) GetUserRoles(ctx context.Context, userid int32) ([]GetUserRolesRow, error) {
	rows, err := q.db.QueryContext(ctx, getUserRoles, userid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUserRolesRow
	for rows.Next() {
		var i GetUserRolesRow
		if err := rows.Scan(
			&i.UserID,
			&i.RoleID,
			&i.RoleName,
			&i.Description,
			&i.AssignedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const removeRoleFromUser = `-- name: RemoveRoleFromUser :exec
DELETE FROM 
    "UserRole"
WHERE 
    "UserID" = $1 AND 
    "RoleID" = $2
`

type RemoveRoleFromUserParams struct {
	UserID int32
	RoleID int32
}

func (q *Queries) RemoveRoleFromUser(ctx context.Context, arg RemoveRoleFromUserParams) error {
	_, err := q.db.ExecContext(ctx, removeRoleFromUser, arg.UserID, arg.RoleID)
	return err
}
