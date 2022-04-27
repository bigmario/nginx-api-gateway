package main

import (
	"log"
	"net/http"
	"os"
)

func teaHandler(w http.ResponseWriter, r *http.Request) {
	servant, err := os.Hostname()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Write([]byte("Your Coffee has been served by - " + servant))
}

func main() {
	http.HandleFunc("/coffee", teaHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
