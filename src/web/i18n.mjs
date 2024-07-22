export const messageFormats = {
  "en": {
    error: (data) => ({
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
    }),
    like: (data) => ({
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
    }),
    follow: (data) => ({
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
    }),
    chat: (data) => ({
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
    }),
    gift: (data) => ({
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
    }),
    subscribe: (data) => ({
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
    }),
    member: (data) => ({
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
    })
  },
  "tr": {
    error: (data) => ({
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
    }),
    like: (data) => ({
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
          value: ` yayını `,
        },
        {
          color: "whitesmoke",
          value: `${data.likeCount.toLocaleString()}`
        },
        {
          color: "#fb352b",
          value: ` kez beğendi!`,
        },
        {
          color: "gray",
          value: ` (Toplam: ${data.totalLikeCount.toLocaleString()}) `,
        },
      ]
    }),
    follow: (data) => ({
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
          value: ` takip etmeye başladı!`
        }
      ]
    }),
    chat: (data) => ({
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
    }),
    gift: (data) => ({
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
          value: `, `
        },
        {
          color: "whitesmoke",
          value: `${data.repeatCount.toLocaleString()}`
        },
        {
          color: "#ff73fa",
          value: ` adet `
        },
        {
          color: "whitesmoke",
          value: `${data.giftName}`,
        },
        {
          color: "#ff73fa",
          value: ` gonderiyor!`
        },
      ] : [
        {
          color: "whitesmoke",
          value: data.nickname || data.uniqueId,
          title: `@${data.uniqueId}`
        },
        {
          color: "#ff73fa",
          value: `, `
        },
        {
          color: "whitesmoke",
          value: `${data.repeatCount.toLocaleString()}`
        },
        {
          color: "#ff73fa",
          value: ` adet `
        },
        {
          color: "whitesmoke",
          value: `${data.giftName}`,
        },
        {
          color: "#ff73fa",
          value: ` gönderdi!`
        },
      ]
    }),
    subscribe: (data) => ({
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
          value: ` abone oldu!`
        }
      ]
    }),
    member: (data) => ({
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
          value: ` yayına katıldı!`
        }
      ]
    }),
  }
}