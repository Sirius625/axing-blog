/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
const formatCount = (count) => {
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + '万';
    }
    return count.toString();
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
/** @type {__VLS_StyleScopedClasses['playlist-card']} */ ;
/** @type {__VLS_StyleScopedClasses['playlist-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['card-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('select', __VLS_ctx.playlist);
            // @ts-ignore
            [$emit, playlist,];
        } },
    ...{ class: "playlist-card" },
});
/** @type {__VLS_StyleScopedClasses['playlist-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-image-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['card-image-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.playlist.coverImgUrl || __VLS_ctx.playlist.picUrl),
    alt: (__VLS_ctx.playlist.name),
    ...{ class: "card-image" },
    loading: "lazy",
});
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-overlay" },
});
/** @type {__VLS_StyleScopedClasses['card-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-play-circle play-icon" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-play-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['play-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "play-count" },
});
/** @type {__VLS_StyleScopedClasses['play-count']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-headphones" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-headphones']} */ ;
(__VLS_ctx.formatCount(__VLS_ctx.playlist.playCount || 0));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-info" },
});
/** @type {__VLS_StyleScopedClasses['card-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({
    ...{ class: "card-title" },
});
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
(__VLS_ctx.playlist.name);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "card-desc" },
});
/** @type {__VLS_StyleScopedClasses['card-desc']} */ ;
(__VLS_ctx.playlist.description || __VLS_ctx.playlist.copywriter || '');
// @ts-ignore
[playlist, playlist, playlist, playlist, playlist, playlist, playlist, formatCount,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=PlaylistCard.vue.js.map