/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch } from 'vue';
import { loginUser } from '@/api/http1';
import { useAuthStore } from '@/store';
import { ElMessage } from 'element-plus';
// 如果自动导入未配置样式，需手动引入样式（视构建工具而定）
import 'element-plus/es/components/message/style/css';
const authStore = useAuthStore();
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'login-success']);
// 状态管理
const visible = ref(props.modelValue);
const isLoading = ref(false);
const errors = reactive({
    username: '',
    password: ''
});
const form = reactive({
    username: '',
    password: '',
    rememberMe: false
});
// 监听外部visible变化
watch(() => props.modelValue, (newVal) => {
    visible.value = newVal;
    if (newVal)
        resetForm();
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
    alert('跳转到注册页面逻辑');
};
// 验证逻辑
const validate = () => {
    let isValid = true;
    errors.username = '';
    errors.password = '';
    if (!form.username.trim()) {
        errors.username = '用户名不能为空';
        isValid = false;
    }
    else if (form.username.length < 3) {
        errors.username = '用户名至少3个字符';
        isValid = false;
    }
    if (!form.password) {
        errors.password = '密码不能为空';
        isValid = false;
    }
    else if (form.password.length < 6) {
        errors.password = '密码至少6个字符';
        isValid = false;
    }
    return isValid;
};
// 处理登录
const handleLogin = async () => {
    if (!validate())
        return;
    isLoading.value = true;
    try {
        const user = await loginUser(form.username, form.password);
        if (user) {
            authStore.login(user);
            ElMessage({
                message: '登录成功',
                type: 'success',
                duration: 1500,
                offset: window.innerHeight / 3
            });
            localStorage.setItem('username', form.username);
            emit('login-success');
        }
        else {
            // 这里可以显示错误消息
            console.error('用户名或密码错误');
        }
    }
    catch (error) {
        console.error('登录失败:', error);
    }
    finally {
        isLoading.value = false;
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['checkbox-container']} */ ;
/** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.close) },
        ...{ class: "modal-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-container" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-header" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.close) },
        ...{ class: "close-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.handleLogin) },
        ...{ class: "modal-body" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "username",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "text",
        id: "username",
        value: (__VLS_ctx.form.username),
        placeholder: "请输入用户名",
        ...{ class: ({ 'error-border': __VLS_ctx.errors.username }) },
    });
    /** @type {__VLS_StyleScopedClasses['error-border']} */ ;
    if (__VLS_ctx.errors.username) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "error-msg" },
        });
        /** @type {__VLS_StyleScopedClasses['error-msg']} */ ;
        (__VLS_ctx.errors.username);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "password",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "password",
        id: "password",
        placeholder: "请输入密码",
        ...{ class: ({ 'error-border': __VLS_ctx.errors.password }) },
    });
    (__VLS_ctx.form.password);
    /** @type {__VLS_StyleScopedClasses['error-border']} */ ;
    if (__VLS_ctx.errors.password) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "error-msg" },
        });
        /** @type {__VLS_StyleScopedClasses['error-msg']} */ ;
        (__VLS_ctx.errors.password);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-options" },
    });
    /** @type {__VLS_StyleScopedClasses['form-options']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "checkbox-container" },
    });
    /** @type {__VLS_StyleScopedClasses['checkbox-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "checkbox",
    });
    (__VLS_ctx.form.rememberMe);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "checkmark" },
    });
    /** @type {__VLS_StyleScopedClasses['checkmark']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        href: "#",
        ...{ class: "forgot-link" },
    });
    /** @type {__VLS_StyleScopedClasses['forgot-link']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        ...{ class: "login-btn" },
        disabled: (__VLS_ctx.isLoading),
    });
    /** @type {__VLS_StyleScopedClasses['login-btn']} */ ;
    if (__VLS_ctx.isLoading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "spinner" },
        });
        /** @type {__VLS_StyleScopedClasses['spinner']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
        ...{ onClick: (__VLS_ctx.switchToRegister) },
        href: "#",
    });
}
// @ts-ignore
[visible, close, close, handleLogin, form, form, form, errors, errors, errors, errors, errors, errors, isLoading, isLoading, switchToRegister,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=loginModel.vue.js.map