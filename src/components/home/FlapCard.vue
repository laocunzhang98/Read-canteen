<template>
  <div class="flap-card-wrapper">
    <div class="close-btn-wrapper" @click="close"></div>
  </div>
</template>
<script>
import {storeHomeMixin} from '../../utils/mixin'
export default {
  mixins:[storeHomeMixin],
  methods:{
    close(){
      this.setFlapCardVisible(false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .flap-card-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: red;
  }
</style>