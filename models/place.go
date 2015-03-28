package models

import(
	"time"
	"appengine"
	"appengine/datastore"
	"appengine/user"
	"github.com/golang/protobuf/proto"
	"strconv"
)

var CurrentUser *PlansitUser
var C appengine.Context

func Init(c appengine.Context){
	C=c
	u:= user.Current(C)
    GetUser(u.ID)
    if CurrentUser == nil{
    	CurrentUser = create(u.ID, u.Email, u.Email)
    }   
}
func create(userid string, name string, email string) *PlansitUser{
	CurrentUser = &PlansitUser{userid, name, email, nil}
	save()
	return CurrentUser
}
func GetUser(userid string){
	load(userid)
}
func AddTrip(name string, desc string, departure string, length string){
	id := 1
	myTrip := Trip{id, name, time.Now(), desc, departure, length, nil}
	CurrentUser.Trips = append(CurrentUser.Trips, myTrip)
	save()
}
func RemoveTrip(id int){
	tripIndex := getIndexOfTrip(id)
	if tripIndex == -1{
		return
	}
	CurrentUser.Trips = append(CurrentUser.Trips[:tripIndex], CurrentUser.Trips[tripIndex +1:]...)
	save()
}
func GetTrip(id int) *Trip{
	tripIndex := getIndexOfTrip(id)
	if tripIndex == -1 { 
		return nil
	}
	return &CurrentUser.Trips[tripIndex]
}
func getIndexOfTrip(id int) int{
	for index, trip := range CurrentUser.Trips{
		if trip.Id == id {
			return index
		}
	}
	return -1
}

func AddPlace(tripid int, placeId string, notes string){
	trip := GetTrip(tripid)
	if trip !=nil{
		place := Place{placeId,notes, CurrentUser.Userid}
		trip.Places = append(trip.Places, place)
		save()
	}
}
func GetPlaces(tripID int) []Place {
	return GetTrip(tripID).Places
}
func RemovePlace(placeId string, tripName string){
}
func load (userid string) { 
	var user DBCommit		
	error := datastore.Get(C, userKey(C, userid), &user)

	if error == nil{
		data := user.UserData
		protoUser := new(PlansItProto)
		err := proto.Unmarshal(data, protoUser)
		if err != nil {
			C.Infof("unmarshaling error: ", err)
			return
		}
		CurrentUser = &PlansitUser{protoUser.GetGoogleId(), protoUser.GetName(), protoUser.GetEmail(), nil}
		for _, trip := range protoUser.Trips {
			tripid, err := strconv.Atoi(trip.GetId())
			tripcreated, error:=  time.Parse(time.RFC3339, trip.GetDateCreated())
			if err == nil && error == nil {
			plansitTrip:= Trip{tripid, trip.GetName(),tripcreated, trip.GetDescription(), trip.GetDeparture(), trip.GetLength(), nil}
			for _, place := range trip.Places{
				plansitPlace := Place{place.GetPlaceId(), place.GetNotes(), CurrentUser.Userid}
				plansitTrip.Places = append(plansitTrip.Places, plansitPlace)
			}
			CurrentUser.Trips = append(CurrentUser.Trips, plansitTrip)
			}
		}
	}
		
}

func save(){
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
			protoPlace.PlaceId = proto.String(place.Placeid)
			protoPlace.Notes = proto.String(place.Notes)
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

