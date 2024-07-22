function getFollowedChats() {
  return localStorage.getItem("followedChats") ? JSON.parse(localStorage.getItem("followedChats")) : [];
}

function getHistorySize() {
  return parseInt(localStorage.getItem("historySize") || 500);
}

function getSessionId() {
  return localStorage.getItem("sessionId") || "";
}

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

    API.events.on("Like", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-heart-line",
            color: "#fb352b"
          }
        ],
        content: [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "#fb352b",
            value: ` liked your stream `,
          },
          {
            color: "whitesmoke",
            value: `${data.likeCount.toLocaleString()}`
          },
          {
            color: "#fb352b",
            value: ` times! `,
          },
          {
            color: "gray",
            value: ` (Total: ${data.totalLikeCount.toLocaleString()}) `,
          },
        ]
      });
    });

    API.events.on("Follow", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-user-follow-line",
            color: "#1999e6"
          }
        ],
        content: [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "#1999e6",
            value: ` just started following!`
          }
        ]
      });
    });

    API.events.on("Chat", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        content: `${data.nickname}: ${data.comment}`,
        icons: [
          {
            type: "image",
            value: data.profilePictureUrl
          },
          ...data.userBadges.filter(i => i.type === "image").map(i => ({ type: "image", value: i.url }))
        ],
        content: [
          {
            color: "#1999e6",
            value: `${data.nickname || data.uniqueId}: `,
            title: data.uniqueId
          },
          {
            color: "whitesmoke",
            value: data.comment
          }
        ]
      });
    });

    API.events.on("Gift", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-hearts-line",
            color: "#ff73fa"
          }
        ],
        content: data.giftType === 1 && !data.repeatEnd ? [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "#ff73fa",
            value: ` is sending gift `
          },
          {
            color: "whitesmoke",
            value: `${data.giftName}`,
          },
          {
            color: "#ff73fa",
            value: ` x`
          },
          {
            color: "whitesmoke",
            value: `${data.repeatCount.toLocaleString()}`
          }
        ] : [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "#ff73fa",
            value: ` sent gift `
          },
          {
            color: "whitesmoke",
            value: `${data.giftName}`,
          },
          {
            color: "#ff73fa",
            value: ` x`
          },
          {
            color: "whitesmoke",
            value: `${data.repeatCount.toLocaleString()}`
          }
        ]
      });
    });

    API.events.on("Subscribe", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-vip-crown-2-line",
            color: "#fad400"
          }
        ],
        content: [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "#fad400",
            value: ` subscribed!`
          }
        ]
      });
    });

    API.events.on("Member", ({ chat, data }) => {
      this.addMessage(chat, {
        createdAt: new Date().toISOString(),
        icons: [
          {
            type: "class",
            value: "ri-arrow-down-double-line",
            color: "gray"
          }
        ],
        content: [
          {
            color: "whitesmoke",
            value: data.nickname || data.uniqueId,
            title: `@${data.uniqueId}`
          },
          {
            color: "gray",
            value: ` joined to stream!`
          }
        ]
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
        historySize: getHistorySize()
      };
    },
    methods: {
      removeChat(chat) {
        this.followedChats = this.followedChats.filter(i => i !== chat);
        this.save();
      },
      save() {
        localStorage.setItem("followedChats", JSON.stringify(this.followedChats));
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