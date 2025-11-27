## Todo App

-   React Native + Expo
-   @react-native-async-storage/async-storage
-   @react-native-community/datetimepicker
-   expo-image-picker
-   React Native StyleSheet
-   Vercel + gitHub 연동

## deploy site

-   Web: [Web Link](https://react-native-todos.vercel.app/)
-   SDK: [SDK](https://expo.dev/artifacts/eas/2B9uNub8viysTqfurRWALJ.apk)

### mobile testing tool

Expo Go - testing program

### create project

```bash
npx create-expo-app 폴더명 --template blank
```

### run

```bash
npx expo start --clear --tunnel
```

### library

-   uuid

```bash
#### install
npm install react-native-uuid
#### import
import uuid from 'react-native-uuid';
#### use
const myUniqueId = uuid.v4();

```

-   react-native-vector-icons

```bash
#### install
npm install --save react-native-vector-icons
#### import
import { Ionicons } from '@expo/vector-icons';
#### expo/vector-icons-directory
https://icons.expo.fyi/Index

```

-   expo-linear-gradient

```bash
#### install
npx expo install expo-linear-gradient
#### import
import { LinearGradient } from 'expo-linear-gradient';
#### use
                <LinearGradient
                    colors={['#E9DCDB', '#DFDDDD30']} // 시작색, 끝색
                    start={{ x: 0, y: 0 }} // 왼쪽 위
                    end={{ x: 1, y: 0 }} // 오른쪽 위 (약 70deg 느낌)
                    style={styles.gradientWrap}
                ></LinearGradient>
```

### deploy Web (Vercel)

```bash
#### install
npx expo install react-dom react-native-web

```

### App.json file Modify

```javascript
{
  "expo": {
        "platforms": ["ios", "android", "web"],
        },
}
```

### Git push

### https://vercel.com

### project settings

#### Build Command Modify

```plaintext
npx expo export --platform web
```

#### Output Directory

```plaintext
 dist
```

### Deploy

### CONTINUOUS DEPLOY (Vercel and Netlify)

```plaintext
git push
```

### deploy Android (SKD)

#### .aab file (For uploading to Android Store)

```bash
npm install -g eas-cli
eas login > (email, pw) > Logged in
eas init > Y
eas build -p android --profile production
Keystore? Y

RESULT: https://expo.dev/artifacts/eas/ovSupS2WJSrEXJpDwpXo4s.aab

```

#### .apk file (download file)

#### eas.json Modify

```javascript
{
    "production": {
        "autoIncrement": true,
        "android": {
          "buildType": "apk"
        }
      }
}
```

```bash
eas build -p android --profile production
emulator? > no

RESULT: https://expo.dev/artifacts/eas/2B9uNub8viysTqfurRWALJ.apk
```
