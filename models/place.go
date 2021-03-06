
package models

import(
	"time"
	"appengine"
	"appengine/datastore"
	"appengine/user"
	"github.com/golang/protobuf/proto"
	"strconv"
)

var C appengine.Context

func Init(c appengine.Context) *PlansitUser{
	C=c
	u:= user.Current(C)
    CurrentUser := GetUser(u.ID)
    if CurrentUser == nil{
    	CurrentUser = create(u.ID, u.Email, u.Email)
    }
    return CurrentUser   
}
func create(userid string, name string, email string) *PlansitUser{
	CurrentUser := &PlansitUser{userid, name, email, nil}
	save(CurrentUser)
	return CurrentUser
}
func GetUser(userid string) *PlansitUser{
	return load(userid)
}

func AddTrip(CurrentUser *PlansitUser, name string, desc string, departure string, length string){
	id := len(CurrentUser.Trips) +1;
	myTrip := Trip{id, name, time.Now(), desc, departure, length, nil}
	CurrentUser.Trips = append(CurrentUser.Trips, myTrip)
	save(CurrentUser)
}
func RemoveTrip(CurrentUser *PlansitUser, id int){
	tripIndex := getIndexOfTrip(CurrentUser, id)
	if tripIndex == -1{
		return
	}
	CurrentUser.Trips = append(CurrentUser.Trips[:tripIndex], CurrentUser.Trips[tripIndex +1:]...)
	save(CurrentUser)
}
func GetTrip(CurrentUser *PlansitUser, id int) *Trip{
	tripIndex := getIndexOfTrip(CurrentUser, id)
	if tripIndex == -1 { 
		return nil
	}
	return &CurrentUser.Trips[tripIndex]
}
func getIndexOfTrip(CurrentUser *PlansitUser, id int) int{
	for index, trip := range CurrentUser.Trips{
		if trip.Id == id {
			return index
		}
	}
	return -1
}

func AddPlace(CurrentUser *PlansitUser, tripid int, placeId string, notes string, categories []string){
	trip := GetTrip(CurrentUser,tripid)
	if trip !=nil{
		id := len(trip.Places) +1
		place := Place{id, placeId,notes, categories}
		trip.Places = append(trip.Places, place)
		save(CurrentUser)
	}
}
func GetPlaces(CurrentUser *PlansitUser, tripID int) []Place {
	return GetTrip(CurrentUser, tripID).Places
}

func RemovePlace(CurrentUser *PlansitUser, tripId int, placeid int){
	trip := GetTrip(CurrentUser,tripId)
	if trip != nil {
		placeIndex := getIndexOfPlace(placeid, trip)
		if placeIndex == -1 {
			return
		}
		trip.Places = append(trip.Places[:placeIndex], trip.Places[placeIndex +1:]...)
		save(CurrentUser)
	}

}
func getIndexOfPlace(id int, trip *Trip) int{
	for index, place := range trip.Places{
		if place.Id == id {
			return index
		}
	}
	return -1
}
func load (userid string) *PlansitUser { 
	var user DBCommit		
	error := datastore.Get(C, userKey(C, userid), &user)

	if error == nil{
		data := user.UserData
		protoUser := new(PlansItProto)
		err := proto.Unmarshal(data, protoUser)
		if err != nil {
			C.Infof("unmarshaling error: ", err)
			return nil
		}
		CurrentUser := &PlansitUser{protoUser.GetGoogleId(), protoUser.GetName(), protoUser.GetEmail(), nil}
		for _, trip := range protoUser.Trips {
			tripid, err := strconv.Atoi(trip.GetId())
			tripcreated, error:=  time.Parse(time.RFC3339, trip.GetDateCreated())
			if err == nil && error == nil {
			plansitTrip:= Trip{tripid, trip.GetName(),tripcreated, trip.GetDescription(), trip.GetDeparture(), trip.GetLength(), nil}
			for _, place := range trip.Places{
				id,error := strconv.Atoi(place.GetId())
				if error == nil {
					plansitPlace := Place{id, place.GetPlaceId(), place.GetNotes(), place.GetCategories()}
					plansitTrip.Places = append(plansitTrip.Places, plansitPlace)
				}	
			}
			CurrentUser.Trips = append(CurrentUser.Trips, plansitTrip)
			}
		
	}
		return CurrentUser

}
	return nil
}

func save(CurrentUser *PlansitUser){
	protoUser := new(PlansItProto)
	protoUser.GoogleId = proto.String(CurrentUser.Userid)
	protoUser.Email = proto.String(CurrentUser.Email)

	for _,trip := range CurrentUser.Trips{
		protoTrip := new(PlansItProto_Trip)
		protoTrip.Id = proto.String(strconv.Itoa(trip.Id))
		protoTrip.Name = proto.String(trip.Name)
		protoTrip.DateCreated = proto.String(time.Now().Format(time.RFC3339))
		protoTrip.Description = proto.String(trip.Description)
		protoTrip.Departure = proto.String(trip.Departure)
		protoTrip.Length = proto.String(trip.Length)

		for _, place := range trip.Places{
			protoPlace := new(PlansItProto_Place)
			protoPlace.Id = proto.String(strconv.Itoa(place.Id))
			protoPlace.PlaceId = proto.String(place.Placeid)
			protoPlace.Notes = proto.String(place.Notes)
			protoPlace.Categories = place.Categories
			protoTrip.Places = append(protoTrip.Places, protoPlace)
		}
		protoUser.Trips = append(protoUser.Trips, protoTrip)
	}

	data, err := proto.Marshal(protoUser)
	if err != nil {
		C.Infof("marshaling error: ", err)
	}
	dbObject := &DBCommit{CurrentUser.Userid, data}
	
	key := userKey(C, CurrentUser.Userid)
	_, error := datastore.Put(C, key, dbObject)
    if error !=nil{
    	C.Infof(error.Error())
    	return
    }
}
func userKey(c appengine.Context, userid string) *datastore.Key {
        return datastore.NewKey(c, "User", userid,  0, nil)
}

