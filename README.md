# NEStation

[NEStation](https://afska.github.io/nestation) is a web NES emulator frontend (based on [jsnes](https://github.com/bfirsh/jsnes)), which supports two-player Net Play via [WebRTC](https://webrtc.org)'s p2p data channels.

> <img alt="rlabs" width="16" height="16" src="https://user-images.githubusercontent.com/1631752/116227197-400d2380-a72a-11eb-9e7b-389aae76f13e.png" /> Created by [[r]labs](https://r-labs.io).

# Screenshots

![nestation-iddle](https://user-images.githubusercontent.com/1631752/60856070-53a96c00-a1dc-11e9-8b42-96b29898f490.png)
![nestation-playing](https://user-images.githubusercontent.com/1631752/60856076-55732f80-a1dc-11e9-857b-c8284b56d72b.png)
![nestation-settings](https://user-images.githubusercontent.com/1631752/60856078-57d58980-a1dc-11e9-8f76-6c610d8dabd6.png)

# Key features

- 🐎 Fullspeed NES Emulation
- 🌐 Low-latency online play
- 📦 ROM Drag & Drop - Easy UX
- 🔀 Swap P1 and P2 at any time
- ⌨️ Configurable controls
- 🎮 Gamepad support
- 📺 CRT TV emulation

# Open-source libraries involved

- [jsnes](https://github.com/bfirsh/jsnes): The core of the emulator
- [peerjs](https://github.com/peers/peerjs): Simple peer-to-peer with WebRTC
- [React](https://github.com/facebook/react): The well-known UI framework
- [NES.css](https://nostalgic-css.github.io/NES.css): An awesome NES-themed css library

# Troubleshooting

## I can't connect to my friend's party!

WebRTC does everything it can to connect you with your partner, but things may fail on rare network configurations. In those cases, a quick workaround could be enabling a [DMZ](<https://en.wikipedia.org/wiki/DMZ_(computing)>) on one side.

## I have stuttering issues!

Then you may want to increase the **Buffer size**, in **Settings**. Lower values offer less input lag, but they can produce stuttering if network latency is not low enough. Try increasing it until it works well.

## Some games don't work!

Well, not all the **NES mappers** are supported. Feel free to raise an issue [here](https://github.com/bfirsh/jsnes/issues) with the game you're trying to run.

## There's a crackling sound!

Make sure you have your speakers' default format set as **96000Hz** at most:

![sound](https://user-images.githubusercontent.com/1631752/60781075-51310e80-a117-11e9-90fa-45b8281eae8d.png)

# Developing

## Install

```bash
nvm use
npm install
```

## Run the app

```bash
npm start
```

## Build

```bash
npm run build
```
