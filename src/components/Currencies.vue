<template>
    <div class="holder">
        <form @submit.prevent="addSkill">
            <div class="autocomplete">
                <input
                    type="text"
                    placeholder="Enter a currency here"
                    v-model="baseCuerrency"
                    name="baseCurrency"
                    @input="onChange"
                />
                <ul v-show="isOpen" class="autocomplete-results">
                    <li class="loading" v-if="isLoading" :key="isLoading">
                        Loading results...
                    </li>
                    <li
                        v-for="(result, i) in filteredCurrencies"
                        class="autocomplete-result"
                        @click="setResult(result.code)"
                        :key="i + result.code">
                        {{ result.name }} ({{ result.code }})
                    </li>
                </ul>
            </div>
        </form>
        <ul>
            <transition-group name="list" enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
                <li class="loading" v-if="isLoading" :key="isLoading">
                    Loading results...
                </li>
                <li v-for="(data, index) in rates" :key="index + data.code">
                    {{ data.name }} ({{ data.code }}) - {{ data.rate }}
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Currencies',
        data() {
            return {
                baseCuerrency: '',
                currencies: [],
                errored: false,
                filteredCurrencies: [],
                isLoading: true,
                isOpen: false,
                rates: []
            }
        },
        mounted () {
            axios.get(`${process.env.VUE_APP_OE_BASE_URL}currencies.json`)
                .then(response => {
                    for (var k in response.data) {
                        const currency = {
                            'code': k,
                            'name': response.data[k]
                        }
                        this.currencies.push(currency)
                    }
                })
                .catch(error => {
                    this.errored = true
                })
                .finally(() => this.isLoading = false)
        },
        methods: {
            onChange() {
                this.isOpen = true;
                this.filterResults();
            },
            filterResults() {
                this.filteredCurrencies = this.currencies.filter(item => item['code'].toLowerCase().indexOf(this.baseCuerrency.toLowerCase()) > -1);
            },
            setResult(result) {
                this.baseCuerrency = result;
                this.rates = [];
                this.isOpen = false;
                this.isLoading = true;
                setTimeout(() => {
                    axios.get(`${process.env.VUE_APP_WTD_BASE_URL}forex?base=${result}&sort=newest&&api_token=${process.env.VUE_APP_WTD_APP_ID}`)
                        .then(response => {
                            for (var k in response.data.data) {
                                const curr = this.currencies.filter(item => item['code'].indexOf(k) > -1)[0]
                                if (curr) {
                                    const currency = {
                                        'code': k,
                                        'rate': response.data.data[k],
                                        'name': curr.name
                                    }
                                    this.rates.push(currency)
                                }
                            }
                        })
                        .catch(error => {
                            this.errored = true
                        })
                        .finally(() => this.isLoading = false)    
                }, 3000);
            },
        }
    }
</script>

<style scoped>
  .holder {
    background: #fff;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

   ul li {
    padding: 20px;
    font-size: 1.3em;
    background-color: #E0EDF4;
    border-left: 5px solid #3EB3F6;
    margin-bottom: 2px;
    color: #3E5252;
  }

  input {
    width: calc(100% - 40px);
    border: 0;
    padding: 20px;
    font-size: 1.3em;
    background-color: #323333;
    color: #687F7F;
  }

  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    border: 1px solid #eeeeee;
    height: 120px;
    overflow: auto;
  }

  .autocomplete-result {
    list-style: none;
    text-align: left;
    padding: 4px 2px;
    cursor: pointer;
  }

  .autocomplete-result:hover {
    background-color: #4AAE9B;
    color: white;
  }
</style>
