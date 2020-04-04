import Assertion from '../../../../../../../util/assertion/Assertion'

const GraphRenderer = class {
  static #running = false
  static #frame = null
  static #queue = []
  
  static run (progress, done, timing, duration) {
    Assertion.assertFunction(progress)
    Assertion.assertFunction(done)
    Assertion.assertFunction(timing)
    Assertion.assertNumber(duration)
    const start = performance.now()
    const f = now => {
      let progressedTime = (now - start) / duration
      if (progressedTime > 1) {
        progressedTime = 1
      }
      const progressedFraction = timing(progressedTime)
      if (progressedFraction > 0) {
        progress(progressedFraction * 100)
      }
      if (progressedTime < 1) {
        this.#queue.push(f)
      } else {
        this.#queue.push(done)
      }
    }
    this.#queue.push(f)
    this.#run()
  }
  
  static #run () {
    if (this.#running) {
      return
    }
    this.#running = true
    const f = now => {
      const queue = this.#queue
      for (let i = queue.length; i--;) {
        Assertion.assertFunction(queue.shift())(now)
      }
      if (this.#hasTask()) {
        this.#frame = requestAnimationFrame(f)
      } else {
        this.stop()
      }
    }
    this.#frame = requestAnimationFrame(f)
  }
  
  static stop () {
    if (this.#isNotStopAllowed()) {
      return
    }
    cancelAnimationFrame(this.#frame)
    this.#running = false
  }
  
  static #isNotStopAllowed () {
    return this.#hasTask() || this.#isStopped()
  }
  
  static #hasTask () {
    return !!this.#queue.length
  }
  
  static #isStopped () {
    return !this.#running
  }
  
  async render () {
    Assertion.assertOverride()
  }
}

export default GraphRenderer
