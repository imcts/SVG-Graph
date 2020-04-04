import GraphRenderer from '../abstract/GraphRenderer'
import BackgroundLineRenderer from './BackgroundLineRenderer'
import LineRenderer from './LineRenderer'
import DateRenderer from './DateRenderer'
import NewReviews from '../../../../../../store/reducer/review/detail/model/emotion/new/NewReviews'
import Assertion from '../../../../../../../util/assertion/Assertion'
import {EASING} from '../../../../../constant/animate'

const LineChartRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  static #MARGIN_LEFT = 26
  static #PERCENTILE_RANGE = 100
  static #COORDINATE_COUNT = 6
  static #ANIMATION_DURATION = 1000
  
  #lines
  
  static of (element, newReviews) {
    return new LineChartRenderer(this.#PRIVATE, element, newReviews)
  }
  
  constructor (PRIVATE, element, newReviews) {
    Assertion.assertPrivate(PRIVATE, LineChartRenderer.#PRIVATE)
    Assertion.assertInstanceOf(element, SVGElement)
    Assertion.assertInstanceOf(newReviews, NewReviews)
    super()
    const distance = this.#calculateEachCoordinateDistance(element)
    const startX = LineChartRenderer.#MARGIN_LEFT - distance
    this.#lines = this.#renderLines(element, newReviews, startX, distance)
    this.#renderBackgroundLine(element, startX, distance)
    this.#renderDate(element, newReviews, startX, distance)
  }
  
  #calculateEachCoordinateDistance (element) {
    const {width} = element.getBoundingClientRect()
    const contentWidth = width - LineChartRenderer.#MARGIN_LEFT * 2
    return contentWidth / LineChartRenderer.#COORDINATE_COUNT
  }
  
  #renderLines (element, newReviews, startX, distance) {
    let x = startX
    const topReviewCount = newReviews.getTopReviewCount()
    const newReviewsIterator = newReviews.getIterator()
    const lineGroupIterator = this.#getLineGroupIterator(element)
    const percentileRangeIterator = this.#getPercentileRangeIterator()
    const lines = new Set()
    for (let i = LineChartRenderer.#COORDINATE_COUNT; i--; x += distance) {
      const {value: newReview} = newReviewsIterator.next()
      const {value: lineGroupElement} = lineGroupIterator.next()
      const {value: {from, to}} = percentileRangeIterator.next()
      const lineElement = lineGroupElement.querySelector('line')
      const circleElement = lineGroupElement.querySelector('circle')
      lines.add(LineRenderer.of(lineElement, circleElement, newReview, x, distance, topReviewCount, from, to))
    }
    return lines
  }
  
  * #getLineGroupIterator (element) {
    for (const lineGroup of element.querySelectorAll('.line')) {
      yield lineGroup
    }
  }
  
  * #getPercentileRangeIterator () {
    const percentileRange = LineChartRenderer.#PERCENTILE_RANGE
    const count = LineChartRenderer.#COORDINATE_COUNT
    const percentilePerTotalCoordinates = percentileRange / count
    for (let i = 0, range = 0; i < count; i++) {
      const from = range
      range += percentilePerTotalCoordinates
      if (range > percentileRange) {
        range = percentileRange
      }
      yield {from, to: range}
    }
  }
  
  #renderBackgroundLine (element, startX, distance) {
    let x = startX
    for (const line of element.querySelectorAll('.background-line')) {
      BackgroundLineRenderer.of(line, x)
      x += distance
    }
  }

  #renderDate (element, newReviews, startX, distance) {
    let x = startX
    for (const g of element.querySelectorAll('.date-group')) {
      DateRenderer.of(g, x)
      x += distance
    }
  }
  
  async render () {
    GraphRenderer.run(
      this.#progress.bind(this),
      this.#done.bind(this),
      EASING.EASE_OUT_QUINT,
      LineChartRenderer.#ANIMATION_DURATION
    )
  }
  
  #progress (progressedRatio) {
    for (const line of this.#lines) {
      line.render(progressedRatio)
    }
  }
  
  #done () {
    GraphRenderer.stop()
  }
  
  destroy () {
    GraphRenderer.stop()
  }
}

export default LineChartRenderer
