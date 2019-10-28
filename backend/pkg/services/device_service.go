package services

import "github.com/godbus/dbus"
import "github.com/CESARBR/knot-gateway-webui/backend/pkg/entities"

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

func getManagedObjects(ds *DeviceService) map[dbus.ObjectPath]map[string]map[string]dbus.Variant {
	var objects map[dbus.ObjectPath]map[string]map[string]dbus.Variant
	err := ds.conn.Object(SERVICE_NAME, OBJECT_PATH).Call(OBJECT_MANAGER_INTERFACE_NAME+".GetManagedObjects", 0).Store(&objects)
	if err != nil {
		panic(err)
	}

	return objects
}

func (ds *DeviceService) ListDevices() []entities.Device {
	var list []entities.Device
	objects := getManagedObjects(ds)

	for _, dict := range objects {
		for iface, dev := range dict {
			if iface == DEVICE_INTERFACE_NAME {
				if dev["Id"].Value() != nil {
					list = append(list, entities.Device{
						Id:         dev["Id"].String(),
						Name:       dev["Name"].String(),
						Online:     dev["Online"].Value().(bool),
						Registered: dev["Registered"].Value().(bool),
						Paired:     dev["Paired"].Value().(bool),
					})
				}
			}
		}
	}

	return list
}
