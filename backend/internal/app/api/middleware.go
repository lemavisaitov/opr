package api

import "context"

var showDebugInfoKey = &ContextKey{Name: "showDebugInfo"}

func HidesDebugInfo(ctx context.Context) bool {
	value := ctx.Value(showDebugInfoKey)
	if value == nil {
		return true
	}
	return !value.(bool)
}

// ContextKey is a value for use with context.WithValue. It's used as
// a pointer, so it fits in an interface{} without allocation. This technique
// for defining context keys was copied from Go 1.7's new use of context in net/http.
type ContextKey struct {
	Name string
}
