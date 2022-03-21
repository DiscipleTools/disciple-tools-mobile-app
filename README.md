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

## Notable Design Decisions

General:

- Offline-First via persistent FIFO request queue for API writes
- Aggressive data fetching, preferring to get all vs. pagination (so that data is available offline)
- CNonce: PIN (10 sec)
- (Coming soon) Accessibility (double as Test IDs?)

UI/Framework-specific:

- Functional Components vs. Class
- Modular component design to mirror D.T Post Types and Fields, and dynamically respond to API changes, and support plugins
- Custom Hooks - map well to REST endpoints 
- SWR (stale-while-revalidate), also meets requirement for background fetching, onFocus fetching (prevent stale data on refocus of app)
- Redux AND Context - Redux handles any persisted state, and Context is in-memory, runtime app state
- Prefer Skeletons to Spinners, except for Button Actions
- Minimize 3rd party dependencies where possible (eg, implement own Login form validation vs. something like Formik). Purpose: long-term maintenance (since this is an OSS project with volunteers), fewer library preference debates, less app bloat
- SecureStore - in addition to obvious values like PIN, password, we also store URL/domain, username (if user specifies to 'Remember Login Details', then we also keep URL/domain, username in Redux as before)
- Component Library: Native Base (v2, but v3 upgrade planned for v1.10+ release)
- Expo libraries should be imported via Hooks, not directly into components (or Screens)
- Screens should not use styles (Screens should use components which use styles) ??

## Installation (Development)

- [Set up React Native (expo)](https://facebook.github.io/react-native/docs/getting-started)

```
npm install
npm start
```

NOTES:
- Requires `native-base@2.13.12`
- Node v16.10
- Expo v5.01

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

[appstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/assets/badges/appstore.png
[playstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/assets/badges/playstore.png
[appstore-url]: https://apps.apple.com/us/app/d-t/id1483836867
[playstore-url]: https://play.google.com/store/apps/details?id=tools.disciple.app

## Contributing

[Contributing Guide](https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/CONTRIBUTING.md)
