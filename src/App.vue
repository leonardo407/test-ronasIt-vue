<template>
  <div id="app">
    <the-loader v-if="isPreloaderVisible"/>

    <div class="container">
      <div class="header d-flex justify-content-between">

        <div class="header-city-block d-flex align-items-center" v-if="isCityBlockVisible">
          <multiselect
              :options="cityOptionList"
              label="name"
              :value="selectedCity"
              placeholder="Выберите город"
              selectLabel=""
              deselectLabel=""
              selectedLabel="Выбран"
              @select="selectCity"
          />

          <h3 class="header-city-block-btn" @click="confirmCity">ok</h3>
        </div>

        <div v-else>
          <h2>{{weatherData.name}}</h2>
          <div class="header-bottom d-flex align-items-center">
            <p class="header-change-city opacity"
               @click="clickChangeCity"
            >
              Сменить город
            </p>

            <div class="header-location d-flex align-items-center" @click="getPosition">
              <img src="@/assets/img/location.svg" alt="">
              <p class="opacity">Мое местоположение</p>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-start">
          <div class="d-flex align-items-center">
            <div class="header-point opacity">º</div>

            <div class="header-radio-wrapper d-flex">
              <div class="header-radio">
                <input
                    type="radio"
                    name="radio"
                    id="radio1"
                    value="metric"
                    checked
                    @change="radioChange($event.target.value)"
                />
                <label for="radio1">C</label>
              </div>

              <div class="header-radio">
                <input
                    type="radio"
                    name="radio"
                    id="radio2"
                    value="imperial"
                    @change="radioChange($event.target.value)"
                />
                <label for="radio2">F</label>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="middle d-flex align-items-center justify-content-center">
        <div>
          <div class="d-flex align-items-center">
            <img :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" alt="">
            <h1>{{Math.round(weatherData.main.temp)}}º</h1>
          </div>

          <h4 class="middle-description">{{weatherData.weather[0].description}}</h4>
        </div>
      </div>

      <div class="footer">
        <div>
          <p class="opacity">Ветер</p>
          <h4 class="footer-value">{{weatherData.wind.speed}} м/c, {{countSide}}</h4>
        </div>

        <div>
          <p class="opacity">Давление</p>
          <h4 class="footer-value">{{weatherData.main.pressure}} мм рт. ст.</h4>
        </div>

        <div>
          <p class="opacity">Влажность</p>
          <h4 class="footer-value">{{weatherData.main.humidity}}%</h4>
        </div>

        <div>
          <p class="opacity">Вероятность дождя</p>
          <h4 class="footer-value">{{weatherData.clouds.all}}%</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TheLoader from './components/TheLoader'

  export default {
    name: 'App',
    components: { TheLoader },
    data() {
      return {
        isCityBlockVisible: false,
      }
    },
    computed: {
      ...mapState(['weatherData', 'isPreloaderVisible', 'selectedCity', 'cityOptionList']),
      countSide() {
        const deg = this.weatherData.wind.deg
        let degDescription = ''

        if (deg >= 340 && deg <= 20) {
          degDescription = 'северный'
        } else if (deg > 20 && deg < 70) {
          degDescription = 'северо-восточный'
        } else if (deg >= 70 && deg <= 110) {
          degDescription = 'восточный'
        } else if (deg > 110 && deg < 160) {
          degDescription = 'южно-восточный'
        } else if (deg >= 160 && deg <= 200) {
          degDescription = 'южный'
        } else if (deg > 200 && deg < 250) {
          degDescription = 'южно-западный'
        } else if (deg >= 250 && deg <= 290) {
          degDescription = 'западный'
        } else if (deg > 290 && deg < 340) {
          degDescription = 'северо-западный'
        }

        return degDescription
      },
    },
    methods: {
      radioChange(value) {
        this.$store.commit('CHANGE_UNITS_DATA', value)
        this.fetchWeatherData()
      },
      fetchWeatherData() {
        this.$store.dispatch('fetchWeather')
      },
      getPosition() {
        navigator.geolocation.getCurrentPosition(
          position => {
            const coords = position.coords

            this.$store.commit('CHANGE_SELECTED_CITY_COORDS', {
              lat: coords.latitude,
              lon: coords.longitude,
            })

            this.fetchWeatherData()
          },
          error => {
            console.log(error)
          },
        )
      },
      clickChangeCity() {
        this.isCityBlockVisible = true
      },
      confirmCity() {
        this.fetchWeatherData()
        this.isCityBlockVisible = false
      },
      selectCity(value) {
        this.$store.commit('CHANGE_SELECTED_CITY', value)
      },
    },
    mounted() {
      this.fetchWeatherData()
    },
  }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
  #app {
    min-height: 100vh;
    background: $blue;
    border: 1px solid $grey;
    color: $white;
    font-size: 18px;
    line-height: 22px;
    font-family: 'Lato', sans-serif;
  }

  .header {
    margin-top: 75px;

    &-city-block {
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      background-color: $white;
      color: $black;

      &-btn {
        cursor: pointer;
        margin-left: 64px;
        color: $blue;
        text-transform: uppercase;
      }
    }

    &-bottom {
      margin-top: 9px;
    }

    &-change-city {
      cursor: pointer;
    }

    &-location {
      cursor: pointer;
      margin-left: 29px;
    }

    &-point {
      margin-right: 10px;
    }

    &-radio-wrapper {
      width: 77px;
      height: 29px;
      border: 1px solid $white;
      overflow: hidden;
      border-radius: 8px;
    }

    &-radio {
      width: 50%;
      height: 100%;
    }

    input[type='radio'] {
      display: none;
    }

    label {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      user-select: none;
      opacity: 0.4;
    }

    input[type='radio']:checked + label {
      background: rgba(255, 255, 255, 0.2);
      color: $white;
      opacity: 1;
    }
  }

  .middle {
    margin-top: 190px;

    &-description {
      text-align: center;
    }
  }

  .footer {
    margin-top: 218px;
    margin-bottom: 122px;
    display: flex;
    justify-content: space-between;

    &-value {
      margin-top: 10px;
    }
  }
</style>
