/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, nextTick } from 'vue';
const props = defineProps();
const __VLS_emit = defineEmits();
const lyricScrollRef = ref(null);
const currentLineIndex = ref(0);
const updateCurrentLine = (time) => {
    if (!props.lyrics.length)
        return;
    let index = props.lyrics.findIndex((line, i) => {
        const nextLine = props.lyrics[i + 1];
        return time >= line.time && (!nextLine || time < nextLine.time);
    });
    if (index === -1)
        index = props.lyrics.length - 1;
    currentLineIndex.value = index;
    nextTick(() => {
        if (lyricScrollRef.value) {
            const activeEl = lyricScrollRef.value.querySelector('.lyric-line.active');
            activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
};
watch(() => props.currentTime, (time) => {
    updateCurrentLine(time);
});
watch(() => props.lyrics, () => {
    if (props.currentTime > 0) {
        updateCurrentLine(props.currentTime);
    }
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
/** @type {__VLS_StyleScopedClasses['lyric-close']} */ ;
/** @type {__VLS_StyleScopedClasses['lyric-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['lyric-line']} */ ;
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
if (__VLS_ctx.visible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.visible))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [visible, $emit,];
            } },
        ...{ class: "lyric-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lyric-container" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.visible))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "lyric-close" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-close']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-times" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lyric-content" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-content']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lyric-header" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.song?.al?.picUrl || 'https://picsum.photos/200?random=' + __VLS_ctx.song?.id),
        ...{ class: "lyric-cover" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-cover']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "lyric-title" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-title']} */ ;
    (__VLS_ctx.song?.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "lyric-artist" },
    });
    /** @type {__VLS_StyleScopedClasses['lyric-artist']} */ ;
    (__VLS_ctx.song?.ar?.[0]?.name || '未知');
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "lyric-scroll" },
        ref: "lyricScrollRef",
    });
    /** @type {__VLS_StyleScopedClasses['lyric-scroll']} */ ;
    if (__VLS_ctx.lyrics.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lyric-empty" },
        });
        /** @type {__VLS_StyleScopedClasses['lyric-empty']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-music" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-music']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "lyric-lines" },
        });
        /** @type {__VLS_StyleScopedClasses['lyric-lines']} */ ;
        for (const [line, index] of __VLS_vFor((__VLS_ctx.lyrics))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                key: (index),
                ...{ class: (['lyric-line', { active: __VLS_ctx.currentLineIndex === index }]) },
            });
            /** @type {__VLS_StyleScopedClasses['active']} */ ;
            /** @type {__VLS_StyleScopedClasses['lyric-line']} */ ;
            (line.text);
            // @ts-ignore
            [song, song, song, song, lyrics, lyrics, currentLineIndex,];
        }
    }
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=LyricModal.vue.js.map