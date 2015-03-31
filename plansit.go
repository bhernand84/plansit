
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
	mapperTemplate = template.Must(template.ParseFiles("views/mapper.html"))
	currentUser *models.PlansitUser
)
func init(){
	http.HandleFunc("/",root)
	http.HandleFunc("/mapper", mapper)
	http.HandleFunc("/place/add", addPlace)
	http.HandleFunc("/trip/add", addTrip)
	http.HandleFunc("/trip/remove", removeTrip)
	http.HandleFunc("/trip/get", getTrip)
	http.HandleFunc("/user/get", getUser)
    http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, r.URL.Path[1:])
    })
} 

func root(w http.ResponseWriter, r *http.Request){
	checkAuth(w,r)
	models.Init(appengine.NewContext(r))
	myUser := models.CurrentUser

	indexTemplate.Execute(w, myUser)
}

func mapper( w http.ResponseWriter, r *http.Request){
	checkAuth(w,r)
	mapperTemplate.Execute(w, "")
}

func addPlace(w http.ResponseWriter, r * http.Request){
 	placeid, notes, tripid := r.FormValue("placeid"), r.FormValue("notes") ,
 	r.FormValue("tripid")
 	r.ParseForm()
 	categoriesArr := r.Form["categories[]"]
 	intTripId, error := strconv.Atoi(tripid)
 	if error == nil{
	 	models.Init(appengine.NewContext(r))
	 	models.AddPlace(intTripId, placeid,notes, categoriesArr)	
	}
}	
func getTrip(w http.ResponseWriter, r *http.Request){
	tripid, err := strconv.Atoi(r.FormValue("tripid"))
	if err == nil {
		models.Init(appengine.NewContext(r))
		trip := models.GetTrip(tripid)
		json.NewEncoder(w).Encode(trip)
	}
}
func getUser(w http.ResponseWriter, r *http.Request){
		models.Init(appengine.NewContext(r))
		user := models.CurrentUser
		json.NewEncoder(w).Encode(user)
}
func addTrip(w http.ResponseWriter, r * http.Request){
 	name, description, departure, length := r.FormValue("name"), r.FormValue("description") ,
 	r.FormValue("departure"), r.FormValue("length") 
 	models.Init(appengine.NewContext(r))
 	models.AddTrip(name, description, departure, length)	
}
func removeTrip(w http.ResponseWriter, r *http.Request){
	tripid, err:= strconv.Atoi(r.FormValue("tripid"))
	if err ==nil{
		models.Init(appengine.NewContext(r))
		models.RemoveTrip(tripid)
	}
}

func checkAuth(w http.ResponseWriter, r *http.Request){ 
	c:= appengine.NewContext(r)
	models.Init(c)
}






