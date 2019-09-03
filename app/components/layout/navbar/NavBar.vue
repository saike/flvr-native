<template>
  <div class="nav-bar">

    <ul>
      <li>
        <a href="">
          S
        </a>
      </li>
      <li>
        <a href="">
          2
        </a>
      </li>
      <li>
        <a href="" class="create-post-btn">
          <!-- <img src="dist/footsteps_icon.png" alt=""> -->
        </a>
      </li>
      <li>
        <a href="">
          4
        </a>
      </li>
      <li>
        <a href="">
          5
        </a>
      </li>
    </ul>

  </div>
</template>

<script>

  export default {
    data(){

      return {
      };

    },
    methods:{

    },
    created() {

    },
    mounted(){

    }
  }
</script>

<style scoped lang="less">

  @import "../../../assets/css/theme";

  .nav-bar {

    background-color: @navbar_bg_color;
    height: 10vh;

    ul {
      list-style: none;
      margin: 0;
      text-align: center;
      padding: 0;
    }

    li {
      display: inline-block;
      padding: 2vh 2vw;
      width: 18vw;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      overflow: visible;
      /*background-color: #aca;*/
    }

    a {
      text-decoration: none;
      font-size: 4vh;
      line-height: 6vh;
    }

    .create-post-btn {

      display: inline-block;
      width: 8vh;
      height: 8vh;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      z-index: 1;
      top: 10%;
      left: 50%;
      background-image: url('./footsteps_icon.png');
      background-repeat: no-repeat;
      background-size: 80% 80%;
      background-position: center center;
      box-shadow: 0 1px 0 0 rgba(0,0,0,0.4);

      // img {

      //   width: 8vh;
      //   height: 8vh;
      //   display: block;
      //   vertical-align: top;  

      // }
    }

  }

</style>
