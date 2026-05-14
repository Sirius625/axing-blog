/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
const props = defineProps();
const __VLS_emit = defineEmits();
const scale = ref(1);
const posX = ref(0);
const posY = ref(0);
const isDragging = ref(false);
const dragStartX = ref(0);
const dragStartY = ref(0);
const dragStartPosX = ref(0);
const dragStartPosY = ref(0);
const imageLoaded = ref(false);
const containerRef = ref(null);
// 触摸相关
let lastTouchDist = 0;
let lastTouchCenter = { x: 0, y: 0 };
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const zoomIn = () => {
    scale.value = Math.min(scale.value * 1.3, MAX_SCALE);
};
const zoomOut = () => {
    scale.value = Math.max(scale.value / 1.3, MIN_SCALE);
};
const resetZoom = () => {
    scale.value = 1;
    posX.value = 0;
    posY.value = 0;
};
const handleWheel = (e) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale.value * delta, MIN_SCALE), MAX_SCALE);
    // 以鼠标位置为中心缩放
    if (containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect();
        const mouseX = e.clientX - rect.left - rect.width / 2;
        const mouseY = e.clientY - rect.top - rect.height / 2;
        posX.value = mouseX - (mouseX - posX.value) * (newScale / scale.value);
        posY.value = mouseY - (mouseY - posY.value) * (newScale / scale.value);
    }
    scale.value = newScale;
};
// 鼠标拖拽
const startDrag = (e) => {
    if (scale.value <= 1)
        return;
    isDragging.value = true;
    dragStartX.value = e.clientX;
    dragStartY.value = e.clientY;
    dragStartPosX.value = posX.value;
    dragStartPosY.value = posY.value;
};
const onDrag = (e) => {
    if (!isDragging.value)
        return;
    posX.value = dragStartPosX.value + (e.clientX - dragStartX.value);
    posY.value = dragStartPosY.value + (e.clientY - dragStartY.value);
};
const endDrag = () => {
    isDragging.value = false;
};
// 触摸支持
const startTouch = (e) => {
    if (e.touches.length === 1) {
        if (scale.value <= 1)
            return;
        isDragging.value = true;
        dragStartX.value = e.touches[0].clientX;
        dragStartY.value = e.touches[0].clientY;
        dragStartPosX.value = posX.value;
        dragStartPosY.value = posY.value;
    }
    else if (e.touches.length === 2) {
        // 双指缩放
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        lastTouchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        lastTouchCenter = {
            x: (t1.clientX + t2.clientX) / 2,
            y: (t1.clientY + t2.clientY) / 2
        };
    }
};
const onTouch = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.value) {
        posX.value = dragStartPosX.value + (e.touches[0].clientX - dragStartX.value);
        posY.value = dragStartPosY.value + (e.touches[0].clientY - dragStartY.value);
    }
    else if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (lastTouchDist > 0) {
            const delta = dist / lastTouchDist;
            const newScale = Math.min(Math.max(scale.value * delta, MIN_SCALE), MAX_SCALE);
            scale.value = newScale;
        }
        lastTouchDist = dist;
    }
};
const endTouch = () => {
    isDragging.value = false;
    lastTouchDist = 0;
};
// 切换图片时重置
watch(() => props.image, () => {
    scale.value = 1;
    posX.value = 0;
    posY.value = 0;
    imageLoaded.value = false;
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
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['zoom-level']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-info']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-meta']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "modal-fade",
}));
const __VLS_2 = __VLS_1({
    name: "modal-fade",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.image) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onWheel: (__VLS_ctx.handleWheel) },
        ...{ onMousedown: (__VLS_ctx.startDrag) },
        ...{ onMousemove: (__VLS_ctx.onDrag) },
        ...{ onMouseup: (__VLS_ctx.endDrag) },
        ...{ onMouseleave: (__VLS_ctx.endDrag) },
        ...{ onTouchstart: (__VLS_ctx.startTouch) },
        ...{ onTouchmove: (__VLS_ctx.onTouch) },
        ...{ onTouchend: (__VLS_ctx.endTouch) },
        ...{ class: "preview-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['preview-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preview-toolbar" },
    });
    /** @type {__VLS_StyleScopedClasses['preview-toolbar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.zoomIn) },
        ...{ class: "toolbar-btn" },
        title: "放大",
    });
    /** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-search-plus" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-search-plus']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.zoomOut) },
        ...{ class: "toolbar-btn" },
        title: "缩小",
    });
    /** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-search-minus" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-search-minus']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.resetZoom) },
        ...{ class: "toolbar-btn" },
        title: "重置",
    });
    /** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-expand" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-expand']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "zoom-level" },
    });
    /** @type {__VLS_StyleScopedClasses['zoom-level']} */ ;
    (Math.round(__VLS_ctx.scale * 100));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.image))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [image, handleWheel, startDrag, onDrag, endDrag, endDrag, startTouch, onTouch, endTouch, zoomIn, zoomOut, resetZoom, scale, $emit,];
            } },
        ...{ class: "toolbar-btn close-btn" },
        title: "关闭",
    });
    /** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-times" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "preview-content" },
        ref: "containerRef",
    });
    /** @type {__VLS_StyleScopedClasses['preview-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        ...{ onLoad: (...[$event]) => {
                if (!(__VLS_ctx.image))
                    return;
                __VLS_ctx.imageLoaded = true;
                // @ts-ignore
                [imageLoaded,];
            } },
        src: (__VLS_ctx.image.url),
        alt: (__VLS_ctx.image.title),
        ...{ class: "preview-image" },
        ...{ style: ({ transform: `translate(${__VLS_ctx.posX}px, ${__VLS_ctx.posY}px) scale(${__VLS_ctx.scale})`, cursor: __VLS_ctx.isDragging ? 'grabbing' : 'grab' }) },
        draggable: "false",
    });
    /** @type {__VLS_StyleScopedClasses['preview-image']} */ ;
    if (!__VLS_ctx.isDragging) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "preview-info" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "preview-title" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-title']} */ ;
        (__VLS_ctx.image.title);
        if (__VLS_ctx.image.description) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "preview-desc" },
            });
            /** @type {__VLS_StyleScopedClasses['preview-desc']} */ ;
            (__VLS_ctx.image.description);
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "preview-meta" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-meta']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-user" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-user']} */ ;
        (__VLS_ctx.image.author);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "meta-likes" },
        });
        /** @type {__VLS_StyleScopedClasses['meta-likes']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-heart" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
        (__VLS_ctx.image.likes);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-calendar" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-calendar']} */ ;
        (__VLS_ctx.image.date);
    }
}
// @ts-ignore
[image, image, image, image, image, image, image, image, scale, posX, posY, isDragging, isDragging,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=ImagePreviewModal.vue.js.map