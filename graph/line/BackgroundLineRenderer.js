import GraphRenderer from '../abstract/GraphRenderer'
import Assertion from '../../../../../../../util/assertion/Assertion'

const BackgroundLineRenderer = class extends GraphRenderer{
  static #PRIVATE = Symbol()
  static #TOP = 0
  static #BOTTOM = 198
  
  static of (element, x) {
    return new BackgroundLineRenderer(this.#PRIVATE, element, x)
  }
  
  constructor (PRIVATE, element, x) {
    Assertion.assertPrivate(PRIVATE, BackgroundLineRenderer.#PRIVATE)
    Assertion.assertInstanceOf(element, SVGLineElement)
    Assertion.assertNumber(x)
    super()
    element.setAttribute('x1', x)
    element.setAttribute('y1', BackgroundLineRenderer.#TOP)
    element.setAttribute('x2', x)
    element.setAttribute('y2', BackgroundLineRenderer.#BOTTOM)
  }
  
  async render () {}
}

export default BackgroundLineRenderer
