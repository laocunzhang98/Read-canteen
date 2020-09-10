<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
 
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
  #app{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #7d8188;
    overflow: hidden;
  }
</style>
