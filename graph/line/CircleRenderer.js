import GraphRenderer from '../abstract/GraphRenderer'
import Assertion from '../../../../../../../util/assertion/Assertion'
import {EASING} from '../../../../../constant/animate'

const CircleRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  static #ANIMATION_DURATION = 170
  static #PERCENTILE_RANGE = 100
  
  #element
  
  static of (element, cx, cy) {
    return new CircleRenderer(this.#PRIVATE, element, cx, cy)
  }
  
  constructor (PRIVATE, element, cx, cy) {
    Assertion.assertPrivate(PRIVATE, CircleRenderer.#PRIVATE)
    Assertion.assertInstanceOf(element, SVGCircleElement)
    Assertion.assertNumber(cx)
    Assertion.assertNumber(cy)
    super()
    this.#element = element
    this.#setAttributes(cx, cy)
  }
  
  #setAttributes (cx, cy) {
    const element = this.#element
    element.setAttribute('cx', cx)
    element.setAttribute('cy', cy)
    const {style} = element
    style.transformOrigin = `${cx}px ${cy}px`
    style.transform = 'rotate(-90deg)'
    style.setProperty('stroke-dashoffset', 0)
    style.opacity = 0
  }
  
  async render () {
    GraphRenderer.run(
      this.#progress.bind(this),
      this.#done.bind(this),
      EASING.EASE_OUT_QUINT,
      CircleRenderer.#ANIMATION_DURATION
    )
  }
  
  #progress (progressedRatio) {
    this.#element.style.opacity = progressedRatio / CircleRenderer.#PERCENTILE_RANGE
  }
  
  #done () {
    GraphRenderer.stop()
  }
}

export default CircleRenderer
