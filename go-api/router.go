package main

import (
	"net/http"
)

type Router struct {
	rules map[string]map[string]http.HandlerFunc
}

func NewRouter() *Router {
	return &Router{
		rules: make(map[string]map[string]http.HandlerFunc),
	}
}

func (r *Router) FindHandler(path string, method string) (http.HandlerFunc, bool, bool) {
	_, exists := r.rules[path]
	handler, methodExists := r.rules[path][method]
	return handler, methodExists, exists
}

func (r *Router) ServeHTTP(w http.ResponseWriter, request *http.Request) {

	handler, methodExists, exists := r.FindHandler(request.URL.Path, request.Method)

	if !exists {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if !methodExists {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	handler(w, request)
}
