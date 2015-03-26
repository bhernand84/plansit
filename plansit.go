
package plansit

import(
	"net/http"
	"html/template"
	"models"
	"appengine"
_	"time"
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
 	models.Init(appengine.NewContext(r))
 	models.AddPlace(tripid, placeid,notes)	
}

func checkAuth(w http.ResponseWriter, r *http.Request){ 
	c:= appengine.NewContext(r)
	models.Init(c)
}






