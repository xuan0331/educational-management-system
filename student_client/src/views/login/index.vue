<template>
  <section class="login-section">
    <div class="color color-1"></div>
    <div class="color color-2"></div>
    <div class="color color-3"></div>
    <div class="box">
      <div class="top-logo">
        <img src="@/assets/logo.jpg" alt="学校Logo">
      </div>
      <div class="square" style="--i:0;"></div>
      <div class="square" style="--i:1;"></div>
      <div class="square" style="--i:2;"></div>
      <div class="square" style="--i:3;"></div>
      <div class="square" style="--i:4;"></div>

      <div class="container">
        <div class="form">
          <h2>长沙理工大学统一身份认证</h2>

          <div class="login-method">
            <el-button
                :class="{ active: loginMethod === 'password' }"
                @click="loginMethod = 'password'"
                round
            >密码登录</el-button>
            <el-button
                :class="{ active: loginMethod === 'sms' }"
                @click="loginMethod = 'sms'"
                round
            >验证码登录</el-button>
          </div>

          <el-form
              v-if="loginMethod === 'password'"
              :model="ruleForm"
              :rules="rules"
              ref="passwordForm"
              class="login-form"
          >
            <div class="inputBox">
              <el-form-item prop="id">
                <el-input
                    v-model.number="ruleForm.id"
                    placeholder="用户ID"
                    prefix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
            </div>

            <div class="inputBox">
              <el-form-item prop="password">
                <el-input
                    v-model="ruleForm.password"
                    placeholder="密码"
                    show-password
                    prefix-icon="el-icon-lock"
                    @keyup.enter.native="submitForm('passwordForm')"
                ></el-input>
              </el-form-item>
            </div>

            <div class="inputBox">
              <el-form-item prop="type">
                <el-radio-group v-model="ruleForm.type">
                  <el-radio label="student">学生</el-radio>
                  <el-radio label="teacher">老师</el-radio>
                  <el-radio label="admin">管理员</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>

            <div class="inputBox">
              <el-form-item>
                <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
              </el-form-item>
            </div>

            <div class="inputBox">
              <el-form-item class="button-group">
                <el-button
                    type="primary"
                    @click="submitForm('passwordForm')"
                    class="login-btn"
                    :loading="loading"
                >登录</el-button>
                <el-button
                    @click="resetForm('passwordForm')"
                    class="reset-btn"
                >重置</el-button>
              </el-form-item>
            </div>
          </el-form>

          <el-form
              v-else
              :model="smsForm"
              :rules="smsRules"
              ref="smsForm"
              class="login-form"
              @submit.native.prevent="submitSmsForm('smsForm')"
          >
            <div class="inputBox">
              <el-form-item prop="phone">
                <el-input
                    v-model="smsForm.phone"
                    placeholder="手机号码"
                    prefix-icon="el-icon-mobile-phone"
                ></el-input>
              </el-form-item>
            </div>

            <div class="inputBox captcha-group">
              <el-form-item prop="code">
                <el-input
                    v-model="smsForm.code"
                    placeholder="验证码"
                    maxlength="4"
                    prefix-icon="el-icon-message"
                    @keyup.enter.native="submitSmsForm('smsForm')"
                ></el-input>
                <el-button
                    class="send-sms-btn"
                    @click="sendSmsCode"
                    :disabled="smsCountdown > 0"
                >
                  {{ smsCountdown > 0 ? `${smsCountdown}秒后重试` : '获取验证码' }}
                </el-button>
              </el-form-item>
            </div>

            <div class="inputBox">
              <el-form-item class="button-group">
                <el-button
                    type="primary"
                    @click="submitSmsForm('smsForm')"
                    class="login-btn"
                    :loading="loading"
                >登录</el-button>
                <el-button
                    @click="resetForm('smsForm')"
                    class="reset-btn"
                >重置</el-button>
              </el-form-item>
            </div>
          </el-form>

          <div class="datetime-display">
            {{ currentDateTime }}
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const API_CONFIG = {
  BASE_URL: 'http://localhost:10086',
  TEACHER_LOGIN: '/teacher/login',
  STUDENT_LOGIN: '/student/login',
  TEACHER_INFO: '/teacher/findById/',
  STUDENT_INFO: '/student/findById/',
  CURRENT_TERM: '/info/getCurrentTerm',
  FORBID_SELECTION: '/info/getForbidCourseSelection',
  SEND_SMS: '/sendCode',      // 新增短信接口
  VERIFY_CODE: '/verifyCode'  // 新增验证接口
};

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };

    const validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'));
      } else if (!/^\d{4}$/.test(value)) {
        callback(new Error('验证码为4位数字'));
      } else {
        callback();
      }
    };

    return {
      loginMethod: 'password',
      ruleForm: {
        id: null,
        password: null,
        type: null,
      },
      smsForm: {
        phone: '',
        code: ''
      },
      rules: {
        id: [
          {required: true, message: '请输入用户ID', trigger: 'blur'},
          {type: 'number', message: '请输入数字', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择用户类型', trigger: 'change'}
        ],
      },
      smsRules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        code: [
          {validator: validateCode, trigger: 'blur'}
        ]
      },
      rememberPassword: false,
      loading: false,
      errorCount: 0,
      smsCountdown: 0,
      smsTimer: null,
      currentDateTime: '',
      timeInterval: null
    };
  },
  created() {
    this.loadSavedCredentials();
    this.updateDateTime();
    this.timeInterval = setInterval(this.updateDateTime, 1000)
  },
  beforeDestroy() {
    if (this.smsTimer) {
      clearInterval(this.smsTimer);
    }
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  },
  methods: {


    updateDateTime() {
      this.currentDateTime = dayjs().format('YYYY年MM月DD日 HH:mm:ss dddd');
    },

    loadSavedCredentials() {
      const savedCredentials = localStorage.getItem('savedCredentials');
      if (savedCredentials) {
        try {
          const {id, password, type} = JSON.parse(savedCredentials);
          this.ruleForm = {id, password, type};
          this.rememberPassword = true;
        } catch (e) {
          console.error('加载保存的凭证失败:', e);
        }
      }
    },

    saveCredentials() {
      if (this.rememberPassword) {
        localStorage.setItem('savedCredentials', JSON.stringify({
          id: this.ruleForm.id,
          password: this.ruleForm.password,
          type: this.ruleForm.type
        }));
      } else {
        localStorage.removeItem('savedCredentials');
      }
    },

    async submitForm(formName) {
      if (this.loading) return;

      const valid = await this.$refs[formName].validate();
      if (!valid) return;

      this.loading = true;
      try {
        await this.fetchSystemInfo();

        if (this.ruleForm.type === 'admin' || this.ruleForm.type === 'teacher') {
          await this.handleTeacherLogin();
        } else if (this.ruleForm.type === 'student') {
          await this.handleStudentLogin();
        } else {
          this.showErrorMessage('错误的用户类型');
        }
        this.saveCredentials();
      } catch (error) {
        console.error('登录错误:', error);
        this.errorCount++;
        if (this.errorCount >= 3) {
          this.showErrorMessage('错误次数过多，请稍后再试');
        } else {
          this.showErrorMessage('登录失败，请检查账号密码');
        }
      } finally {
        this.loading = false;
      }
    },

    async sendSmsCode() {
      try {
        // 调试：打印即将发送的请求
        console.log('请求URL:', `${API_CONFIG.BASE_URL}/auth/sendCode`);

        const response = await this.$axios.post(
            `${API_CONFIG.BASE_URL}/auth/sendCode`,
            `phoneNumber=${this.smsForm.phone}`,  // 改为URL编码格式
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              timeout: 5000 // 添加超时
            }
        );

        console.log('完整响应:', response);

        if (response.data.success) {
          this.$message.success(response.data.message);
          this.startSmsCountdown();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('完整错误详情:', {
          message: error.message,
          request: error.config,
          response: error.response
        });

        let errorMsg = '网络错误';
        if (error.response) {
          errorMsg = error.response.data.message || `HTTP ${error.response.status}`;
        } else if (error.request) {
          errorMsg = '后端无响应';
        }
        this.$message.error(errorMsg);
      } finally {
        this.loading = false;
      }
    },

    // 2. 验证码登录提交（新增）
    async submitSmsForm(formName) {
      if (this.loading) return;

      try {
        // 1. 阻止表单默认提交行为
        const event = window.event || arguments.callee.caller.arguments[0];
        if (event) event.preventDefault();

        // 2. 表单验证
        await this.$refs[formName].validate();
        this.loading = true;

        // 3. 使用URLSearchParams（匹配后端@RequestParam）
        const params = new URLSearchParams();
        params.append('phoneNumber', this.smsForm.phone);
        params.append('code', this.smsForm.code);

        // 4. 发送POST请求（关键修改）
        const response = await this.$axios.post(
            `${API_CONFIG.BASE_URL}/auth/verifyCode`,
            params,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // 必须明确指定
              },
              timeout: 5000
            }
        );

        // 5. 处理响应（匹配后端返回的{success, message}结构）
        if (response.data.success) {
          this.$message.success(response.data.message);
          sessionStorage.setItem("token", "true");
          sessionStorage.setItem("type", "admin");
          sessionStorage.setItem("name", "管理员"); // 关键字段（与密码登录一致）
          sessionStorage.setItem("tid", "3");     // 假设管理员ID为1
          await this.$router.push('/admin');
        } else {
          throw new Error(response.data.message || "验证失败");
        }
      } catch (error) {
        // 错误处理保持不变
        console.error('验证失败:', error);
        this.$message.error(error.message || '验证失败');
      } finally {
        this.loading = false;
      }
    },

    // 3. 倒计时方法（新增）
    startSmsCountdown() {
      this.smsCountdown = 10;
      this.smsTimer = setInterval(() => {
        this.smsCountdown--;
        if (this.smsCountdown <= 0) {
          clearInterval(this.smsTimer);
        }
      }, 1000);
    },

    handleLoginSuccess(userInfo, loginType = null) {
      return new Promise((resolve) => {
        this.setSessionStorage(userInfo, loginType);

        let welcomeMessage = '';
        let redirectPath = '';

        if (loginType === 'admin' || this.ruleForm.type === 'admin') {
          welcomeMessage = `管理员登陆成功，欢迎 ${userInfo.tname}!`;
          redirectPath = '/admin';
        } else if (this.ruleForm.type === 'student') {
          welcomeMessage = `登陆成功，欢迎 ${userInfo.sname}!`;
          redirectPath = '/student';
        } else if (this.ruleForm.type === 'teacher') {
          welcomeMessage = `登陆成功，欢迎 ${userInfo.tname}!`;
          redirectPath = '/teacher';
        }

        this.showSuccessMessage(welcomeMessage);

        // 关键修改：确保DOM更新后跳转
        this.$nextTick(() => {
          this.$router.push(redirectPath)
              .then(resolve)
              .catch(err => {
                console.error('路由跳转失败:', err);
                resolve();
              });
        });
      });
    },

    async fetchSystemInfo() {
      try {
        const [termResp, forbidResp] = await Promise.all([
          this.$axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.CURRENT_TERM}`),
          this.$axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.FORBID_SELECTION}`)
        ]);
        sessionStorage.setItem("currentTerm", termResp.data);
        sessionStorage.setItem("ForbidCourseSelection", forbidResp.data);
      } catch (error) {
        console.error('获取系统信息失败:', error);
      }
    },

    async handleTeacherLogin() {
      const form = { tid: this.ruleForm.id, password: this.ruleForm.password };
      const loginResp = await this.$axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TEACHER_LOGIN}`,
          form
      );

      if (!loginResp.data) {
        throw new Error('教师登录验证失败');
      }

      const infoResp = await this.$axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.TEACHER_INFO}${this.ruleForm.id}`
      );

      const userInfo = infoResp.data;
      this.handleLoginSuccess(userInfo);
    },

    async handleStudentLogin() {
      const form = { sid: this.ruleForm.id, password: this.ruleForm.password };
      const loginResp = await this.$axios.post(
          `${API_CONFIG.BASE_URL}${API_CONFIG.STUDENT_LOGIN}`,
          form
      );

      if (!loginResp.data) {
        throw new Error('学生登录验证失败');
      }

      const infoResp = await this.$axios.get(
          `${API_CONFIG.BASE_URL}${API_CONFIG.STUDENT_INFO}${this.ruleForm.id}`
      );

      const userInfo = infoResp.data;
      this.handleLoginSuccess(userInfo);
    },

    setSessionStorage(userInfo, loginType = null) {
      sessionStorage.setItem("token", 'true');

      const type = loginType || this.ruleForm.type;
      sessionStorage.setItem("type", type);

      if (type === 'student') {
        sessionStorage.setItem("name", userInfo.sname);
        sessionStorage.setItem("sid", userInfo.sid);
      } else {
        sessionStorage.setItem("name", userInfo.tname);
        sessionStorage.setItem("tid", userInfo.tid);
      }
    },

    showSuccessMessage(message) {
      this.$message({
        showClose: true,
        message,
        type: 'success'
      });
    },

    showErrorMessage(message) {
      this.$message({
        showClose: true,
        message,
        type: 'error'
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.errorCount = 0;
    }
  }
};
</script>

