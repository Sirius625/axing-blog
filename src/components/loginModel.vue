<template>
    <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="modal-container">
            <!-- 头部 -->
            <div class="modal-header">
                <h2>{{ isRegisterMode ? '用户注册' : '用户登录' }}</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>

            <!-- 登录表单 -->
            <form v-if="!isRegisterMode" @submit.prevent="handleLogin" class="modal-body">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" id="username" v-model="form.username" placeholder="请输入用户名"
                        :class="{ 'error-border': errors.username }" />
                    <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
                </div>

                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" id="password" v-model="form.password" placeholder="请输入密码"
                        :class="{ 'error-border': errors.password }" />
                    <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
                </div>

                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="form.rememberMe" />
                        <span class="checkmark"></span>
                        记住我
                    </label>
                    <a href="#" class="forgot-link">忘记密码?</a>
                </div>

                <button type="submit" class="login-btn" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner"></span>
                    <span v-else>立即登录</span>
                </button>
            </form>

            <!-- 注册表单 -->
            <form v-else @submit.prevent="handleRegister" class="modal-body">
                <div class="form-group">
                    <label for="reg-username">用户名</label>
                    <input type="text" id="reg-username" v-model="registerForm.name" placeholder="请输入用户名"
                        :class="{ 'error-border': regErrors.name }" />
                    <span v-if="regErrors.name" class="error-msg">{{ regErrors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="reg-password">密码</label>
                    <input type="password" id="reg-password" v-model="registerForm.password" placeholder="请输入密码"
                        :class="{ 'error-border': regErrors.password }" />
                    <span v-if="regErrors.password" class="error-msg">{{ regErrors.password }}</span>
                </div>

                <div class="form-group">
                    <label for="reg-confirm">确认密码</label>
                    <input type="password" id="reg-confirm" v-model="registerForm.confirmPassword" placeholder="请再次输入密码"
                        :class="{ 'error-border': regErrors.confirmPassword }" />
                    <span v-if="regErrors.confirmPassword" class="error-msg">{{ regErrors.confirmPassword }}</span>
                </div>

                <button type="submit" class="login-btn" :disabled="isLoading">
                    <span v-if="isLoading" class="spinner"></span>
                    <span v-else>立即注册</span>
                </button>
            </form>

            <!-- 底部 -->
            <div class="modal-footer">
                <p v-if="!isRegisterMode">
                    还没有账号? <a href="#" @click.prevent="switchToRegister">立即注册</a>
                </p>
                <p v-else>
                    已有账号? <a href="#" @click.prevent="switchToLogin">返回登录</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { registerUser, loginUser } from '@/api/http1'
import { useAuthStore } from '@/store'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
const authStore = useAuthStore()
// 定义Props
interface Props {
    modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'login-success']);

// 状态管理
const visible = ref(props.modelValue);
const isLoading = ref(false);
const isRegisterMode = ref(false);

// 登录表单
const errors = reactive({
    username: '',
    password: ''
});

const form = reactive({
    username: '',
    password: '',
    rememberMe: false
});

// 注册表单
const registerForm = reactive({
    name: '',
    password: '',
    confirmPassword: ''
});

const regErrors = reactive({
    name: '',
    password: '',
    confirmPassword: ''
});

// 监听外部visible变化
watch(() => props.modelValue, (newVal) => {
    visible.value = newVal;
    if (newVal) resetForm();
});

// 监听内部visible变化同步给父组件
watch(visible, (newVal) => {
    emit('update:modelValue', newVal);
});

// 重置表单
const resetForm = () => {
    form.username = '';
    form.password = '';
    form.rememberMe = false;
    errors.username = '';
    errors.password = '';
};

// 关闭弹窗
const close = () => {
    visible.value = false;
};

const switchToRegister = () => {
    isRegisterMode.value = true;
    // 重置注册表单
    registerForm.name = '';
    registerForm.password = '';
    registerForm.confirmPassword = '';
    regErrors.name = '';
    regErrors.password = '';
    regErrors.confirmPassword = '';
};

const switchToLogin = () => {
    isRegisterMode.value = false;
};

// 注册验证
const validateRegister = (): boolean => {
    let isValid = true;
    regErrors.name = '';
    regErrors.password = '';
    regErrors.confirmPassword = '';

    if (!registerForm.name.trim()) {
        regErrors.name = '用户名不能为空';
        isValid = false;
    } else if (registerForm.name.length < 2) {
        regErrors.name = '用户名至少2个字符';
        isValid = false;
    }

    if (!registerForm.password) {
        regErrors.password = '密码不能为空';
        isValid = false;
    } else if (registerForm.password.length < 6) {
        regErrors.password = '密码至少6个字符';
        isValid = false;
    }

    if (!registerForm.confirmPassword) {
        regErrors.confirmPassword = '请再次输入密码';
        isValid = false;
    } else if (registerForm.confirmPassword !== registerForm.password) {
        regErrors.confirmPassword = '两次输入密码不一致';
        isValid = false;
    }

    return isValid;
};

// 处理注册
const handleRegister = async () => {
    if (!validateRegister()) return;
    isLoading.value = true;
    try {
        const result = await registerUser({
            name: registerForm.name,
            password: registerForm.password,
            email: registerForm.name + '@temp.com',
            role: '普通用户'
        })
        if (result && result.id) {
            ElMessage({
                message: '注册成功，正在自动登录...',
                type: 'success',
                duration: 1500,
                offset: window.innerHeight / 3
            })
            // 注册成功后自动登录
            const user = await loginUser(registerForm.name, registerForm.password)
            if (user) {
                authStore.login(user)
                localStorage.setItem('username', registerForm.name)
                emit('login-success')
            }
        } else {
            ElMessage({
                message: result?.message || '注册失败',
                type: 'error',
                duration: 2000,
                offset: window.innerHeight / 3
            })
        }
    } catch (error: any) {
        const errMsg = error?.response?.data?.message || error?.message || '注册失败，请检查网络连接'
        ElMessage({
            message: errMsg,
            type: 'error',
            duration: 2000,
            offset: window.innerHeight / 3
        })
        console.error('注册失败:', error)
    } finally {
        isLoading.value = false;
    }
};

// 验证逻辑
const validate = (): boolean => {
    let isValid = true;
    errors.username = '';
    errors.password = '';

    if (!form.username.trim()) {
        errors.username = '用户名不能为空';
        isValid = false;
    } else if (form.username.length < 3) {
        errors.username = '用户名至少3个字符';
        isValid = false;
    }

    if (!form.password) {
        errors.password = '密码不能为空';
        isValid = false;
    } else if (form.password.length < 6) {
        errors.password = '密码至少6个字符';
        isValid = false;
    }

    return isValid;
};

// 处理登录
const handleLogin = async () => {
    if (!validate()) return;
    isLoading.value = true;
    try {
        const user = await loginUser(form.username, form.password)
        if (user) {
            authStore.login(user)
            ElMessage({
                message: '登录成功',
                type: 'success',
                duration: 1500,
                offset: window.innerHeight / 3
            })
            localStorage.setItem('username', form.username)
            emit('login-success')
        } else {
            ElMessage({
                message: '用户名或密码错误',
                type: 'error',
                duration: 2000,
                offset: window.innerHeight / 3
            })
        }
    } catch (error: any) {
        const errMsg = error?.response?.data?.message || error?.message || '登录失败，请检查网络连接'
        ElMessage({
            message: errMsg,
            type: 'error',
            duration: 2000,
            offset: window.innerHeight / 3
        })
        console.error('登录失败:', error)
    } finally {
        isLoading.value = false;
    }
};

</script>

<style scoped>
/* 遮罩层 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease;
}

/* 弹窗容器 */
.modal-container {
    background: white;
    width: 90%;
    max-width: 400px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: slideUp 0.3s ease;
}

/* 头部 */
.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

/* 表单主体 */
.modal-body {
    padding: 24px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.9rem;
    color: #555;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
}

.form-group input:focus {
    border-color: #409eff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.error-border {
    border-color: #f56c6c !important;
}

.error-msg {
    color: #f56c6c;
    font-size: 0.8rem;
    margin-top: 4px;
    display: block;
}

/* 选项区域 */
.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.checkbox-container {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    color: #666;
}

.checkbox-container input {
    margin-right: 8px;
}

.forgot-link {
    color: #409eff;
    text-decoration: none;
}

.forgot-link:hover {
    text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
    width: 100%;
    padding: 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-btn:hover:not(:disabled) {
    background-color: #66b1ff;
}

.login-btn:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
}

/* 加载动画 */
.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

/* 底部 */
.modal-footer {
    padding: 16px 24px;
    background-color: #f9f9f9;
    text-align: center;
    font-size: 0.9rem;
    color: #666;
}

.modal-footer a {
    color: #409eff;
    text-decoration: none;
    font-weight: 500;
}

/* 动画定义 */
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
