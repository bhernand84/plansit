package plansit

import(
	"net/http"
	"html/template"
	"models"
)

var (
	indexTemplate = template.Must(template.ParseFiles("index.html"))

)
func init(){
	http.HandleFunc("/",root)
}

func root(w http.ResponseWriter, r *http.Request){
	myPlace := &places.Place{}
	myPlace.Add("hello", "009090920")

	indexTemplate.Execute(w, myPlace.Title())
}

