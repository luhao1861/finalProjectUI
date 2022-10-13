<template>
  <div>
    <el-button @click="show3 = !show3" style="width: 800px;height: 80px"><span style="font-size:20px">Click Me,I want to introduce this project for you</span></el-button>
    <div style="margin-top: 20px; height: 200px;">
      <el-collapse-transition>
        <div v-show="show3">
          <div class="transition-box">The project consists of two subsystems, front-end is based on VUE.js , back-end is based on SpringBoot</div>
          <div class="transition-box">Authorization and Authentication Framework by Spring-security with JWT</div>
          <div class="transition-box">ORM Framework is JPA, AKA Hibernate</div>
          <div class="transition-box">The system has a complete set of user management, role management, menu management</div>
          <div class="transition-box">The core business logic about the system is in Library</div>
          <div class="transition-box">One Library has rooms. Rooms have their own bookshelfs. And bookshelfs have their own books</div>
          <div class="transition-box">Finally, Thank you for your teaching during this semester, you are very nice! </div>
          <div class="transition-box">I hope your company will grow better and better!</div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data: () => ({
    show3: false
  })
}
</script>

<style scoped>
.transition-box {
  margin-bottom: 10px;
  width: 800px;
  height: 70px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
