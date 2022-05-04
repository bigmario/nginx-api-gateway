package main

func main() {
	server := NewServer(":3000")
	server.Handle("GET", "/", server.AddMiddleware(HandleRoot, Logging()))
	server.Handle("POST", "/create", PostRequest)
	server.Handle("POST", "/user", UserPostRequest)
	server.Handle("POST", "/api", server.AddMiddleware(HandleHome, CheckAuth(), Logging()))
	server.Listen()
}
