package main

import (
	"github.com/CESARBR/knot-gateway-webui/backend/internal/config"
	"github.com/CESARBR/knot-gateway-webui/backend/pkg/server"

	"github.com/CESARBR/knot-gateway-webui/backend/pkg/logging"
	"github.com/CESARBR/knot-gateway-webui/backend/pkg/services"
)

func main() {
	logger := logging.Get("Main")
	logger.Info("Starting KNoT Gateway WebUI Backend")

	config := config.Load()

	ds, err := services.NewDeviceService()
	if err != nil {
		panic(err)
	}

	logger.Info("Connect on dbus system", ds)
	devices, err := ds.ListDevices()
	if err != nil {
		logger.Error(err)
	}

	for _, device := range devices {
		logger.Infof("Id: %s Name: %s\n", device.Id, device.Name)
	}

	server := server.New(config.Server.Port)
	server.Start()
}
