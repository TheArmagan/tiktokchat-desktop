import { getFollowedChats, getVisibleEvents, getHistorySize, getSessionId, getLocale } from "./data.mjs";
import { messageFormats } from "./i18n.mjs";

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

    eventNames.forEach((eventName) => {
      API.events.on(eventName, ({ chat, data }) => {
        if (!getVisibleEvents().includes(eventName.toLowerCase())) return;
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
        locale: getLocale(),
        visibleEvents: getVisibleEvents(),
        eventName: "like"
      };
    },
    methods: {
      removeChat(chat) {
        this.followedChats = this.followedChats.filter(i => i !== chat);
        this.save();
      },
      removeEvent(event) {
        this.visibleEvents = this.visibleEvents.filter(i => i !== event);
        this.save();
      },
      save() {
        localStorage.setItem("followedChats", JSON.stringify(this.followedChats));
        localStorage.setItem("visibleEvents", JSON.stringify(this.visibleEvents));
      },
      addChat() {
        let chatName = this.chatName.replaceAll(/@/g, "").trim();
        if (chatName && !this.followedChats.includes(chatName)) {
          this.followedChats.push(chatName);
          this.chatName = "";
          this.save();
        }
      },
      addEvent() {
        if (!this.visibleEvents.includes(this.eventName)) {
          this.visibleEvents.push(this.eventName);
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