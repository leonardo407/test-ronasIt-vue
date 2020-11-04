<template>
  <div id="app">
    <the-loader v-if="isPreloaderVisible"/>

    <div class="container">
      <div class="header d-flex justify-content-between">

        <div>
          <h2>{{weatherData.name}}</h2>

          <div class="d-flex align-items-center">
            <p class="opacity">Сменить город</p>

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
            <img src="@/assets/img/cloudy.svg" alt="">
            <h1>{{weatherData.main.temp}}º</h1>
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

        <!--        <div>-->
        <!--          <p class="opacity">Вероятность дождя</p>-->
        <!--          <h4 class="footer-value">10%</h4>-->
        <!--        </div>-->
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
    computed: {
      ...mapState(['weatherData', 'isPreloaderVisible']),
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

            this.$store.commit('CHANGE_CITY_COORDS', {
              lat: coords.latitude,
              lon: coords.longitude,
            })

            this.fetchWeatherData()
          },
        )
      },
    },
    mounted() {
      this.fetchWeatherData()
    },
  }
</script>

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
