import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
export const useSettingsStore = defineStore('settings', () => {
    const authStore = useAuthStore();
    const username = computed(() => authStore.user?.name || '未登录');
    const theme = ref('dark');
    const setTheme = (value) => {
        theme.value = value;
        document.documentElement.dataset.theme = value;
    };
    return {
        username,
        theme,
        setTheme
    };
});
export const useAuthStore = defineStore('auth', {
    state: () => {
        // 尝试从 localStorage 恢复用户信息
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token') || '';
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        return {
            isLoggedIn: !!savedToken && !!parsedUser,
            user: parsedUser,
            token: savedToken
        };
    },
    getters: {
        role: (state) => state.user?.role === '管理员' ? 'admin' : 'editor'
    },
    actions: {
        login(user) {
            this.isLoggedIn = true;
            this.user = user;
            this.token = user.token;
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('user_id', String(user.id));
        },
        logout() {
            this.isLoggedIn = false;
            this.user = null;
            this.token = '';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
        }
    }
});
//# sourceMappingURL=index.js.map