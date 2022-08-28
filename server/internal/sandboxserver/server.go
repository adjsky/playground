package sandboxserver

import (
	"net/http"

	pb "github.com/adjsky/playground/server/rpc/sandbox"
)

// Server implements the Sandbox service
type Server struct{}

// Start the sandbox server
func Start() {
	server := &Server{}
	twirpHandler := pb.NewSandboxServer(server)

	http.ListenAndServe(":8080", twirpHandler)
}
