package sandboxserver

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	pb "github.com/adjsky/playground/server/rpc/sandbox"
	"github.com/twitchtv/twirp"
)

var languages = map[pb.Languages]string{
	pb.Languages_JAVASCRIPT: "javascript",
	pb.Languages_TYPESCRIPT: "typescript",
	pb.Languages_GOLANG:     "golang",
}

var filenames = map[pb.Languages]string{
	pb.Languages_JAVASCRIPT: "index.js",
	pb.Languages_TYPESCRIPT: "index.ts",
	pb.Languages_GOLANG:     "main.go",
}

var compileCommands = map[pb.Languages]string{
	pb.Languages_JAVASCRIPT: "node %s",
	pb.Languages_TYPESCRIPT: "ts-node %s",
	pb.Languages_GOLANG:     "go run %s",
}

const SECONDS_TO_RUN = 1 * time.Second

func (s *Server) RunCode(ctx context.Context, req *pb.RunCodeRequest) (res *pb.RunCodeResponse, err error) {
	dirName := fmt.Sprintf("sandbox-%s", languages[req.Language])
	dirPath, err := os.MkdirTemp("", dirName)
	if err != nil {
		return nil, twirp.InternalError(err.Error())
	}
	defer os.RemoveAll(dirPath)

	file := filepath.Join(dirPath, filenames[req.Language])
	if err := os.WriteFile(file, []byte(req.Code), 0666); err != nil {
		return nil, twirp.InternalError(err.Error())
	}

	var out bytes.Buffer

	compileCommand := strings.Split(fmt.Sprintf(compileCommands[req.Language], file), " ")
	cmd := exec.Command(compileCommand[0], compileCommand[1:]...)
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
