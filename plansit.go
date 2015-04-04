
package plansit

import(
	"net/http"
	"html/template"
	"models"
	"appengine"
	"strconv"
	"encoding/json"
_	"log"
)

var (
	indexTemplate = template.Must(template.ParseFiles("views/index.html"))
	mapperTemplate = template.Must(template.ParseFiles("views/Mapper.html"))
	currentUser *models.PlansitUser
)
func init(){
	http.HandleFunc("/",root)
	http.HandleFunc("/mapper", mapper)
	http.HandleFunc("/place/add", addPlace)
	http.HandleFunc("/place/remove", removePlace)
	http.HandleFunc("/trip/add", addTrip)
	http.HandleFunc("/trip/remove", removeTrip)
	http.HandleFunc("/trip/get", getTrip)
	http.HandleFunc("/user/get", getUser)
    http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, r.URL.Path[1:])
    })
} 

func root(w http.ResponseWriter, r *http.Request){
	myUser := models.Init(appengine.NewContext(r))

	indexTemplate.Execute(w, myUser)
}

func mapper( w http.ResponseWriter, r *http.Request){
	mapperTemplate.Execute(w, "")
}

func addPlace(w http.ResponseWriter, r * http.Request){
 	placeid, notes, tripid := r.FormValue("placeid"), r.FormValue("notes") ,
 	r.FormValue("tripid")
 	r.ParseForm()
 	categoriesArr := r.Form["categories[]"]
 	intTripId, error := strconv.Atoi(tripid)
 	if error == nil{
	 	CurrentUser := models.Init(appengine.NewContext(r))
	 	models.AddPlace(CurrentUser, intTripId, placeid,notes, categoriesArr)	
	}
}	
func removePlace(w http.ResponseWriter, r * http.Request){
	tripid, err := strconv.Atoi(r.FormValue("tripid"))
	placeid, error := strconv.Atoi(r.FormValue("placeid"))
	if err == nil && error == nil{
		CurrentUser := models.Init(appengine.NewContext(r))
		models.RemovePlace(CurrentUser, tripid, placeid)
	}

}
func getTrip(w http.ResponseWriter, r *http.Request){
	tripid, err := strconv.Atoi(r.FormValue("tripid"))
	if err == nil {
		CurrentUser := models.Init(appengine.NewContext(r))
		trip := models.GetTrip(CurrentUser, tripid)
		json.NewEncoder(w).Encode(trip)
	}
}
func getUser(w http.ResponseWriter, r *http.Request){
		CurrentUser := models.Init(appengine.NewContext(r))
		json.NewEncoder(w).Encode(CurrentUser)
}
func addTrip(w http.ResponseWriter, r * http.Request){
 	name, description, departure, length := r.FormValue("name"), r.FormValue("description") ,
 	r.FormValue("departure"), r.FormValue("length") 
 	CurrentUser := models.Init(appengine.NewContext(r))
 	models.AddTrip(CurrentUser,name, description, departure, length)	
}
func removeTrip(w http.ResponseWriter, r *http.Request){
	tripid, err:= strconv.Atoi(r.FormValue("tripid"))
	if err ==nil{
		CurrentUser := models.Init(appengine.NewContext(r))
		models.RemoveTrip(CurrentUser,tripid)
	}
}






