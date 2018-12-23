<template>
    <div class="hello">
        <div class="holder">

            <h1>Bitcoin Price Index</h1>

            <section v-if="errored">
                <p>We're sorry, we're not able to retrieve this information at the moment, please try back later</p>
            </section>

            <section v-else>
                <div v-if="loading">Loading...</div>

                <div v-else v-for="(currency, index) in info" :key="index + currency.code" class="currency">
                    {{ currency.description }}:
                    <span class="lighten">
                        <span v-html="currency.symbol"></span>{{ currency.rate_float | currencydecimal }}
                    </span>
                </div>

            </section>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Crypto',
    data() {
      return {
        info: null,
        loading: true,
        errored: false
      }
    },
    filters: {
        currencydecimal (value) {
            return value.toFixed(2)
        }
    },
    mounted () {
        axios.get(`${process.env.VUE_APP_CD_URL}bpi/currentprice.json`)
        .then(response => {
            this.info = response.data.bpi
        })
        .catch(error => {
            console.log(error)
            this.errored = true
        })
        .finally(() => this.loading = false)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .holder {
    background: #fff;
  }
</style>
