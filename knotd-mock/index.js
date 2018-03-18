var DBus = require('dbus');

var SERVICE_NAME = 'br.org.cesar.knot';
var DEVICE_INTERFACE_NAME = 'br.org.cesar.knot.Device1';
var DEVICE_OBJECT_PATH = '/';

var OBJECT_MANAGER_INTERFACE = 'org.freedesktop.DBus.ObjectManager';

var properties = {
  id: '1234',
  name: 'KNoT Device',
  online: false,
  registered: false
};

// function createDevicesInterface(object) {
//   var devicesInterface = object.createInterface(DEVICE_INTERFACE_NAME);

//   // Methods
//   devicesInterface.addMethod('Pair', { in: [ dbus.Define(Object) ] }, function (obj, callback) {
//     console.log('Pair method called');
//     callback(null, null);
//   });
//   devicesInterface.addMethod('Forget', {}, function (callback) {
//     console.log('Forget method called');
//     callback(null, null);
//   });

//   devicesInterface.addProperty('Id', {
//     type: 'y', // eslint-disable-line new-cap
//     getter: function (callback) {
//       callback(null, properties.id);
//     }
//   });
//   // Properties
//   devicesInterface.addProperty('Name', {
//     type: dbus.Define(String), // eslint-disable-line new-cap
//     getter: function (callback) {
//       callback(null, properties.name);
//     }
//   });
//   devicesInterface.addProperty('Online', {
//     type: dbus.Define(Boolean), // eslint-disable-line new-cap
//     getter: function (callback) {
//       callback(null, properties.online);
//     }
//   });
//   devicesInterface.addProperty('Registered', {
//     type: dbus.Define(Boolean), // eslint-disable-line new-cap
//     getter: function (callback) {
//       callback(null, properties.registered);
//     }
//   });
//   devicesInterface.update();
// }

// function createObjManagerInterface(object) {
//   var objManagerInterface = object.createInterface(OBJECT_MANAGER_INTERFACE);
//   // Methods
//   objManagerInterface.addMethod('GetManagedObjects',
//     { out: {type:'a{oa{sa{sv}}}'} }, function(callback) {
//       var tmp = [
//         {objManagerInterface: [{'test':[{'property':12}]}]
//         }
//       ];
//       var tmp2 = [{'/': {'ada':1}}];
//       callback(null, tmp2);
//   });
//   objManagerInterface.update();
// }

function main() {
  // var service = dbus.registerService('system', SERVICE_NAME);
  // var object = service.createObject(DEVICE_OBJECT_PATH);
  // createDevicesInterface(object);
  // createObjManagerInterface(object);
  var dbus = new DBus();
  var bus = dbus.getBus('system');
  bus.getInterface(SERVICE_NAME, DEVICE_OBJECT_PATH, OBJECT_MANAGER_INTERFACE, function (err, result) {
    if(err)
      console.error(err);
    else
      result.GetManagedObjects(null, function (err2, objects){
        console.log(objects);
      });
  });

  console.log('KNoTd started');
}

main();
