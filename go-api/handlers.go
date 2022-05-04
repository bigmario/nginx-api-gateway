package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func getServant() string {
	servant, _ := os.Hostname()
	return servant

}

func HandleRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World")
	fmt.Fprintf(w, "\nServed by %v\n", getServant())

}

func HandleHome(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is the API endpoint")
	fmt.Fprintf(w, "\nServed by %v\n", getServant())

}

func PostRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var metadata Metadata
	err := decoder.Decode(&metadata)

	if err != nil {
		fmt.Fprintf(w, "Error: %v", err)
		return
	}
	fmt.Fprintf(w, "Payload %v\n", metadata)
	fmt.Fprintf(w, "\nServed by %v\n", getServant())

}

func UserPostRequest(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var user User
	err := decoder.Decode(&user)

	if err != nil {
		fmt.Fprintf(w, "Error: %v", err)
		return
	}
	response, error := user.toJson()

	if error != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
	w.Write([]byte("\nServed by - " + getServant()))
}
