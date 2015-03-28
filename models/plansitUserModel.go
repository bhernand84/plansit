package models

import(
	"time"
)
type PlansitUser struct {
	Userid string
	Name string 	`json:"name"`
	Email string 	`json:"email"`
	Trips []Trip 	`json:"trips"`
}

type Trip struct{
	Id int
	Name string
	DateCreated time.Time
	Description string
	Departure string
	Length	string
	Places []Place
}
type Place struct{
	Placeid string
	Notes string
	UserID string
}
type DBCommit struct{
	UserID string
	UserData []byte
}



