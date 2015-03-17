
package plansit

import(
	"net/http"
	"html/template"
	"models"
	"appengine"
	"appengine/user"
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
	myPlace := &places.Place{}
	myPlace.Add("hello", "009090920")

	indexTemplate.Execute(w, currentUser.Email)
}

func mapper( w http.ResponseWriter, r *http.Request){
	currentUser.checkAuth(w,r)
	mapperTemplate.Execute(w, "")
}
func addPlace(w http.ResponseWriter, r * http.Request){
 	placeid, notes := r.FormValue("placeid"), r.FormValue("note")
 	currentUser.checkAuth(w, r)
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

