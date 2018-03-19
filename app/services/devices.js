var fs = require('fs');
// var dbus = require('dbus-native');
var DBus = require('dbus');
var config = require('config');

var DEVICES_FILE = config.get('nrfd.devicesFile');
var SERVICE_NAME = "br.org.cesar.knot";
var OBJECT_MANAGER_INTERFACE = "org.freedesktop.DBus.ObjectManager";
var DEVICE_INTERFACE = "br.org.cesar.knot.Device1";
var OBJECT_PATH = '/';

var DevicesServiceError = function DevicesServiceError(message) {
  this.name = 'DevicesServiceError';
  this.message = message;
  this.stack = (new Error()).stack;
};

DevicesServiceError.prototype = Object.create(Error.prototype);
DevicesServiceError.prototype.constructor = DevicesServiceError;


var parseDbusError = function handleDbusError(err) { // eslint-disable-line vars-on-top
  console.log('Unknown error while communicating with devices service:', err); // eslint-disable-line no-console
  return new DevicesServiceError('Devices service is unavailable');
};


var DevicesService = function DevicesService() { // eslint-disable-line vars-on-top
};

function getAllowedDevices(done) {
  var dbus = new DBus();
  var bus = dbus.getBus('system');
  bus.getInterface(SERVICE_NAME, OBJECT_PATH, OBJECT_MANAGER_INTERFACE, function (err, iface) {
    if(err) {
      done(err);
    } else {
      iface.GetManagedObjects(null, function (err2, result) {
        var devices = [];
        for( obj_path in result) {
          if (obj_path !== '/') {
            for( interface in result[obj_path]) {
              if (interface === DEVICE_INTERFACE)
                devices.push(result[obj_path][DEVICE_INTERFACE]);
            }
          }
        }
        bus.disconnect();
        done(null, devices);
      });
    }
  });
}

function getNearbyDevices(done) {
  var dbus = new DBus();
  var bus = dbus.getBus('system');
  bus.getInterface(SERVICE_NAME, OBJECT_PATH, OBJECT_MANAGER_INTERFACE, function (err, iface) {
    if(err) {
      done(err);
    } else {
      iface.GetManagedObjects(null, function (err2, devices) {
        done(null, devices);
      });
    }
  });
}

function setAllowed(devices, allowed) {
  devices.forEach(function onEntry(device) {
    device.allowed = allowed;
  });
}

function mergeDevicesLists(allowedList, nearbyList) {
  // allowed - nearby
  allowedList.forEach(function onEntry(device) {
    var deviceIdx = nearbyList.findIndex(function isSameDevice(nearbyDevice) {
      return nearbyDevice.mac === device.mac;
    });
    if (deviceIdx !== -1) {
      nearbyList.splice(deviceIdx, 1);
    }
  });

  // allowed (union) nearby
  return allowedList.concat(nearbyList);
}

DevicesService.prototype.list = function list(done) {
  getAllowedDevices(function onAllowedDevices(allowedDevicesErr, allowedDevices) {
    if (allowedDevicesErr) {
      done(allowedDevicesErr);
      return;
    }

    setAllowed(allowedDevices, true); // eslint-disable-line no-param-reassign

    getNearbyDevices(function onNearbyDevices(nearbyDevicesErr, nearbyDevices) {
      var devices;
      if (nearbyDevicesErr) {
        done(nearbyDevicesErr);
        return;
      }

      setAllowed(nearbyDevices, false); // eslint-disable-line no-param-reassign

      devices = mergeDevicesLists(allowedDevices, nearbyDevices);
      done(null, devices);
    });
  });
};

function addDevice(device, done) {
  var sysbus = dbus.systemBus();
  device.key = '';
  sysbus.invoke({
    path: '/org/cesar/knot/nrf0',
    destination: 'org.cesar.knot.nrf',
    interface: 'org.cesar.knot.nrf0.Adapter',
    member: 'AddDevice',
    signature: 'sss',
    body: [device.mac, device.key, device.name],
    type: dbus.messageType.methodCall
  }, function onUpsert(dbusErr, upserted) {
    var devicesErr;

    if (dbusErr) {
      devicesErr = parseDbusError(dbusErr);
      done(devicesErr);
      return;
    }

    done(null, upserted); // TODO: verify in which case a device isn't added
  });
}

function removeDevice(device, done) {
  var sysbus = dbus.systemBus();
  sysbus.invoke({
    path: '/org/cesar/knot/nrf0',
    destination: 'org.cesar.knot.nrf',
    interface: 'org.cesar.knot.nrf0.Adapter',
    member: 'RemoveDevice',
    signature: 's',
    body: [device.mac],
    type: dbus.messageType.methodCall
  }, function onRemove(dbusErr, removed) {
    var devicesErr;

    if (dbusErr) {
      devicesErr = parseDbusError(dbusErr);
      done(devicesErr);
      return;
    }

    done(null, removed); // TODO: verify in which case a device isn't removed
  });
}

DevicesService.prototype.update = function update(device, done) {
  if (device.allowed) {
    addDevice(device, done);
  } else {
    removeDevice(device, done);
  }
};

getAllowedDevices(function (err, result) {
  if (err) {
    console.error(err);
  } else {
    // console.log('------');

    result.forEach(function (element) {
      if (element.Online === false) {

      }
    })
  }
})

module.exports = {
  DevicesService: DevicesService,
  DevicesServiceError: DevicesServiceError
};
