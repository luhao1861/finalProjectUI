<template>
  <div style="text-align: center;">
    <h2>Hello,{{ user.username }}</h2>

    <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="180px">
      <el-form-item label="Old password" prop="currentPass">
        <el-input type="password" v-model="passForm.currentPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="New password" prop="password">
        <el-input type="password" v-model="passForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password confirmation" prop="checkPass">
        <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">confirm</el-button>
        <el-button @click="resetForm('passForm')">reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Pleas type in your password again'))
      } else if (value !== this.passForm.password) {
        callback(new Error('The two passwords are inconsistent!'))
      } else {
        callback()
      }
    }
    return {
      user: {},
      passForm: {
        password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        password: [
          {
            required: true,
            message: 'Please type in your password',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: 'Length of chars should be more than 6 and less than 12',
            trigger: 'blur'
          }
        ],
        checkPass: [
          {
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        currentPass: [
          {
            required: true,
            message: 'please type in your current password',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      this.$axios.get('/sys/user').then(res => {
        this.user = res.data.data
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios.post('/sys/user/updatePass', this.passForm).then(res => {
            _this.$alert(res.data.msg, 'notification', {
              confirmButtonText: 'confirm',
              callback: action => {
                this.$refs[formName].resetFields()
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>
