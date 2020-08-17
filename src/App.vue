<template>
  <div id="app">
      <div class="icon-book"></div>
      <span class="text">ABCDEFG</span>
    <router-view/>
  </div>
</template>

<script>
import{mapGetters} from 'vuex'
const getters = {
  a:()=>11,
  b:()=>2,
  c:()=>3
}
function foo(keys){
  const data={}
  keys.forEach(key=>{
    if(getters.hasOwnProperty(key)){
      data[key] = getters[key]
    }
  })
  return data
}
export default {
  computed: {
    ...mapGetters(['test']),
    ...foo(['a','b'])
  },
  mounted() {
    this.$store.dispatch('setTest', 10).then(()=>{
      console.log(this.test);
    })
    console.log(this.a);
  },
}
</script>
<style scoped>
  .text{
    font-family: 'Days One';
    size: 20px;
    color: pink;
  }
  .icon-book{
    font-size: 20px;
    color: red;
  }
</style>
