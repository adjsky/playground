package sandboxserver

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	pb "github.com/adjsky/playground/server/rpc/sandbox"
	"github.com/twitchtv/twirp"
)

var languages = map[pb.Languages]string{
	pb.Languages_JAVASCRIPT: "javascript",
	pb.Languages_TYPESCRIPT: "typescript",
	pb.Languages_GOLANG:     "golang",
}

const SECONDS_TO_RUN = 1 * time.Second

// Server implements the Sandbox service
type Server struct{}

func (s *Server) RunCode(ctx context.Context, req *pb.RunCodeRequest) (res *pb.RunCodeResponse, err error) {
	dirName := fmt.Sprintf("sandbox-%s", languages[req.Language])
	dirPath, err := os.MkdirTemp("", dirName)
	if err != nil {
		return nil, twirp.InternalError(err.Error())
	}
	defer os.RemoveAll(dirPath)

	file := filepath.Join(dirPath, "index.js")
	if err := os.WriteFile(file, []byte(req.Code), 0666); err != nil {
		return nil, twirp.InternalError(err.Error())
	}

	var out bytes.Buffer

	cmd := exec.Command("node", file)
	cmd.Stdout = &out
	cmd.Stderr = &out

	if err := cmd.Start(); err != nil {
		return nil, twirp.InternalError(err.Error())
	}

	done := make(chan error)
	go func() { done <- cmd.Wait() }()
	select {
	case <-done:
	case <-time.After(SECONDS_TO_RUN):
		cmd.Process.Kill()
	}

	return &pb.RunCodeResponse{
		Result: out.String(),
	}, nil
}

// Start the sandbox server
func Start() {
	server := &Server{}
	twirpHandler := pb.NewSandboxServer(server)

	http.ListenAndServe(":8080", twirpHandler)
}
