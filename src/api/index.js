import axios from 'axios';
import { ElMessage } from 'element-plus';
// 创建两个 axios 实例，分别对应不同后端服务
const services = {
    // 网易云音乐 API 代理 (端口 3000)
    music: axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    }),
    // 本地管理后台 (端口 3030)
    manage: axios.create({
        baseURL: import.meta.env.VITE_MANAGE_API_BASE_URL || 'http://localhost:3030',
        timeout: 15000,
        headers: { 'Content-Type': 'application/json' }
    })
};
// 为 manage 服务添加 token 请求拦截器
services.manage.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, error => Promise.reject(error));
// 标记是否已经处理过 token 过期，避免重复提示
let tokenExpiredHandled = false;
// 为 manage 服务添加响应拦截器 - 自动处理 token 过期
services.manage.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && !tokenExpiredHandled) {
        tokenExpiredHandled = true;
        // token 过期，清除本地存储，转为游客模式
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        localStorage.removeItem('user_id');
        ElMessage.warning('登录已过期，部分功能可能受限');
        // 触发自定义事件，让 App.vue 中的 loginModel 弹窗打开
        window.dispatchEvent(new CustomEvent('token-expired'));
        // 3秒后重置标记，允许下次再提示
        setTimeout(() => { tokenExpiredHandled = false; }, 3000);
    }
    return Promise.reject(error);
});
// 监听 token-expired 事件，同步更新 authStore 状态
window.addEventListener('token-expired', () => {
    // 动态导入 store 并重置登录状态
    import('@/store').then(({ useAuthStore }) => {
        const authStore = useAuthStore();
        authStore.isLoggedIn = false;
        authStore.user = null;
        authStore.token = '';
    });
});
// 通用请求函数
const request = async (service, config) => {
    const { showSuccess = false, showError = true, successMessage, ...axiosConfig } = config;
    try {
        const response = await services[service].request(axiosConfig);
        const message = successMessage || '请求成功';
        if (showSuccess) {
            ElMessage.success(message);
        }
        return {
            success: true,
            code: response.status,
            message,
            data: response.data
        };
    }
    catch (error) {
        const message = error?.response?.data?.message ||
            error?.message ||
            '请求失败，请稍后重试';
        if (showError) {
            ElMessage.error(message);
        }
        return {
            success: false,
            code: error?.response?.status || 500,
            message,
            data: null,
            error
        };
    }
};
// ===== 音乐服务 (端口 3000) =====
export const get = async (url, config = {}) => request('music', { url, method: 'GET', ...config });
export const post = async (url, data, config = {}) => request('music', { url, method: 'POST', data, ...config });
export const put = async (url, data, config = {}) => request('music', { url, method: 'PUT', data, ...config });
export const del = async (url, config = {}) => request('music', { url, method: 'DELETE', ...config });
// ===== 管理后台服务 (端口 3030) =====
export const get1 = async (url, config = {}) => request('manage', { url, method: 'GET', ...config });
export const post1 = async (url, data, config = {}) => request('manage', { url, method: 'POST', data, ...config });
export const put1 = async (url, data, config = {}) => request('manage', { url, method: 'PUT', data, ...config });
export const del1 = async (url, config = {}) => request('manage', { url, method: 'DELETE', ...config });
//# sourceMappingURL=index.js.map