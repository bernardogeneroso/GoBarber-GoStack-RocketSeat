# GoBarber-GoStack-RocketSeat

## Error resolve:
This error occurs on mobile:

The version used in the mobile project, has a bug in Node Modules in the image upload file, here is the link to update the file.

Solution:
```
Path: /node_modules/react-native/Libraries/Image
Filename: RCTLocalAssetImageLoader.mm
```
Link of [file](https://gist.githubusercontent.com/mrcflorian/193675ed672a7579e22600f291f1a08b/raw/ce8dff39495ad445296e88b312020c924b23dd36/RCTLocalAssetImageLoader.mm) to replace

