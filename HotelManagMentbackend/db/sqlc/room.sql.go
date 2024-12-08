// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: room.sql

package db

import (
	"context"
)

const createRoom = `-- name: CreateRoom :one
INSERT INTO "Room" (
    "HotelID",
    "RoomType",
    "Price",
    "IsAvailable"
) VALUES (
    $1,
    $2,
    $3,
    $4
) RETURNING "ID", "HotelID", "RoomType", "Price", "IsAvailable", "Created_At"
`

type CreateRoomParams struct {
	HotelID     int32
	RoomType    string
	Price       string
	IsAvailable bool
}

func (q *Queries) CreateRoom(ctx context.Context, arg CreateRoomParams) (Room, error) {
	row := q.db.QueryRowContext(ctx, createRoom,
		arg.HotelID,
		arg.RoomType,
		arg.Price,
		arg.IsAvailable,
	)
	var i Room
	err := row.Scan(
		&i.ID,
		&i.HotelID,
		&i.RoomType,
		&i.Price,
		&i.IsAvailable,
		&i.CreatedAt,
	)
	return i, err
}

const getAllRoomsWithHotels = `-- name: GetAllRoomsWithHotels :many
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
JOIN 
    "Hotel" h ON r."HotelID" = h."ID"
ORDER BY 
    h."Name" ASC, r."Price" ASC
`

type GetAllRoomsWithHotelsRow struct {
	Roomid       int32
	RoomType     string
	Price        string
	IsAvailable  bool
	Hotelid      int32
	Hotelname    string
	Hoteladdress string
}

func (q *Queries) GetAllRoomsWithHotels(ctx context.Context) ([]GetAllRoomsWithHotelsRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllRoomsWithHotels)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllRoomsWithHotelsRow
	for rows.Next() {
		var i GetAllRoomsWithHotelsRow
		if err := rows.Scan(
			&i.Roomid,
			&i.RoomType,
			&i.Price,
			&i.IsAvailable,
			&i.Hotelid,
			&i.Hotelname,
			&i.Hoteladdress,
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

const getRoomsByHotelID = `-- name: GetRoomsByHotelID :many
SELECT 
    r."ID" AS RoomID,
    r."RoomType",
    r."Price",
    r."IsAvailable",
    h."Name" AS HotelName,
    h."Address" AS HotelAddress
FROM 
    "Room" r
JOIN 
    "Hotel" h ON r."HotelID" = h."ID"
WHERE 
    h."ID" = $1
ORDER BY 
    r."Price" ASC
`

type GetRoomsByHotelIDRow struct {
	Roomid       int32
	RoomType     string
	Price        string
	IsAvailable  bool
	Hotelname    string
	Hoteladdress string
}

func (q *Queries) GetRoomsByHotelID(ctx context.Context, id int32) ([]GetRoomsByHotelIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getRoomsByHotelID, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetRoomsByHotelIDRow
	for rows.Next() {
		var i GetRoomsByHotelIDRow
		if err := rows.Scan(
			&i.Roomid,
			&i.RoomType,
			&i.Price,
			&i.IsAvailable,
			&i.Hotelname,
			&i.Hoteladdress,
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

const updateByHotelPrice = `-- name: UpdateByHotelPrice :exec
UPDATE
    "Room"
SET
    "Price" = $1
WHERE
    "ID" = $2
`

type UpdateByHotelPriceParams struct {
	Price string
	ID    int32
}

func (q *Queries) UpdateByHotelPrice(ctx context.Context, arg UpdateByHotelPriceParams) error {
	_, err := q.db.ExecContext(ctx, updateByHotelPrice, arg.Price, arg.ID)
	return err
}

const updateByRoomType = `-- name: UpdateByRoomType :exec
UPDATE
    "Room"
SET
    "RoomType" = $1
WHERE
    "ID" = $2
`

type UpdateByRoomTypeParams struct {
	RoomType string
	ID       int32
}

func (q *Queries) UpdateByRoomType(ctx context.Context, arg UpdateByRoomTypeParams) error {
	_, err := q.db.ExecContext(ctx, updateByRoomType, arg.RoomType, arg.ID)
	return err
}
