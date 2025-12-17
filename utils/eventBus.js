// utils/eventBus.js
export const eventBus = {
  _events: {},

  on(eventName, callback) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
  },

  off(eventName, callback) {
    if (!this._events[eventName]) return;
    this._events[eventName] = this._events[eventName].filter((cb) => cb !== callback);
  },

  emit(eventName, data) {
    if (this._events[eventName]) {
      this._events[eventName].forEach((callback) => {
        try {
          callback(data);
        } catch (e) {
          console.error(`Error in event callback for ${eventName}:`, e);
        }
      });
    }
  },
};
