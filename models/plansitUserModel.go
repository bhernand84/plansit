package models

import(
	"time"
)
type PlansitUser struct {
	Userid string `json:-`
	Name string 	`json:"name"`	
	Email string 	`json:"email"`
	Trips []Trip 	`json:"trips"`
}

type Trip struct{
	Id int 	`json:"tripid"`
	Name string	   `json:"name"`
	DateCreated time.Time 	`json:"dateCreated"`
	Description string   	`json:"description"`
	Departure string 	`json:"departure"`
	Length	string 	     `json:"tripLength"`
	Places []Place       `json:"places"`
}
type Place struct{
	Id int  			`json:"id"`
	Placeid string  	`json:"placeid"`
	Notes string 		`json:"notes"`
}
type DBCommit struct{
	UserID string
	UserData []byte
}



