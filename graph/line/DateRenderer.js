import GraphRenderer from '../abstract/GraphRenderer'
import Assertion from '../../../../../../../util/assertion/Assertion'

const DateRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  
  static of (element, x) {
    return new DateRenderer(this.#PRIVATE, element, x)
  }
  
  constructor (PRIVATE, element, x) {
    Assertion.assertPrivate(PRIVATE, DateRenderer.#PRIVATE)
    Assertion.assertInstanceOf(element, SVGGElement)
    Assertion.assertNumber(x)
    super()
    this.#setAttributes(
      Assertion.assertInstanceOf(element.querySelector('.circle'), SVGCircleElement),
      Assertion.assertInstanceOf(element.querySelector('.date'), SVGTSpanElement),
      Assertion.assertInstanceOf(element.querySelector('.day'), SVGTSpanElement),
      x
    )
  }
  
  #setAttributes (circle, date, day, x) {
    circle.setAttribute('cx', x)
    date.setAttribute('x', x)
    day.setAttribute('x', x)
  }
  
  async render () {}
}

export default DateRenderer
