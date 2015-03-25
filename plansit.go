
package plansit

import(
	"net/http"
	"html/template"
	"models"
	"appengine"
	"appengine/user"
	"appengine/datastore"
	"time"
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
    http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, r.URL.Path[1:])
    })
}

func root(w http.ResponseWriter, r *http.Request){
	checkAuth(w,r)
	myPlaces := GetPlace(r)

	indexTemplate.Execute(w, myPlaces)
}

func mapper( w http.ResponseWriter, r *http.Request){
	checkAuth(w,r)
	mapperTemplate.Execute(w, "")
}
func addPlace(w http.ResponseWriter, r * http.Request){
 	placeid, notes := r.FormValue("placeid"), r.FormValue("notes")
 	checkAuth(w, r)
 	place := &models.Place{placeid, notes, currentUser.Userid}	
 	PutPlace(r, place)

 	indexTemplate.Execute(w, placeid +  " "  + notes + " " + currentUser.Email)

}

func checkAuth(w http.ResponseWriter, r *http.Request){ 
	c:= appengine.NewContext(r)
	u:= user.Current(c)
	if u == nil {
        url, err := user.LoginURL(c, r.URL.String())
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.Header().Set("Location", url)
        w.WriteHeader(http.StatusFound)
        return 
    }
    GetUser(r, u)
    if currentUser != nil{
    	var myTrip []models.Trip
    	var myPlaces []models.Place
    	myPlaces[0] = models.Place{"91981981","a nice place","111111"}
    	myTrip[0] = models.Trip{"My trip",time.Now(), "my tupe is gonna be awesome", time.Now(), "15 days", myPlaces }
    	newUser := &models.PlansitUser{u.ID, "hi", u.Email, nil}
    	PutUser(r, newUser)
   	currentUser = &models.PlansitUser{u.ID, "hi", u.Email, nil}
   }
}

func PutUser(r *http.Request, myUser *models.PlansitUser){
	c:= appengine.NewContext(r)
	key := datastore.NewIncompleteKey(c, "User", userKey(c))
	_, err := datastore.Put(c, key, myUser)
    if err !=nil{
    	return
    }
}

func GetUser(r *http.Request, u *user.User) {
	c:= appengine.NewContext(r)
	q := datastore.NewQuery("User").Ancestor(userKey(c)).Filter("Userid=", u.ID)
	var newUsers []models.PlansitUser;
	_, err  := q.GetAll(c, &newUsers)
	if err != nil{
		return 
	}
	if newUsers != nil{
		currentUser= &newUsers[0]
		currentUser.Userid = "1111"
	}
}
func PutPlace(r *http.Request, place *models.Place){
	c:= appengine.NewContext(r)
  	key := datastore.NewIncompleteKey(c, "Place", placeKey(c))
    _, err := datastore.Put(c, key, place)
    if err !=nil{
    	return
    }
}
func GetPlace(r *http.Request) []models.Place{
    c:= appengine.NewContext(r)
    q := datastore.NewQuery("Place").Ancestor(placeKey(c)).Limit(10)
    var places []models.Place
    _, err := q.GetAll(c, &places)
    if err !=nil{
    	return nil
    }
    return places
}

func userKey(c appengine.Context) *datastore.Key {
        // The string "default_guestbook" here could be varied to have multiple guestbooks.
        return datastore.NewKey(c, "User", "default_user", 0, nil)
}
func placeKey(c appengine.Context) *datastore.Key {
        // The string "default_guestbook" here could be varied to have multiple guestbooks.
        return datastore.NewKey(c, "Place", "default_place", 0, nil)
}



