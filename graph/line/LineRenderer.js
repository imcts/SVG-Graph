import GraphRenderer from '../abstract/GraphRenderer'
import CircleRenderer from './CircleRenderer'
import NewReview from '../../../../../../store/reducer/review/detail/model/emotion/new/NewReview'
import Assertion from '../../../../../../../util/assertion/Assertion'

const LineRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  static #TOP = 64
  static #BOTTOM = 198
  static #PERCENTILE_RANGE = 100
  
  #element
  #circle
  #length
  #from
  #to
  #rendered
  
  static of (lineElement, circleElement, newReview, x, distance, topReviewCount, from, to) {
    return new LineRenderer(this.#PRIVATE, lineElement, circleElement, newReview, x, distance, topReviewCount, from, to)
  }

  constructor (PRIVATE, lineElement, circleElement, newReview, x, distance, topReviewCount, from, to) {
    Assertion.assertPrivate(PRIVATE, LineRenderer.#PRIVATE)
    Assertion.assertInstanceOf(lineElement, SVGLineElement)
    Assertion.assertInstanceOf(circleElement, SVGCircleElement)
    Assertion.assertInstanceOf(newReview, NewReview)
    Assertion.assertNumber(x)
    Assertion.assertNumber(distance)
    Assertion.assertNumber(topReviewCount)
    Assertion.assertNumber(from)
    Assertion.assertNumber(to)
    super()
    const x2 = x + distance
    const y2 = this.#calculateY(newReview.getNext(), topReviewCount)
    this.#element = lineElement
    this.#from = from
    this.#to = to
    this.#circle = CircleRenderer.of(circleElement, x2, y2)
    this.#length = this.#setAttributes(x, this.#calculateY(newReview, topReviewCount), x2, y2)
    this.#rendered = false
  }
  
  #calculateY (newReview, topReviewCount) {
    const ONE_PERCENTILE_OF_HEIGHT = (LineRenderer.#BOTTOM - LineRenderer.#TOP) / LineRenderer.#PERCENTILE_RANGE
    const percentile = newReview.calculatePercentile(topReviewCount)
    const reversedPercentile = Math.abs(LineRenderer.#PERCENTILE_RANGE - percentile)
    return LineRenderer.#TOP + ONE_PERCENTILE_OF_HEIGHT * reversedPercentile
  }
  
  #setAttributes (x1, y1, x2, y2) {
    const element = this.#element
    element.setAttribute('x1', x1)
    element.setAttribute('y1', y1)
    element.setAttribute('x2', x2)
    element.setAttribute('y2', y2)
    const length = element.getTotalLength()
    element.setAttribute('stroke-dasharray', `${length} ${length}`)
    element.setAttribute('stroke-dashoffset', length)
    return length
  }
  
  
  /**
   * ① 총범위 = 최대값 - 최소값
   * ② 특정값 = 범위내 값 - 최소값
   * ③ 퍼센테이지 = 특정값 / 총범위
   */
  async render (progressedRatio) {
    Assertion.assertNumber(progressedRatio)
    if (this.#isRendered()) {
      return
    }
    if (this.#isBiggerEqualThan(progressedRatio)) {
      this.#rendered = true
      this.#circle.render()
      return this.#render(0)
    }
    if (this.#isIncluded(progressedRatio)) {
      const length = this.#length
      const totalRange = this.#to - this.#from
      const ratio = progressedRatio - this.#from
      const progressedPercentile = ratio / totalRange
      return this.#render(length - length * progressedPercentile)
    }
  }
  
  #isBiggerEqualThan (progressedRatio) {
    return progressedRatio >= this.#to
  }
  
  #isIncluded (progressedRatio) {
    return progressedRatio >= this.#from && progressedRatio < this.#to
  }
  
  #render (strokeDashoffset) {
    this.#element.setAttribute('stroke-dashoffset', strokeDashoffset)
  }
  
  #isRendered () {
    return this.#rendered
  }
}

export default LineRenderer
