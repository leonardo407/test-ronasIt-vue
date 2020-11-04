import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    city: 'Krasnodar',
    API_KEY: '799b31d237458c762b4ea6d23f2e5d1c',
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
    CHANGE_CITY_COORDS(state, data) {
      state.cityCoords = data
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
          `https://api.openweathermap.org/data/2.5/forecast/daily?
          q=${state.city}
          &lang=ru
          &appid=${state.API_KEY}
          &units=${state.units}`,
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
