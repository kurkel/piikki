# piikki
kiva ja pieni piikki native-reactilla


## Client
### Install on Ubuntu for Android

1. Install node (https://nodejs.org/en/download/package-manager/)[https://nodejs.org/en/download/package-manager/]
2. Install Android studio (https://developer.android.com/studio/install.html)[https://developer.android.com/studio/install.html]
	(Custom install with AVD)
3. Download depencies for build and emulator using android ~/Android/Sdk/tools/ & run ./android sdk
	Install 23.0.3 build tools, all under android 6

4. ```npm install react-native-cli -g```
5. In repofolder ```npm install```


### Usage on Android

1. ./android avd and create a device
2. start device
3. In repo folder ```react-native start```
4. In repo folder ```react-native run-android```