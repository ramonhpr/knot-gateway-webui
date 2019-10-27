package entities

type Device struct {
	Id         uint64
	Name       string
	Online     bool
	Paired     bool
	Registered bool
}
