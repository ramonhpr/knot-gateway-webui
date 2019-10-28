package services

import "github.com/godbus/dbus"

const (
	SERVICE_NAME                  = "br.org.cesar.knot"
	OBJECT_MANAGER_INTERFACE_NAME = "org.freedesktop.DBus.ObjectManager"
	PROPERTIES_INTERFACE_NAME     = "org.freedesktop.DBus.Properties"
	DEVICE_INTERFACE_NAME         = "br.org.cesar.knot.Device1"
	OBJECT_PATH                   = "/"
	ALREADY_EXISTS_ERROR_NAME     = "br.org.cesar.knot.AlreadyExists"
	NOT_PAIRED_ERROR_NAME         = "br.org.cesar.knot.NotPaired"
	IN_PROGRESS_ERROR_NAME        = "br.org.cesar.knot.InProgress"
)

type DeviceService struct {
	conn *dbus.Conn
}

func NewDeviceService() (*DeviceService, error) {
	conn, err := dbus.SystemBus()
	if err != nil {
		return nil, err
	}

	return &DeviceService{conn: conn}, nil
}

func GetManagedObjects(ds *DeviceService) map[dbus.ObjectPath]map[string]map[string]dbus.Variant {
	var objects map[dbus.ObjectPath]map[string]map[string]dbus.Variant
	err := ds.conn.Object(SERVICE_NAME, OBJECT_PATH).Call(OBJECT_MANAGER_INTERFACE_NAME+".GetManagedObjects", 0).Store(&objects)
	if err != nil {
		panic(err)
	}

	return objects
}
