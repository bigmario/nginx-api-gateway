FROM golang
RUN mkdir /go-api
ADD . /go-api
WORKDIR /go-api
RUN go build .
EXPOSE 3000
ENTRYPOINT ["./go-server"]