/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const props = defineProps();
const emit = defineEmits();
const fileInputRef = ref(null);
const previewUrl = ref('');
const fileData = ref(null);
const title = ref('');
const description = ref('');
const category = ref('其他');
const isPublic = ref(true);
const uploading = ref(false);
const triggerFileInput = () => {
    fileInputRef.value?.click();
};
const handleFileSelect = (e) => {
    const target = e.target;
    const file = target.files?.[0];
    if (!file)
        return;
    if (file.size > 5 * 1024 * 1024) {
        alert('文件大小不能超过5MB');
        return;
    }
    if (!file.type.startsWith('image/')) {
        alert('仅支持JPG/PNG/WebP格式');
        return;
    }
    fileData.value = file;
    const reader = new FileReader();
    reader.onload = (event) => {
        previewUrl.value = event.target?.result;
    };
    reader.readAsDataURL(file);
};
const handleUpload = () => {
    if (!fileData.value) {
        alert('请先选择图片');
        return;
    }
    if (!title.value) {
        alert('请输入图片标题');
        return;
    }
    uploading.value = true;
    emit('upload', {
        title: title.value,
        description: description.value,
        category: category.value,
        isPublic: isPublic.value,
        file: fileData.value
    });
};
// 暴露重置方法给父组件
const reset = () => {
    previewUrl.value = '';
    fileData.value = null;
    title.value = '';
    description.value = '';
    uploading.value = false;
};
const __VLS_exposed = { reset };
defineExpose(__VLS_exposed);
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
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
/** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
/** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
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
        ...{ class: "modal-overlay" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-backdrop" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-backdrop']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-container" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-header" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.visible))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [$emit,];
            } },
        ...{ class: "close-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-times" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-times']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-body" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.triggerFileInput) },
        ...{ class: "upload-zone" },
    });
    /** @type {__VLS_StyleScopedClasses['upload-zone']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        ...{ onChange: (__VLS_ctx.handleFileSelect) },
        ref: "fileInputRef",
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        ...{ class: "hidden-input" },
    });
    /** @type {__VLS_StyleScopedClasses['hidden-input']} */ ;
    if (!__VLS_ctx.previewUrl) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-placeholder" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-placeholder']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "upload-icon" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-cloud-upload-alt" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-cloud-upload-alt']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "upload-text" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-text']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "upload-hint" },
        });
        /** @type {__VLS_StyleScopedClasses['upload-hint']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "preview-area" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-area']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.previewUrl),
            alt: "预览",
            ...{ class: "preview-img" },
        });
        /** @type {__VLS_StyleScopedClasses['preview-img']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (__VLS_ctx.triggerFileInput) },
            ...{ class: "change-btn" },
        });
        /** @type {__VLS_StyleScopedClasses['change-btn']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        value: (__VLS_ctx.title),
        type: "text",
        ...{ class: "form-input" },
        placeholder: "请输入图片标题",
    });
    /** @type {__VLS_StyleScopedClasses['form-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        value: (__VLS_ctx.category),
        ...{ class: "form-input" },
    });
    /** @type {__VLS_StyleScopedClasses['form-input']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "其他",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "运动",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "日常",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "游戏",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "radio-group" },
    });
    /** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "radio-label" },
        ...{ class: ({ active: __VLS_ctx.isPublic }) },
    });
    /** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "radio",
        value: (true),
    });
    (__VLS_ctx.isPublic);
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-globe" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-globe']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "radio-label" },
        ...{ class: ({ active: !__VLS_ctx.isPublic }) },
    });
    /** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
    /** @type {__VLS_StyleScopedClasses['active']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "radio",
        value: (false),
    });
    (__VLS_ctx.isPublic);
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-lock" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-lock']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "form-group" },
    });
    /** @type {__VLS_StyleScopedClasses['form-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.textarea, __VLS_intrinsics.textarea)({
        value: (__VLS_ctx.description),
        ...{ class: "form-textarea" },
        rows: "3",
        placeholder: "请输入图片描述（可选）",
    });
    /** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "modal-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['modal-footer']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.visible))
                    return;
                __VLS_ctx.$emit('close');
                // @ts-ignore
                [$emit, triggerFileInput, triggerFileInput, handleFileSelect, previewUrl, previewUrl, title, category, isPublic, isPublic, isPublic, isPublic, description,];
            } },
        ...{ class: "secondary-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['secondary-btn']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.handleUpload) },
        ...{ class: "primary-btn" },
        disabled: (__VLS_ctx.uploading),
    });
    /** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
    if (__VLS_ctx.uploading) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-spinner fa-spin" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-spin']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
            ...{ class: "fas fa-upload" },
        });
        /** @type {__VLS_StyleScopedClasses['fas']} */ ;
        /** @type {__VLS_StyleScopedClasses['fa-upload']} */ ;
    }
    (__VLS_ctx.uploading ? '上传中...' : '确认上传');
}
// @ts-ignore
[handleUpload, uploading, uploading, uploading,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=ImageUploadModal.vue.js.map