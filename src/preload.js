const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("API", {
  events: {
    on(event, callback) {
      ipcRenderer.on(event, (_, ...args) => callback(...args));
    },
    send(event, ...args) {
      ipcRenderer.send(event, ...args);
    }
  },
  controls: {
    minimize() {
      ipcRenderer.send(":Minimize");
    },
    quit() {
      ipcRenderer.send(":Quit");
    },
    connect(chats, sessionId) {
      ipcRenderer.send(":Connect", { chats, sessionId });
    }
  }
});