package models

import(
	"time"
)

type Place struct{
	Place_id string
	Notes string
	UserID string
}

type Trip struct{
	Name string
	DateCreated time.Time
	Description string
	Departure time.Time
	Length	string
	Places []Place
}
type PlansitUser struct {
	Userid string
	Name string
	Email string
	Trips []Trip
}

