<template>
<div class="mx-10 flex flex-col h-screen">
<div class="text-left mt-10 text-2xl font-bold mb-4 bg-gray-500 w-fit text-white">
COUNTRYS
</div>
<div class="flex justify-between">
<div class="buttons flex-row">
<button :disabled="disableButtons"  @click="filterSmallerCountrys()" class="button is-rounded mr-3 ml-0" :class="filterByArea ? 'is-primary' : 'is-success'">Smaller then Lithuania</button>
<button :disabled="disableButtons" @click="filterOceaniaReagion()" class="button is-rounded" :class="filterOceania ? 'is-primary' : 'is-success'">“Oceania” reagion</button>
</div>
<div>
<button @click="sortByName()" :disabled="disableButtons" v-if="!sortedByName" class="button is-rounded is-success">Sort by name descending</button>
<button @click="sortByName()" :disabled="disableButtons" v-else class="button is-rounded is-primary">Sort by name ascending</button>
</div>
</div>
<div v-if="countrys.length > 0 && filteredPaginatedCountrys.length == 0" v-for="(country,id) in paginatedCountrys" :key="id" class="box !bg-lime-300 h-[120px]">
    <div class="flex flex-col text-left">
<div class="font-semibold bg-gray-500 w-fit text-white mb-1">
    {{ country.name }}
</div>
<div class="bg-gray-500 w-fit text-white mb-1">
    {{ country.region }}
</div>
<div class="bg-gray-500 w-fit text-white">
    {{ country.area }}
</div>
</div>
</div>
<div v-if="filteredPaginatedCountrys.length > 0 && countrys.length > 0 && (filterByArea || filterOceania)" v-for="(filteredCountry,id) in filteredPaginatedCountrys" :key="id" class="box !bg-lime-300 h-[120px]">
    <div class="flex flex-col text-left">
<div class="font-semibold bg-gray-500 w-fit text-white mb-1">
    {{ filteredCountry.name }}
</div>
<div class="bg-gray-500 w-fit text-white mb-1">
    {{ filteredCountry.region }}
</div>
<div class="bg-gray-500 w-fit text-white">
    {{ filteredCountry.area }}
</div>
</div>
</div>

<div v-else-if="countrys.length == 0" class=" text-xl font-bold">
Could not load countrys
</div>
<pagination @onPageChange="handlePageChange" :currentPage="currentPage" :pages="pagesCount"></pagination>

