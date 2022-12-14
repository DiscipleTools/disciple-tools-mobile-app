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
- OAuth2 plugin (coming soon)

## Offline Usage

[Offline Usage Guide](https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/OFFLINE.md)

## Basic Design Idea

![Basic Design Idea](https://github.com/DiscipleTools/disciple-tools-mobile-app-plugin/raw/master/mobile-app-design.png)

## Installation (Development)

- [Set up Expo](https://docs.expo.dev/get-started/installation/)
- Clone this repository
- Download the "Expo" app on iOS or Android:
  - [Expo Client (iOS)](https://apps.apple.com/us/app/expo-go/id982107779)
  - [Expo Client (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent&gl=US)
- Run the following commands:

```
npm install
npm start
OR
expo start
```

- Run in Simulator:

  - Press a │ open Android (Studio): https://docs.expo.dev/workflow/android-studio-emulator/
  - Press i | open iOS (XCode): https://docs.expo.dev/workflow/ios-simulator/

- Run on device (phone) via Expo:

  - Scan the QR code above with Expo Go (Android) or the Camera app (iOS), or
  - or, manually open Expo app on phone and select appropriate option from under "Development servers"
  - (NOTE: Your phone must be on the same local network as the development computer)
  - To run on the phone you will first need to patch the diff with `npm run patch:List`
  - Before committing make sure to unpatch using `npm run unpatch:List`

- Recently tested with the following library versions:
  - Node v14 or v16 (or should work with latest)
  - Expo CLI v5+

### Issues

#### HTTPS

You MUST connect to a D.T. instance URL with https protocol, otherwise it will fail to connect with

"Network Error"

If you are using a local D.T. instance without SSL, you can use a service like ngrok or cloudflared to create a tunnel to an https address.

With this solution, you would then also need to change the values of `home` and `siteurl` in the `dt_options` table in your WP database.

#### Firewall

If running on a device using Expo, you may need to open the necessary port on your computer to allow expo to access the app.

## DataStore

Information on the redux setup for managing data: [Data Store](https://github.com/DiscipleTools/disciple-tools-mobile-app/tree/development/store)

## Tests

Run all tests:

```
npm run test
```

[appstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/assets/badges/appstore.png
[playstore-image]: https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/assets/badges/playstore.png
[appstore-url]: https://apps.apple.com/us/app/d-t/id1483836867
[playstore-url]: https://play.google.com/store/apps/details?id=tools.disciple.app

## Design Decisions

General:

- Offline-First (via dispatch to Redux onAppBackground & persistent FIFO request queue for API writes)
- Aggressive data fetching, preferring to get all vs. pagination (so that data is available offline)
- CNonce: PIN (3 sec)
- (Coming soon) Accessibility (double as Test IDs?)

UI/Framework-specific:

- Functional Components vs. Class
- Modular component design to mirror D.T Post Types and Fields, and dynamically respond to API changes, and support plugins
- Custom Hooks - map well to REST endpoints
- SWR (stale-while-revalidate), also meets requirement for background fetching, onFocus fetching (prevent stale data on refocus of app)
- Redux AND Context - Redux handles any persisted state, and Context is in-memory, runtime app state
- Prefer Skeletons to Spinners, except for Button Actions
- Minimize 3rd party dependencies where possible (eg, implement own Login form validation vs. something like Formik). Purpose: long-term maintenance (since this is an OSS project with volunteers), fewer library preference debates, less app bloat
- SecureStore - use as much as practical
- Component Library: N/A (removed Native Base)
- Abstract service libraries (ie, Expo, SWR, Axios) via Hooks, in case we want to swap for something else later

## Contributing

[Contributing Guide](https://github.com/DiscipleTools/disciple-tools-mobile-app/blob/development/CONTRIBUTING.md)
