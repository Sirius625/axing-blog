/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const __VLS_props = defineProps();
const __VLS_emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['image-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['overlay-content']} */ ;
/** @type {__VLS_StyleScopedClasses['like-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['like-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['category-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['visibility-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['visibility-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
/** @type {__VLS_StyleScopedClasses['visibility-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('preview', __VLS_ctx.image);
            // @ts-ignore
            [$emit, image,];
        } },
    ...{ class: "image-card" },
});
/** @type {__VLS_StyleScopedClasses['image-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "image-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['image-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: (__VLS_ctx.image.url),
    alt: (__VLS_ctx.image.title),
    ...{ class: "card-image" },
    loading: "lazy",
});
/** @type {__VLS_StyleScopedClasses['card-image']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "image-overlay" },
});
/** @type {__VLS_StyleScopedClasses['image-overlay']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "overlay-content" },
});
/** @type {__VLS_StyleScopedClasses['overlay-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "overlay-title" },
});
/** @type {__VLS_StyleScopedClasses['overlay-title']} */ ;
(__VLS_ctx.image.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "overlay-author" },
});
/** @type {__VLS_StyleScopedClasses['overlay-author']} */ ;
(__VLS_ctx.image.author);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "like-badge" },
});
/** @type {__VLS_StyleScopedClasses['like-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-heart" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.image.likes);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "category-badge" },
    ...{ class: ('category-' + (__VLS_ctx.image.category || '其他')) },
});
/** @type {__VLS_StyleScopedClasses['category-badge']} */ ;
(__VLS_ctx.image.category || '其他');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "visibility-badge" },
    ...{ class: (__VLS_ctx.image.isPublic ? 'public' : 'private') },
});
/** @type {__VLS_StyleScopedClasses['visibility-badge']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: (__VLS_ctx.image.isPublic ? 'fas fa-globe' : 'fas fa-lock') },
});
(__VLS_ctx.image.isPublic ? '公开' : '私密');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-info" },
});
/** @type {__VLS_StyleScopedClasses['card-info']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "info-header" },
});
/** @type {__VLS_StyleScopedClasses['info-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "info-title" },
});
/** @type {__VLS_StyleScopedClasses['info-title']} */ ;
(__VLS_ctx.image.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "info-date" },
});
/** @type {__VLS_StyleScopedClasses['info-date']} */ ;
(__VLS_ctx.image.date);
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "info-desc" },
});
/** @type {__VLS_StyleScopedClasses['info-desc']} */ ;
(__VLS_ctx.image.description);
// @ts-ignore
[image, image, image, image, image, image, image, image, image, image, image, image, image,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=ImageCard.vue.js.map