</div>
</template>
<script>
import Pagination from '@/components/Pagination.vue'
export default {
    name: 'Index',
    data() {
        return {
            countrys: [],
            filteredPaginatedCountrys: [],
            lithuaniaArea: 0,
            filterByArea: false,
            filterOceania: false,
            sortedByName: false,
            disableButtons: false,
            pagesCount: 0,
            limit: 5,
            currentPage: 1,
            paginatedCountrys: [],
            filteredCountrys: [],
            start: 0,
            end: 0,
        }
    },
    components:{
        Pagination,
    },
    methods: {
       async getCountryData() {
        try{
          this.countrys =  await this.$api.getCountryData()
          let lithuania = this.countrys.filter(country => country.name === 'Lithuania')
          this.lithuaniaArea = lithuania[0].area
          this.setPageCountUsingCountrysArray()
          this.setCountrySliceRange()
        }
        catch(error){
            this.countrys = []
            this.disableButtons = true

        }
        },
        filterSmallerCountrys(){
             if(this.sortedByName === true && ( this.filteredPaginatedCountrys.length > 0 && this.filterByArea === true && this.filterOceania === true)){
                this.filterCountrysByOceaniaRegion()
                this.sortFilteredCountrysByNameDescending()
                this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterByArea(false)
            }
            else if(this.filterByArea === false && ( this.filteredPaginatedCountrys.length > 0 && this.filterOceania === true)){
                this.filteredCountrys = this.filteredCountrys.filter(country => country.area < this.lithuaniaArea)
                this.setFilteredCountrySliceRange()
                this.setPageCountUsingFilteredCountryssArray()
                this.setFilterByArea(true)
                this.checkIfForcePageChange()
            }
            else if( this.filterByArea === false){
                this.filterCountrysByArea()
            this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterByArea(true)
            this.checkIfForcePageChange()
            }
            else if(this.filterByArea === true && this.filterOceania === true){
                this.filterCountrysByOceaniaRegion()
                this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterByArea(false)
            }
            else if(this.filterByArea === true && this.sortedByName === true){
                this.filteredPaginatedCountrys = []
                this.sortCountrysByNameDescending()
                this.setCountrySliceRange()
                this.setPageCountUsingCountrysArray()
                this.setFilterByArea(false)
            }
            else{
                this.setFilterByArea(false)
                this.filteredPaginatedCountrys = []
                this.setPageCountUsingCountrysArray()
                this.setCountrySliceRange()
            this.checkIfForcePageChange()
            }
        },
        filterOceaniaReagion(){
            if(this.sortedByName === true && (this.filteredPaginatedCountrys.length > 0 && this.filterOceania === true && this.filterByArea === true)){
                this.filterCountrysByArea()
                this.sortFilteredCountrysByNameDescending()
                this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterOceania(false)
            }
           else if(this.filterOceania === false && (this.filteredPaginatedCountrys.length > 0 && this.filterByArea === true)){
            this.filteredCountrys = this.filteredCountrys.filter(country => country.region === 'Oceania')
            this.setFilteredCountrySliceRange()
                this.setPageCountUsingFilteredCountryssArray()
                this.setFilterOceania(true)
                this.checkIfForcePageChange()
            }
            else if( this.filterOceania === false){
                this.filterCountrysByOceaniaRegion()
                this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterOceania(true)
            this.checkIfForcePageChange()
            }
            else if(this.filterOceania === true && this.filterByArea === true){
                this.filterCountrysByArea()
                this.setFilteredCountrySliceRange()
            this.setPageCountUsingFilteredCountryssArray()
            this.setFilterOceania(false)
            }
            else if(this.filterOceania === true && this.sortedByName === true){
                this.filteredPaginatedCountrys = []
                this.sortCountrysByNameDescending()
                this.setCountrySliceRange()
            this.setPageCountUsingCountrysArray()
            this.setFilterOceania(false)
            }

            else{
                this.setFilterOceania(false)
                this.filteredPaginatedCountrys = []
                this.setPageCountUsingCountrysArray()
                this.setCountrySliceRange()
            this.checkIfForcePageChange()
            
            }
        },
        sortByName(){
          if(this.filterByArea === false && this.filterOceania === false &&  this.sortedByName === false){
           this.sortCountrysByNameDescending()
           this.setSortedByName(true)
           this.setCountrySliceRange()

          }
          else if(this.filterByArea === false && this.filterOceania === false &&  this.sortedByName === true){
           this.countrys.sort((firstCountry,secondCountry) => firstCountry.name.toLowerCase() > secondCountry.name.toLowerCase() ? 1 : -1)
           this.setSortedByName(false)
           this.setCountrySliceRange()

          }
          else if(this.filterByArea === true && this.filterOceania === false &&  this.sortedByName === false){
            this.sortFilteredCountrysByNameDescending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(true)

          }
          else if(this.filterByArea === true && this.filterOceania === false &&  this.sortedByName === true){
           this.sortFilteredCountrysByNameAscending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(false)

          }
          else if(this.filterByArea === false && this.filterOceania === true &&  this.sortedByName === false){
           this.sortFilteredCountrysByNameDescending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(true)

          }
          else if(this.filterByArea === false && this.filterOceania === true &&  this.sortedByName === true){
            this.sortFilteredCountrysByNameAscending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(false)

          }
          else if(this.filterByArea === true && this.filterOceania === true &&  this.sortedByName === false){
            this.sortFilteredCountrysByNameDescending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(true)

          }
          else if(this.filterByArea === true && this.filterOceania === true &&  this.sortedByName === true){
           this.sortFilteredCountrysByNameAscending()
            this.setFilteredCountrySliceRange()
            this.setSortedByName(false)

          }
        },
        handlePageChange(data){
            this.currentPage = data.page
            if(this.filterByArea === true || this.filterOceania === true){
                this.setFilteredCountrySliceRange()
            }
            else{
                this.setCountrySliceRange()
            }
        },
        setCountrySliceRange(){
            if(this.currentPage != 1){
            this.end = this.currentPage * this.limit
            this.start = this.end - this.limit
            }
            else{
            this.start = 0
            this.end = this.start + this.limit
            }
            this.paginatedCountrys = this.countrys.slice(this.start,this.end)
            this.start = 0
            this.end = 0
        },
        setFilteredCountrySliceRange(){
            if(this.currentPage != 1){
            this.end = this.currentPage * this.limit
            this.start = this.end - this.limit
            }
            else{
            this.start = 0
            this.end = this.start + this.limit
            }
            this.filteredPaginatedCountrys = this.filteredCountrys.slice(this.start,this.end)
            this.start = 0
            this.end = 0
        },
        checkIfForcePageChange(){
            if(this.currentPage > this.pagesCount){
                    this.currentPage = 1
                    this.handlePageChange({page: this.currentPage})
                }
        },
        setPageCountUsingCountrysArray(){
            this.pagesCount = Math.ceil(this.countrys.length / this.limit)
        },
        setPageCountUsingFilteredCountryssArray(){
            this.pagesCount = Math.ceil(this.filteredCountrys.length / this.limit)
        },
        filterCountrysByOceaniaRegion(){
            this.filteredCountrys = this.countrys.filter(country => country.region === 'Oceania')
        },
        filterCountrysByArea(){
        this.filteredCountrys = this.countrys.filter(country => country.area < this.lithuaniaArea)
        },
        sortCountrysByNameDescending(){
            this.countrys.sort((firstCountry,secondCountry) => secondCountry.name.toLowerCase() > firstCountry.name.toLowerCase() ? 1 : -1)
        },
        sortFilteredCountrysByNameDescending(){
        this.filteredCountrys.sort((firstCountry,secondCountry) => secondCountry.name.toLowerCase() > firstCountry.name.toLowerCase() ? 1 : -1)
        },
        sortFilteredCountrysByNameAscending(){
        this.filteredCountrys.sort((firstCountry,secondCountry) => firstCountry.name.toLowerCase() > secondCountry.name.toLowerCase() ? 1 : -1)
        },
        setFilterByArea(boolean){
            this.filterByArea = boolean
        },
        setFilterOceania(boolean){
            this.filterOceania = boolean
        },
        setSortedByName(boolean){
            this.sortedByName = boolean
        },

    },
    created() {
     this.getCountryData()
    }
}
</script>