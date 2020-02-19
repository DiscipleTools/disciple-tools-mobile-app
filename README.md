# Disciple Tools Mobile App

The React Native code base for the Disciple Tools mobile app.

## Download the App

[![AppStore][appstore-image]][appstore-url]
[![PlayStore][playstore-image]][playstore-url]

## Latest status

| Production                                                                                                                                                        | Development                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [![](https://github.com/DiscipleTools/disciple-tools-mobile-app/workflows/CI%2FCD/badge.svg)](https://github.com/DiscipleTools/disciple-tools-mobile-app/actions) | [![](https://github.com/DiscipleTools/disciple-tools-mobile-app/workflows/CI%2FCD/badge.svg?branch=development)](https://github.com/DiscipleTools/disciple-tools-mobile-app/actions) |

## Team

- [Mobile App Team](https://github.com/orgs/DiscipleTools/teams/mobile-app-lead-team)

## Dependent Repo

- [Disciple Tools Mobile App Plugin](https://github.com/DiscipleTools/disciple-tools-mobile-app-plugin)

## Basic Design Idea

![Basic Design Idea](https://github.com/DiscipleTools/disciple-tools-mobile-app-plugin/raw/master/mobile-app-design.png)

## Installation (Development)

- [Set up React Native (expo)](https://facebook.github.io/react-native/docs/getting-started)

```
npm install
npm start
```

Currently pure React Native, can be 'ejected' to integrate native code when the need arises.

## Installation (Demo)

To try out the app without setting up the development environment, download the "expo" app on iOS or Android:

[Expo Client (iOS)](https://itunes.apple.com/us/app/expo-client/id982107779?mt=8)

[Expo Client (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US)

Then open the url https://expo.io/@discipletools/discipletoolsapp to view within the expo app.

## DataStore

Information on the redux setup for managing data: [Data Store](https://github.com/DiscipleTools/disciple-tools-mobile-app/tree/master/store)

## Tests

Run all tests:

```
npm run test
```

Run individual tests by search pattern:

```
npx jest MySearchQuery
npx jest TextField
npx jest components/*
```

[appstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/badges/appstore.png
[playstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/badges/playstore.png
[appstore-url]: https://apps.apple.com/us/app/d-t/id1483836867
[playstore-url]: https://play.google.com/store/apps/details?id=tools.disciple.app

## Contributing

[Contributing Guide](https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/CONTRIBUTING.md)
