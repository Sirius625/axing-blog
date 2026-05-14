/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
const props = defineProps();
const emit = defineEmits();
const updateVisible = (value) => {
    emit('update:visible', value);
};
const handleConfirm = () => {
    emit('confirm');
    emit('update:visible', false);
};
const handleCancel = () => {
    emit('cancel');
    emit('update:visible', false);
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.title),
    width: "400px",
    beforeClose: (__VLS_ctx.handleCancel),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.visible),
    title: (__VLS_ctx.title),
    width: "400px",
    beforeClose: (__VLS_ctx.handleCancel),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ 'update:modelValue': {} },
    { 'onUpdate:modelValue': (__VLS_ctx.updateVisible) });
var __VLS_7 = {};
const { default: __VLS_8 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.message);
{
    const { footer: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_10;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        ...{ 'onClick': {} },
    }));
    const __VLS_12 = __VLS_11({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    let __VLS_15;
    const __VLS_16 = ({ click: {} },
        { onClick: (__VLS_ctx.handleCancel) });
    const { default: __VLS_17 } = __VLS_13.slots;
    (__VLS_ctx.cancelText ? __VLS_ctx.cancelText : '取消');
    // @ts-ignore
    [visible, title, handleCancel, handleCancel, updateVisible, message, cancelText, cancelText,];
    var __VLS_13;
    var __VLS_14;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_20 = __VLS_19({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    let __VLS_23;
    const __VLS_24 = ({ click: {} },
        { onClick: (__VLS_ctx.handleConfirm) });
    const { default: __VLS_25 } = __VLS_21.slots;
    (__VLS_ctx.confirmText ? __VLS_ctx.confirmText : '确认');
    // @ts-ignore
    [handleConfirm, confirmText, confirmText,];
    var __VLS_21;
    var __VLS_22;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=ConfirmDialog.vue.js.map