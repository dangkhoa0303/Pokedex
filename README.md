# Pokedex

This is a Pokedex application (for Android and iOS) developed using React Native. PokeAPI and PokeMiners are the primary sources of data.

## Getting started

To run this project, 
1. Clone/download the project
2. Run `npm install`
3. To start iOS application, run `react-native run-ios`
4. To start Android application, 
   1. If you have Java version < 16, run `react-native run-android`. Skip step 4.ii.
   2. If you have Java version 16, run `react-native bundle --platform android --dev false --entry-file index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`. Then, run `react-native start`. Then, open Android Studio. Finally, compile and run the project within Android Studio.

## Disclaimer

This project is not for commercial. All data is the property of PokeAPI. All the images (other than Pokemon images) are the properties of The Pokemon Company and Niantic. Please respect the original source material.
