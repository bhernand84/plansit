
package plansit

import(
	"net/http"
	"html/template"
	"models"
	"appengine"
	"appengine/user"
	"appengine/datastore"
)

var (
	indexTemplate = template.Must(template.ParseFiles("views/index.html"))
	mapperTemplate = template.Must(template.ParseFiles("views/mapper.html"))
	currentUser plansitUser
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
	currentUser.checkAuth(w,r)
	myPlaces := GetPlace(r)

	indexTemplate.Execute(w, myPlaces)
}

func mapper( w http.ResponseWriter, r *http.Request){
	currentUser.checkAuth(w,r)
	mapperTemplate.Execute(w, "")
}
func addPlace(w http.ResponseWriter, r * http.Request){
 	placeid, notes := r.FormValue("placeid"), r.FormValue("notes")
 	currentUser.checkAuth(w, r)
 	place := &models.Place{placeid, notes}	
 	PutPlace(r, place)

 	indexTemplate.Execute(w, placeid +  " "  + notes)

}

type plansitUser struct {
	Userid string
	Name string
	Email string
}

func (currentUser *plansitUser) checkAuth(w http.ResponseWriter, r *http.Request){ 
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
    currentUser.Userid = u.ID
    currentUser.Email = u.Email

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

func placeKey(c appengine.Context) *datastore.Key {
        // The string "default_guestbook" here could be varied to have multiple guestbooks.
        return datastore.NewKey(c, "Place", "default_place", 0, nil)
}


