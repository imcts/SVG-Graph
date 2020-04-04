import GraphRenderer from '../abstract/GraphRenderer'
import CircleRenderer from './CircleRenderer'
import EmotionRatio from '../../../../../../store/reducer/review/detail/model/emotion/abstract/EmotionRatio'
import Assertion from '../../../../../../../util/assertion/Assertion'
import {EASING} from '../../../../../constant/animate'

const PieChartRenderer = class extends GraphRenderer {
  static #PRIVATE = Symbol()
  static #SELECTOR_OF_POSITIVE = '.positive'
  static #SELECTOR_OF_NEGATIVE = '.negative'
  static #SELECTOR_OF_MIXED = '.mixed'
  static #PROPERTY_OF_POSITIVE = '--positive-ratio'
  static #PROPERTY_OF_NEGATIVE = '--negative-ratio'
  static #PROPERTY_OF_MIXED = '--mixed-ratio'
  static #ANIMATION_DURATION = 700
  static #ZERO_RATIO = 0
  
  #circles
  
  static of (element, emotionRatio) {
    return new PieChartRenderer(this.#PRIVATE, element, emotionRatio)
  }
  
  constructor (PRIVATE, element, emotionRatio) {
    Assertion.assertPrivate(PRIVATE, PieChartRenderer.#PRIVATE)
    Assertion.assertInstanceOf(element, SVGElement)
    Assertion.assertInstanceOf(emotionRatio, EmotionRatio)
    super()
    this.#bindRatioProperties(element, emotionRatio)
    this.#circles = this.#createCircles(element, emotionRatio)
    Object.freeze(this)
  }
  
  #bindRatioProperties (element, emotionRatio) {
    const {style} = element
    style.setProperty(PieChartRenderer.#PROPERTY_OF_POSITIVE, emotionRatio.getPositiveRatio())
    style.setProperty(PieChartRenderer.#PROPERTY_OF_NEGATIVE, emotionRatio.getNegativeRatio())
    style.setProperty(PieChartRenderer.#PROPERTY_OF_MIXED, emotionRatio.getMixedRatio())
  }
  
  #createCircles (element, emotionRatio) {
    let accumulatedRatio = emotionRatio.getPositiveRatio()
    return new Set([
      this.#createCircleRenderer(
        element.querySelector(PieChartRenderer.#SELECTOR_OF_POSITIVE),
        PieChartRenderer.#ZERO_RATIO,
        accumulatedRatio
      ),
      this.#createCircleRenderer(
        element.querySelector(PieChartRenderer.#SELECTOR_OF_NEGATIVE),
        accumulatedRatio,
        accumulatedRatio += emotionRatio.getNegativeRatio()
      ),
      this.#createCircleRenderer(
        element.querySelector(PieChartRenderer.#SELECTOR_OF_MIXED),
        accumulatedRatio,
        accumulatedRatio + emotionRatio.getMixedRatio()
      )
    ])
  }

  #createCircleRenderer (element, fromRatio, toRatio) {
    return CircleRenderer.of(element, fromRatio, toRatio)
  }
  
  async render () {
    GraphRenderer.run(
      this.#progress.bind(this),
      this.#done.bind(this),
      EASING.EASE_OUT_QUINT,
      PieChartRenderer.#ANIMATION_DURATION
    )
  }
  
  #progress (progressedRatio) {
    for (const circle of this.#circles) {
      circle.render(progressedRatio)
    }
  }
  
  #done () {
    GraphRenderer.stop()
  }
  
  destroy () {
    GraphRenderer.stop()
  }
}

export default PieChartRenderer
