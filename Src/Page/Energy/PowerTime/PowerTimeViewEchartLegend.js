/**
 * @param devCode: device code
 * @param stationId: station id
 * @param devices: station list from server
 * @returns {Array}: device names array, such as "["#1_storageOne", "#2_storageTwo"]"
 */
export default function (devCode, stationId, devices): [string] {
    const selectedDevices = [];
    if (devices
        && Array.isArray(devices)
        && devices.length
    ) {
        devices.forEach(stationObj => {
            // Select all stations, my stations or shared stations
            if (stationObj.stationId === stationId
                && !devCode
                && stationObj.child
                && Array.isArray(stationObj.child)
            ) {
                // my stations or shared stations
                if (stationObj.child.length) {
                    const index = devices.findIndex(item => item.stationId === stationId);
                    const temStationObj = devices[index];
                    temStationObj.child.forEach(stationOrDeviceObj => {
                        // Only one device and only station
                        if (stationOrDeviceObj.code) {
                            const deviceName = stationOrDeviceObj.name;
                            calculateArr(selectedDevices, deviceName);
                            // Multiple stations
                        } else if (stationOrDeviceObj.child
                            && Array.isArray(stationOrDeviceObj.child)
                            && stationOrDeviceObj.child.length
                        ) {
                            stationOrDeviceObj.child.forEach(device => {
                                calculateArr(selectedDevices, device.name);
                            });
                        }
                    });
                    // All stations
                } else {
                    devices.forEach(temStationObj => {
                        temStationObj.child.forEach(stationOrDeviceObj => {
                            // Only one device and only station
                            if (stationOrDeviceObj.code) {
                                const deviceName = stationOrDeviceObj.name;
                                calculateArr(selectedDevices, deviceName);
                                // Multiple stations
                            } else if (stationOrDeviceObj.child
                                && Array.isArray(stationOrDeviceObj.child)
                                && stationOrDeviceObj.child.length
                            ) {
                                stationOrDeviceObj.child.forEach(device => {
                                    calculateArr(selectedDevices, device.name);
                                });
                            }
                        });
                    });
                }
                // Select inner station or specific device
            } else if (stationObj.child
                && Array.isArray(stationObj.child)
                && stationObj.child.length
            ) {
                // Specific device
                if (devCode) {
                    stationObj.child.forEach(stationOrDeviceObj => {
                        // Only one device and only one station
                        if (stationOrDeviceObj.code
                            && stationOrDeviceObj.code === devCode
                        ) {
                            calculateArr(selectedDevices, stationOrDeviceObj.name);
                            // Multiple devices under station
                        } else if (stationOrDeviceObj.child
                            && Array.isArray(stationOrDeviceObj.child)
                            && stationOrDeviceObj.child.length
                        ) {
                            stationOrDeviceObj.child.forEach(device => {
                                if (device.code === devCode) {
                                    calculateArr(selectedDevices, device.name);
                                }
                            });
                        }
                    });
                    // Select station
                } else {
                    stationObj.child.forEach(stationOrDeviceObj => {
                        if (stationOrDeviceObj.stationId === stationId
                            && stationOrDeviceObj.child
                            && Array.isArray(stationOrDeviceObj.child)
                            && stationOrDeviceObj.child.length
                        ) {
                            /**
                             Either Shared Stations or My Stations.
                             If selecting station under Shared Stations, stop adding devices under My Stations.
                             If selecting stations under My Stations, stop adding devices under Shared Stations.
                             */
                            stationId = -1;
                            stationOrDeviceObj.child.forEach(device => {
                                calculateArr(selectedDevices, device.name);
                            });
                        }
                    });
                }
            }
        });
    }

    return selectedDevices;
};

function calculateArr(data, element) {
    // It's required for the following code snippet
    while (data.indexOf(element) >= 0) {
        // Because chart needs different device name to show legend and show dots in tooltip correctly
        element += ' ';
    }
    data.push(element);
    data.push(element);
}
