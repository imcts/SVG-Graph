import GraphRenderer from '../abstract/GraphRenderer'
import Assertion from '../../../../../../../util/assertion/Assertion'

const CircleRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  
  #element
  #from
  #to
  #circumference
  #distance
  #maximumCircumference

  static of (element, from, to) {
    return new CircleRenderer(this.#PRIVATE, element, from, to)
  }
  
  constructor (PRIVATE, element, from, to) {
    Assertion.assertPrivate(PRIVATE, CircleRenderer.#PRIVATE)
    super()
    this.#element = Assertion.assertInstanceOf(element, SVGCircleElement)
    this.#from = Assertion.assertNumber(from)
    this.#to = Assertion.assertNumber(to)
    this.#circumference = this.#calculateCircumference(element)
    this.#distance = this.#calculateDistancePerCircumference()
    this.#maximumCircumference = this.#calculateMaximumCircumference()
  }
  
  #calculateCircumference (element) {
    return parseFloat(element.getAttribute('r')) * 2 * Math.PI
  }
  
  #calculateDistancePerCircumference () {
    return this.#circumference / 100
  }
  
  #calculateMaximumCircumference () {
    return this.#distance * (this.#to - this.#from)
  }

  async render (progressedRatio) {
    Assertion.assertNumber(progressedRatio)
    if (this.#isBiggerEqualThan(progressedRatio)) {
      return this.#render(this.#circumference - this.#maximumCircumference)
    }
    if (this.#isIncluded(progressedRatio)) {
      const toRenderPercent = progressedRatio - this.#from
      return this.#render(this.#circumference - (this.#distance * toRenderPercent))
    }
  }
  
  #isBiggerEqualThan (progressedRatio) {
    return progressedRatio >= this.#to
  }
  
  #isIncluded (progressedRatio) {
    return progressedRatio >= this.#from && progressedRatio < this.#to
  }
  
  #render (strokeDashoffset) {
    this.#element.style.setProperty('stroke-dashoffset', strokeDashoffset)
  }
}

export default CircleRenderer
