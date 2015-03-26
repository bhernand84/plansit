package models

import(
	"time"
	"appengine"
	"appengine/datastore"
	"appengine/user"
	"github.com/golang/protobuf/proto"
	"strconv"
)
type PlansitUser struct {
	Userid string
	Name string
	Email string
	Trips []Trip
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
func RemoveTrip(id string){

}
func GetTrip(id string) Trip{
	return CurrentUser.Trips[0]
}

func AddPlace(tripid string, placeId string, notes string){
	//add place here
}
func GetPlaces(tripID string) []Place {
	return GetTrip(tripID).Places
}
func RemovePlace(placeId string, tripName string){
}
func  load (userid string) { 
	q := datastore.NewQuery("User").Ancestor(userKey(C)).Filter("UserID=", userid)
	var newUsers []DBCommit;
	_, err  := q.GetAll(C, &newUsers)
	if err != nil{
		return 
	}
	if newUsers != nil{
		data := newUsers[0].UserData
		protoUser := new(PlansItProto)
		err = proto.Unmarshal(data, protoUser)
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
			CurrentUser.Trips = append(CurrentUser.Trips, plansitTrip)
			C.Infof("%v", CurrentUser.Trips)
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
		protoUser.Trips = append(protoUser.Trips, protoTrip)
	}
	data, err := proto.Marshal(protoUser)
	if err != nil {
		C.Infof("marshaling error: ", err)
	}
	dbObject := &DBCommit{CurrentUser.Userid, data}
	
	key := datastore.NewIncompleteKey(C, "User", userKey(C))
	_, error := datastore.Put(C, key, dbObject)
    if error !=nil{
    	C.Infof(error.Error())
    	return
    }
}
func userKey(c appengine.Context) *datastore.Key {
        return datastore.NewKey(c, "User", "default_user", 0, nil)
}

