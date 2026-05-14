/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store';
const emit = defineEmits();
const authStore = useAuthStore();
const navItems = [
    { id: 1, text: '首页', name: 'home', icon: 'fa-solid fa-house' },
    { id: 2, text: '音乐', name: 'music', icon: 'fa-solid fa-music' },
    { id: 3, text: '知识', name: 'knowledge', icon: 'fa-solid fa-book' }
];
const showLogoutMenu = ref(false);
const username = ref(authStore.user?.name || localStorage.getItem('username') || '登陆');
const handleUserClick = () => {
    if (authStore.isLoggedIn) {
        showLogoutMenu.value = !showLogoutMenu.value;
    }
    else {
        emit('open-login');
    }
};
const handleLogout = () => {
    authStore.logout();
    username.value = '登陆';
    showLogoutMenu.value = false;
    window.location.reload();
};
const handleClickOutside = (e) => {
    const target = e.target;
    if (!target.closest('.user-area')) {
        showLogoutMenu.value = false;
    }
};
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
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
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link--active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link--active']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['user-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['user-btn--logged']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item--danger']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
/** @type {__VLS_StyleScopedClasses['navbar-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['user-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
/** @type {__VLS_StyleScopedClasses['user-arrow']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "navbar" },
});
/** @type {__VLS_StyleScopedClasses['navbar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "navbar-inner" },
});
/** @type {__VLS_StyleScopedClasses['navbar-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-area" },
});
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-icon" },
});
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fa-solid fa-crown" },
});
/** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-crown']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "logo-text" },
});
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "logo-accent" },
});
/** @type {__VLS_StyleScopedClasses['logo-accent']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
    ...{ class: "nav-links" },
});
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.navItems))) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components['router-link'] | typeof __VLS_components.routerLink | typeof __VLS_components.RouterLink | typeof __VLS_components['router-link']} */
    routerLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        key: (item.id),
        to: ({ name: item.name }),
        ...{ class: "nav-link" },
        activeClass: "nav-link--active",
    }));
    const __VLS_2 = __VLS_1({
        key: (item.id),
        to: ({ name: item.name }),
        ...{ class: "nav-link" },
        activeClass: "nav-link--active",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: (item.icon) },
        ...{ class: "nav-link-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['nav-link-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (item.text);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "nav-link-indicator" },
    });
    /** @type {__VLS_StyleScopedClasses['nav-link-indicator']} */ ;
    // @ts-ignore
    [navItems,];
    var __VLS_3;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-area" },
});
/** @type {__VLS_StyleScopedClasses['user-area']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.handleUserClick) },
    ...{ class: "user-btn" },
    ...{ class: ({ 'user-btn--logged': __VLS_ctx.authStore.isLoggedIn }) },
});
/** @type {__VLS_StyleScopedClasses['user-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['user-btn--logged']} */ ;
if (__VLS_ctx.authStore.isLoggedIn) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "user-avatar" },
    });
    /** @type {__VLS_StyleScopedClasses['user-avatar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fa-solid fa-user" },
    });
    /** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-user']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fa-solid fa-circle-user user-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-circle-user']} */ ;
    /** @type {__VLS_StyleScopedClasses['user-icon']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "user-name" },
});
/** @type {__VLS_StyleScopedClasses['user-name']} */ ;
(__VLS_ctx.username);
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fa-solid fa-chevron-down user-arrow" },
    ...{ class: ({ 'user-arrow--open': __VLS_ctx.showLogoutMenu }) },
});
/** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-chevron-down']} */ ;
/** @type {__VLS_StyleScopedClasses['user-arrow']} */ ;
/** @type {__VLS_StyleScopedClasses['user-arrow--open']} */ ;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    name: "dropdown",
}));
const __VLS_8 = __VLS_7({
    name: "dropdown",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
if (__VLS_ctx.showLogoutMenu) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dropdown-menu" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-menu']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dropdown-header" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dropdown-avatar" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-avatar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fa-solid fa-user" },
    });
    /** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-user']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dropdown-info" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "dropdown-name" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-name']} */ ;
    (__VLS_ctx.authStore.user?.name || '用户');
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "dropdown-role" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-role']} */ ;
    (__VLS_ctx.authStore.user?.role || '未登录');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dropdown-divider" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-divider']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleLogout) },
        ...{ class: "dropdown-item dropdown-item--danger" },
    });
    /** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
    /** @type {__VLS_StyleScopedClasses['dropdown-item--danger']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fa-solid fa-right-from-bracket" },
    });
    /** @type {__VLS_StyleScopedClasses['fa-solid']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-right-from-bracket']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
// @ts-ignore
[handleUserClick, authStore, authStore, authStore, authStore, username, showLogoutMenu, showLogoutMenu, handleLogout,];
var __VLS_9;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
});
export default {};
//# sourceMappingURL=header-nav.vue.js.map