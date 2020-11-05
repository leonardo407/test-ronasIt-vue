import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cityOptionList: [
      { name: 'Краснодар', value: { lat: '45.0328', lon: '38.9769' } },
      { name: 'Москва', value: { lat: '55.7522', lon: '37.6156' } },
      { name: 'Омск', value: { lat: '55', lon: '73.4' } },
      { name: 'Анапа', value: { lat: '44.8908', lon: '37.3239' } },
    ],
    selectedCity: { name: 'Краснодар', value: { lat: '45.0328', lon: '38.9769' } },
    units: 'metric',
    weatherData: {},
    isPreloaderVisible: false,
  },
  mutations: {
    CHANGE_WEATHER_DATA(state, data) {
      state.weatherData = data
    },
    CHANGE_UNITS_DATA(state, data) {
      state.units = data
    },
    CHANGE_SELECTED_CITY(state, data) {
      state.selectedCity = data
    },
    CHANGE_SELECTED_CITY_COORDS(state, data) {
      state.selectedCity.value = data
    },
    CHANGE_PRELOADER_VISIBLE(state, data) {
      state.isPreloaderVisible = data
    },
  },
  actions: {
    async fetchWeather({ state, commit }) {
      commit('CHANGE_PRELOADER_VISIBLE', true)

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${state.selectedCity.value.lat}&lon=${state.selectedCity.value.lon}&appid=${process.env.VUE_APP_API_KEY}&units=${state.units}&lang=ru`,
        )
        const data = await res.json()

        commit('CHANGE_WEATHER_DATA', data)
        commit('CHANGE_PRELOADER_VISIBLE', false)
      } catch (e) {
        console.log(e)
        commit('CHANGE_PRELOADER_VISIBLE', false)
        throw e
      }
    },
  },
})
