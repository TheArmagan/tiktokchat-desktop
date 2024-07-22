const { app, BrowserWindow, ipcMain } = require("electron/main");
const { WebcastPushConnection } = require("tiktok-live-connector");
const path = require("node:path");
const { EventEmitter } = require("eventemitter3");

const eventMap = [
  ["member", "Member"],
  ["chat", "Chat"],
  ["gift", "Gift"],
  ["roomUser", "RoomUser"],
  ["like", "Like"],
  ["social", "Social"],
  ["emote", "Emote"],
  ["envelope", "Envelope"],
  ["questionNew", "QuestionNew"],
  ["linkMicBattle", "LinkMicBattle"],
  ["linkMicArmies", "LinkMicArmies"],
  ["liveIntro", "LiveIntro"],
  ["subscribe", "Subscribe"],
  ["follow", "Follow"],
  ["share", "Share"],
  ["streamEnd", "StreamEnd"],
  ["error", "Error"],
];

/** @type {Map<string, WebcastPushConnection>} */
const followedChats = new Map();
const events = new EventEmitter();

function connect({ chats = [], sessionId } = {}) {
  followedChats.forEach((connection, chat) => {
    connection.removeAllListeners();
    connection.disconnect();
    console.log(`Disconnected from ${chat}`);
  });
  followedChats.clear();

  chats.forEach((chat) => {
    const connection = new WebcastPushConnection(chat, {
      sessionId,
      enableWebsocketUpgrade: true
    });
    followedChats.set(chat, connection);
    connection.connect().then(() => {
      console.log(`Connected to ${chat}`);
    });
    eventMap.forEach(([event, name]) => {
      connection.on(event, (data) => {
        events.emit(name, {
          chat,
          data,
        });
      });
    });
  });
}


function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 400,
    minHeight: 600,
    transparent: true,
    backgroundColor: "#00000000",
    frame: false,
    title: "TikTok Chat",
    autoHideMenuBar: true,
    resizable: true,
    maximizable: false,
    minimizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    }
  });

  win.loadFile(path.join(__dirname, "./web/index.html"));

  ipcMain.on(":Minimize", (event) => {
    win.minimize();
  });

  ipcMain.on(":Quit", (event) => {
    app.quit();
  });

  ipcMain.on(":Connect", (event, data) => {
    connect(data);
  });

  eventMap.forEach(([event, name]) => {
    events.on(name, (data) => {
      win.webContents.send(name, data);
    });
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})