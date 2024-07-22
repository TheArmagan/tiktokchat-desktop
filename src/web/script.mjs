import { messageFormats } from "./i18n.mjs";

function getFollowedChats() {
  return localStorage.getItem("followedChats") ? JSON.parse(localStorage.getItem("followedChats")) : [];
}

function getHistorySize() {
  return parseInt(localStorage.getItem("historySize") || 500);
}

function getSessionId() {
  return localStorage.getItem("sessionId") || "";
}

function getLocale() {
  return localStorage.getItem("locale") || "en";
}

const eventNames = ["Error", "Like", "Follow", "Chat", "Gift", "Subscribe", "Member"];

const app = window.app = Vue.createApp({
  data() {
    return {
      selectedTab: "chats",
      messages: {}
    }
  },
  mounted() {
    window.internalApp = this;
    API.controls.connect(getFollowedChats(), getSessionId());

    API.events.on("Error", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-error-warning-line",
            color: "#fb352b"
          }
        ],
        content: [
          {
            color: "whitesmoke",
            value: `${data.info}: `
          },
          {
            color: "#fb352b",
            value: `${data.exception}`
          }
        ]
      });
    });

    eventNames.forEach((eventName) => {
      API.events.on(eventName, ({ chat, data }) => {
        this.addMessage(chat, messageFormats[getLocale()][eventName.toLowerCase()](data, chat));
      });
    });
  },
  methods: {
    minimize() {
      API.controls.minimize();
    },
    quit() {
      API.controls.quit();
    },
    addMessage(chat, message) {
      this.messages[chat] ??= [];
      this.messages[chat].push(message);

      if (this.messages[chat].length > getHistorySize()) {
        this.messages[chat].shift();
      }
    }
  }
});

const componentScripts = {
  "chats-tab": {
    props: ["messages"],
    data() {
      return {
        followedChats: getFollowedChats(),
        selectedChat: localStorage.getItem("selectedChat") || "",
        showEndFade: false,
        autoScrollDown: true
      }
    },
    watch: {
      followedChats() {
        this.checkWidth();
      },
      selectedChatMessages: {
        deep: true,
        handler() {
          this.chatContentScrollToBottom();
        }
      }
    },
    computed: {
      selectedChatMessages() {
        return this.messages[this.selectedChat] || [];
      }
    },
    mounted() {
      if (!this.selectedChat || !this.followedChats.includes(this.selectedChat)) this.selectedChat = this.followedChats[0];
      this.checkWidth();
      this.chatTabsScrollIntoView();
      window.addEventListener("resize", this.checkWidth);
    },
    unmounted() {
      window.removeEventListener("resize", this.checkWidth);
    },
    methods: {

      checkWidth() {
        this.showEndFade = this.$refs.chatTabsWrapper.scrollWidth > window.innerWidth;
      },
      slideForward() {
        this.$refs.chatTabsWrapper.scrollBy({
          left: 200,
          behavior: "smooth"
        });
      },
      slideBackward() {
        this.$refs.chatTabsWrapper.scrollBy({
          left: -200,
          behavior: "smooth"
        });
      },
      chatTabsScrollIntoView() {
        setTimeout(() => {
          this.$refs.chatTabsWrapper.querySelector(".selected")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        }, 50);
      },
      chatContentScrollToBottom() {
        if (this.autoScrollDown) {
          setTimeout(() => {
            this.$refs.chatContent.scrollTo({
              top: this.$refs.chatContent.scrollHeight,
              behavior: "smooth"
            });
          }, 50);
        }
      },
      onSelect(chat) {
        this.selectedChat = chat;
        this.chatTabsScrollIntoView();
        localStorage.setItem("selectedChat", chat);
      }
    }
  },
  "settings-tab": {
    data() {
      return {
        sessionId: getSessionId(),
        followedChats: getFollowedChats(),
        chatName: "",
        historySize: getHistorySize(),
        locale: getLocale()
      };
    },
    methods: {
      removeChat(chat) {
        this.followedChats = this.followedChats.filter(i => i !== chat);
        this.save();
      },
      save() {
        localStorage.setItem("followedChats", JSON.stringify(this.followedChats));
        localStorage.setItem("sessionId", this.sessionId);
        localStorage.setItem("historySize", this.historySize);
        localStorage.setItem("locale", this.locale);
      },
      addChat() {
        let chatName = this.chatName.replaceAll(/@/g, "").trim();
        if (chatName && !this.followedChats.includes(chatName)) {
          this.followedChats.push(chatName);
          this.chatName = "";
          this.save();
        }
      },
      reconnect() {
        internalApp.messages = {};
        API.controls.connect(getFollowedChats(), getSessionId());
      }
    },
    watch: {
      sessionId(value) {
        localStorage.setItem("sessionId", value);
      },
      historySize(value) {
        localStorage.setItem("historySize", value);
      },
      locale(value) {
        localStorage.setItem("locale", value);
      }
    }
  }
};

document.querySelectorAll("[component]").forEach((el) => {
  app.component(el.getAttribute("component"), {
    template: el.innerHTML,
    ...(componentScripts[el.getAttribute("component")] || {})
  });
});

app.mount("#app");