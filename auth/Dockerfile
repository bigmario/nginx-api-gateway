FROM golang
WORKDIR /coffee
COPY main.go .
RUN go build main.go
EXPOSE 8080
ENTRYPOINT ["./main"]