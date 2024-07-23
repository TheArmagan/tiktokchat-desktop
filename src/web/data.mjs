export function getFollowedChats() {
  return localStorage.getItem("followedChats") ? JSON.parse(localStorage.getItem("followedChats")) : [];
}

export function getVisibleEvents() {
  return localStorage.getItem("visibleEvents") ? JSON.parse(localStorage.getItem("visibleEvents")) : [
    "chat"
  ];
}

export function getHistorySize() {
  return parseInt(localStorage.getItem("historySize") || 500);
}

export function getSessionId() {
  return localStorage.getItem("sessionId") || "";
}

export function getLocale() {
  return localStorage.getItem("locale") || "en";
}