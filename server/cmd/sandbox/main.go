package main

import (
	"net/http"

	"github.com/adjsky/playground/server/internal/sandboxserver"
	"github.com/adjsky/playground/server/rpc/sandbox"
)

func main() {
	server := &sandboxserver.Server{}
	twirpHandler := sandbox.NewHaberdasherServer(server)

	http.ListenAndServe(":8080", twirpHandler)
}
