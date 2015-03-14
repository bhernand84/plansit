package plansit

import(
	"net/http"
	"html/template"
)

var (
	indexTemplate = template.Must(template.ParseFiles("index.html"))

)
func init(){
	http.HandleFunc("/",root)
}

func root(w http.ResponseWriter, r *http.Request){
	indexTemplate.Execute(w, "hello app")
}