<style scoped>

.datetime-display {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  animation: fadeIn 1s ease;
}

@media (max-width: 768px) {
  .datetime-display {
    font-size: 13px;
    bottom: 15px;
  }
}

.top-logo {
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 100;
  transform:translateY(100%);
}

.top-logo img {
  height: auto;
  max-width: 70px;
  max-height: 70px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
  border-radius: 50%;
}

.login-method {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.login-method .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  font-size: 16px;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.login-method .el-button.active {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-color: transparent;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.login-method .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.captcha-group >>> .el-form-item__content {
  display: flex;
}

.captcha-group >>> .el-input {
  flex: 1;
  margin-right: 10px;
}

.send-sms-btn {
  width: 120px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  transition: all 0.3s ease;
}

.send-sms-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.send-sms-btn:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.admin-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffcc00;
  font-size: 14px;
  padding: 8px 0;
}

.admin-notice i {
  margin-right: 5px;
  font-size: 16px;
}

* {
  font-family: 'AlimamaDongFangDaKai', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

h2, p, a, .el-radio__label, .el-button, .forget,
.el-form-item__label, .el-message, .el-message-box,
.el-checkbox__label {
  font-weight: bold !important;
}

.el-input__inner, .el-input__inner::placeholder {
  font-weight: normal !important;
}

.login-section {
  will-change: background-position;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #4facfe, #00f2fe, #23a6d5, #23d5ab, #ff6b6b, #feca57);
  background-size: 400% 400%;
  position: relative;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.color {
  position: absolute;
  filter: blur(150px);
  opacity: 0.7;
  z-index: 1;
}

.color-1 {
  top: -350px;
  width: 600px;
  height: 600px;
  background: #4facfe;
}

.color-2 {
  bottom: -150px;
  left: 100px;
  width: 500px;
  height: 500px;
  background: #00f2fe;
}

.color-3 {
  bottom: 50px;
  right: 100px;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.8);
}

.box {
  position: relative;
  z-index: 10;
}

.square {
  position: absolute;
  backdrop-filter: blur(5px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  animation: animate 10s linear infinite;
  animation-delay: calc(-1s * var(--i));
  z-index: 2;
}

@keyframes animate {
  0%, 100% {
    transform: translateY(-40px);
  }
  50% {
    transform: translateY(40px);
  }
}

.square:nth-child(1) {
  top: -50px;
  right: -60px;
  width: 100px;
  height: 100px;
}

.square:nth-child(2) {
  top: 150px;
  left: -100px;
  width: 120px;
  height: 120px;
  z-index: 3;
}

.square:nth-child(3) {
  bottom: 50px;
  right: -60px;
  width: 80px;
  height: 80px;
  z-index: 3;
}

.square:nth-child(4) {
  bottom: -80px;
  left: 100px;
  width: 50px;
  height: 50px;
}

.square:nth-child(5) {
  top: -90px;
  left: 140px;
  width: 60px;
  height: 60px;
}

.container {
  position: relative;
  width: 450px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.form {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
}


.form h2 {
  position: relative;
  font-size: 50px;
  letter-spacing: 4px;
  text-align: center;
  color: #fff;
  text-shadow:
      0 0 10px #00f2fe,
      0 0 20px #4facfe,
      0 0 30px rgba(79, 172, 254, 0.5);
  animation: neonGlow 2s ease-in-out infinite alternate;
}

@keyframes neonGlow {
  from {
    text-shadow:
        0 0 5px #00f2fe,
        0 0 10px #4facfe;
  }
  to {
    text-shadow:
        0 0 15px #00f2fe,
        0 0 25px #4facfe,
        0 0 35px rgba(79, 172, 254, 0.8);
  }
}

.form h2::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12px;
  width: 120px;
  height: 4px;
  background: linear-gradient(45deg, #00bcd4, #9c27b0);
  border-radius: 2px;
  filter: blur(2px);
}

.inputBox {
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px ;
}

.inputBox >>> .el-form-item {
  margin-bottom: 0;
}

.inputBox >>> .el-input__inner {
  width: 100%;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  padding: 10px 20px 10px 50px;
  border-radius: 35px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 18px;
  letter-spacing: 1px;
  color: #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.inputBox >>> .el-input__inner:hover {
  background: rgba(255, 255, 255, 0.25);
}

.inputBox >>> .el-input__inner:focus {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.inputBox >>> .el-input__inner::placeholder {
  color: rgba(255, 255, 255, 0.8);
}

.inputBox >>> .el-input__prefix {
  left: 15px;
  color: #fff;
  font-size: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.login-btn, .reset-btn {
  height: 50px;
  width: 120px;
  cursor: pointer;
  margin-bottom: 20px;
  border-radius: 35px;
  font-size: 18px;
  transition: all 0.3s ease;
  border: none;
}

.login-btn {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.login-btn:hover {
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.reset-btn {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(45deg, #00f2fe, #4facfe);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.forget {
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 16px;
}

.forget a {
  color: #fff;
  margin-left: 5px;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.forget a:hover {
  color: #00f2fe;
}

.el-radio-group {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.el-radio >>> .el-radio__label {
  color: #fff;
  font-size: 18px;
}

.el-radio >>> .el-radio__inner {
  width: 18px;
  height: 18px;
}

.el-checkbox >>> .el-checkbox__label {
  color: #fff;
  font-size: 18px;
}

.el-checkbox >>> .el-checkbox__inner {
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-left: 14px;
}

.el-input__inner, .el-radio__label, .el-button, .el-checkbox__label {
  font-family: 'AlimamaDongFangDaKai', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

[class^="el-icon-"],
[class*=" el-icon-"],
.el-icon {
  font-family: element-icons !important;
}

@media (max-width: 768px) {
  .container {
    width: 90%;
    padding: 30px;
  }

  .form {
    padding: 30px;
  }

  .form h2 {
    font-size: 36px;
    margin-bottom: 30px;
  }

  .square:nth-child(1),
  .square:nth-child(2),
  .square:nth-child(3),
  .square:nth-child(4),
  .square:nth-child(5) {
    display: none;
  }
}
</style>