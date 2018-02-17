class Observer {
  constructor(name, summary) {
    this.actions = {}
  }

  on(name, action) {
    if (!name) {
      throw new Error('Parameter "name" must be passed as a string')
    }

    if (!action) {
      throw new Error('Parameter "action" must be passed as a function')
    }

    if (!this.actions[name]) {
      this.actions[name] = { notify: action }
    } else {
      this.actions[name].notify = action
    }

    return this
  }

  off(name, callback) {
    if (!name) {
      throw new Error('Parameter "name" must be passed as a string')
    }

    if (this.actions[name]) {
      delete this.actions[name]
    }

    if (callback) {
      callback()
    }

    return this
  }

  offAll(callback) {
    Object.keys(this.actions).forEach((name) => {
      if (this.actions[name]) {
        delete this.actions[name]
      }
    })

    if (callback) {
      callback()
    }

    return this
  }

  emit(name, data) {
    if (!name) {
      throw new Error('Parameter "name" must be passed as a string')
    }

    if (this.actions[name]) {
      this.actions[name].notify.apply(this,
        Array.prototype.slice.call(arguments).slice(1)
      )
    }

    return this;
  }

  emitAll(callback) {
    Object.keys(this.actions).forEach((name) => {
      if (this.actions[name]) {
        this.actions[name].notify.call(this)
      }
    })

    if (callback) {
      callback()
    }

    return this
  }
}

export default Observer
