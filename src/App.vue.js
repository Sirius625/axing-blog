/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import headerNav from './components/header-nav.vue';
import loginModel from './components/loginModel.vue';
const showLoginModal = ref(false);
const handleLoginSuccess = () => {
    showLoginModal.value = false;
    // 刷新页面以更新 headerNav 中的用户名
    window.location.reload();
};
// 监听 token 过期事件，自动弹出登录弹窗
const handleTokenExpired = () => {
    showLoginModal.value = true;
};
onMounted(() => {
    window.addEventListener('token-expired', handleTokenExpired);
});
onUnmounted(() => {
    window.removeEventListener('token-expired', handleTokenExpired);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = headerNav || headerNav;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onOpenLogin': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onOpenLogin': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ openLogin: {} },
    { onOpenLogin: (...[$event]) => {
            __VLS_ctx.showLoginModal = true;
            // @ts-ignore
            [showLoginModal,];
        } });
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "workspace" },
});
/** @type {__VLS_StyleScopedClasses['workspace']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.routerView | typeof __VLS_components.RouterView | typeof __VLS_components['router-view']} */
routerView;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({}));
const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const __VLS_12 = loginModel || loginModel;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onLoginSuccess': {} },
    modelValue: (__VLS_ctx.showLoginModal),
}));
const __VLS_14 = __VLS_13({
    ...{ 'onUpdate:modelValue': {} },
    ...{ 'onLoginSuccess': {} },
    modelValue: (__VLS_ctx.showLoginModal),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = ({ 'update:modelValue': {} },
    { 'onUpdate:modelValue': (...[$event]) => {
            __VLS_ctx.showLoginModal = $event;
            // @ts-ignore
            [showLoginModal, showLoginModal,];
        } });
const __VLS_19 = ({ loginSuccess: {} },
    { onLoginSuccess: (__VLS_ctx.handleLoginSuccess) });
var __VLS_15;
var __VLS_16;
// @ts-ignore
[handleLoginSuccess,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=App.vue.js.map