/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { get1, post1 } from '@/api/index';
import ImageCard from '@/components/home/ImageCard.vue';
import ImageUploadModal from '@/components/home/ImageUploadModal.vue';
import ImagePreviewModal from '@/components/home/ImagePreviewModal.vue';
// 状态
const images = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedVisibility = ref('');
const sortBy = ref('newest');
const viewMode = ref('grid');
const isDark = ref(false);
const showUploadModal = ref(false);
const previewImage = ref(null);
const uploadModalRef = ref(null);
const toast = ref({ show: false, message: '', type: 'success' });
// 获取图片列表
const fetchImages = async () => {
    loading.value = true;
    try {
        let url = '/api/images?page=1&pageSize=100&_t=' + Date.now();
        // 根据可见性筛选参数传递
        if (selectedVisibility.value !== '') {
            url += '&isPublic=' + selectedVisibility.value;
        }
        const res = await get1(url);
        console.log('fetchImages response:', res);
        if (res.success && res.data) {
            const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
            console.log('fetchImages list:', list);
            images.value = list.map((img) => ({
                id: img.id,
                url: 'http://localhost:3030' + img.url,
                title: img.title,
                description: img.description || '',
                category: img.category || '其他',
                author: img.author || '匿名',
                likes: img.likes || 0,
                isPublic: img.is_public,
                date: img.created_at ? img.created_at.split(' ')[0] : '未知'
            }));
            console.log('images.value after map:', images.value);
        }
        else {
            console.warn('fetchImages: no data returned', res);
        }
    }
    catch (e) {
        console.error('获取图片列表失败:', e);
    }
    finally {
        loading.value = false;
    }
};
// 计算属性
const filteredImages = computed(() => {
    let result = images.value;
    // 按分类筛选
    if (selectedCategory.value) {
        result = result.filter(img => img.category === selectedCategory.value);
    }
    // 按可见性筛选
    if (selectedVisibility.value !== '') {
        const isPublicVal = selectedVisibility.value === '1' ? 1 : 0;
        result = result.filter(img => img.isPublic === isPublicVal);
    }
    // 按关键词搜索
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        result = result.filter(img => img.title.toLowerCase().includes(q) ||
            img.description.toLowerCase().includes(q));
    }
    if (sortBy.value === 'popular') {
        result.sort((a, b) => b.likes - a.likes);
    }
    else if (sortBy.value === 'name') {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }
    else {
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return result;
});
// 搜索输入防抖
let searchTimer = null;
const handleSearchInput = () => {
    if (searchTimer)
        clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        // 搜索已通过计算属性实时过滤，这里只是触发更新
    }, 300);
};
// 分类切换 - 从后端重新获取
const handleCategoryChange = async () => {
    loading.value = true;
    try {
        let url = '/api/images?page=1&pageSize=100';
        if (selectedCategory.value) {
            url += '&category=' + encodeURIComponent(selectedCategory.value);
        }
        // 保持可见性筛选
        if (selectedVisibility.value !== '') {
            url += '&isPublic=' + selectedVisibility.value;
        }
        const res = await get1(url);
        if (res.success && res.data) {
            const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
            images.value = list.map((img) => ({
                id: img.id,
                url: 'http://localhost:3030' + img.url,
                title: img.title,
                description: img.description || '',
                category: img.category || '其他',
                author: img.author || '匿名',
                likes: img.likes || 0,
                isPublic: img.is_public,
                date: img.created_at ? img.created_at.split(' ')[0] : '未知'
            }));
        }
    }
    catch (e) {
        console.error('获取图片列表失败:', e);
    }
    finally {
        loading.value = false;
    }
};
// 可见性切换 - 从后端重新获取
const handleVisibilityChange = async () => {
    loading.value = true;
    try {
        let url = '/api/images?page=1&pageSize=100';
        if (selectedVisibility.value !== '') {
            url += '&isPublic=' + selectedVisibility.value;
        }
        if (selectedCategory.value) {
            url += '&category=' + encodeURIComponent(selectedCategory.value);
        }
        const res = await get1(url);
        if (res.success && res.data) {
            const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
            images.value = list.map((img) => ({
                id: img.id,
                url: 'http://localhost:3030' + img.url,
                title: img.title,
                description: img.description || '',
                category: img.category || '其他',
                author: img.author || '匿名',
                likes: img.likes || 0,
                isPublic: img.is_public,
                date: img.created_at ? img.created_at.split(' ')[0] : '未知'
            }));
        }
    }
    catch (e) {
        console.error('获取图片列表失败:', e);
    }
    finally {
        loading.value = false;
    }
};
// 方法
const toggleTheme = () => {
    isDark.value = !isDark.value;
};
const openPreview = (image) => {
    previewImage.value = image;
    document.body.style.overflow = 'hidden';
};
const closePreview = () => {
    previewImage.value = null;
    document.body.style.overflow = '';
};
const handleUpload = async (data) => {
    try {
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target?.result);
            reader.readAsDataURL(data.file);
        });
        const result = await post1('/api/images/upload', {
            title: data.title,
            description: data.description,
            category: data.category,
            isPublic: data.isPublic,
            imageBase64: base64
        });
        if (result.success && result.data) {
            showToast('上传成功！', 'success');
            showUploadModal.value = false;
            uploadModalRef.value?.reset();
            fetchImages();
        }
        else {
            showToast(result.message || '上传失败', 'error');
        }
    }
    catch (e) {
        console.error('上传失败:', e);
        showToast('上传失败，请检查网络连接', 'error');
    }
};
const showToast = (message, type = 'success') => {
    toast.value = { show: true, message, type };
    setTimeout(() => {
        toast.value.show = false;
    }, 3000);
};
const resetView = () => {
    searchQuery.value = '';
    sortBy.value = 'newest';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
onMounted(() => {
    fetchImages();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['gallery-app']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
/** @type {__VLS_StyleScopedClasses['control-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['view-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['image-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['link-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
/** @type {__VLS_StyleScopedClasses['toast']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: (['gallery-app', { 'dark-mode': __VLS_ctx.isDark }]) },
});
/** @type {__VLS_StyleScopedClasses['gallery-app']} */ ;
/** @type {__VLS_StyleScopedClasses['dark-mode']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
    ...{ class: "app-header" },
});
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-content" },
});
/** @type {__VLS_StyleScopedClasses['header-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.resetView) },
    ...{ class: "logo-area" },
});
/** @type {__VLS_StyleScopedClasses['logo-area']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "logo-icon" },
});
/** @type {__VLS_StyleScopedClasses['logo-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-images" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-images']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "header-actions" },
});
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.toggleTheme) },
    ...{ class: "icon-btn" },
    title: (__VLS_ctx.isDark ? '切换亮色模式' : '切换暗色模式'),
});
/** @type {__VLS_StyleScopedClasses['icon-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: (__VLS_ctx.isDark ? 'fas fa-sun' : 'fas fa-moon') },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.showUploadModal = true;
            // @ts-ignore
            [isDark, isDark, isDark, resetView, toggleTheme, showUploadModal,];
        } },
    ...{ class: "primary-btn" },
});
/** @type {__VLS_StyleScopedClasses['primary-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-upload" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-upload']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: "app-main" },
});
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "control-bar" },
});
/** @type {__VLS_StyleScopedClasses['control-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "search-box" },
});
/** @type {__VLS_StyleScopedClasses['search-box']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-search search-icon" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-search']} */ ;
/** @type {__VLS_StyleScopedClasses['search-icon']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (__VLS_ctx.handleSearchInput) },
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "搜索图片标题或描述...",
    ...{ class: "search-input" },
});
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "filter-controls" },
});
/** @type {__VLS_StyleScopedClasses['filter-controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (__VLS_ctx.handleCategoryChange) },
    value: (__VLS_ctx.selectedCategory),
    ...{ class: "select-input" },
});
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
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
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "其他",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (__VLS_ctx.handleVisibilityChange) },
    value: (__VLS_ctx.selectedVisibility),
    ...{ class: "select-input" },
});
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "1",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "0",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    value: (__VLS_ctx.sortBy),
    ...{ class: "select-input" },
});
/** @type {__VLS_StyleScopedClasses['select-input']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "newest",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "popular",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "name",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "view-toggle" },
});
/** @type {__VLS_StyleScopedClasses['view-toggle']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.viewMode = 'grid';
            // @ts-ignore
            [handleSearchInput, searchQuery, handleCategoryChange, selectedCategory, handleVisibilityChange, selectedVisibility, sortBy, viewMode,];
        } },
    ...{ class: (['toggle-btn', { active: __VLS_ctx.viewMode === 'grid' }]) },
    title: "网格视图",
});
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-th" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-th']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.viewMode = 'list';
            // @ts-ignore
            [viewMode, viewMode,];
        } },
    ...{ class: (['toggle-btn', { active: __VLS_ctx.viewMode === 'list' }]) },
    title: "列表视图",
});
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['toggle-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-list" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-list']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-bar" },
});
/** @type {__VLS_StyleScopedClasses['status-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "count-text" },
});
/** @type {__VLS_StyleScopedClasses['count-text']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
(__VLS_ctx.filteredImages.length);
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "loading-indicator" },
    });
    /** @type {__VLS_StyleScopedClasses['loading-indicator']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-spinner fa-spin" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-spinner']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-spin']} */ ;
}
if (__VLS_ctx.filteredImages.length > 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: (['image-container', __VLS_ctx.viewMode]) },
    });
    /** @type {__VLS_StyleScopedClasses['image-container']} */ ;
    for (const [img] of __VLS_vFor((__VLS_ctx.filteredImages))) {
        const __VLS_0 = ImageCard;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            ...{ 'onPreview': {} },
            key: (img.id),
            image: (img),
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onPreview': {} },
            key: (img.id),
            image: (img),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_5;
        const __VLS_6 = ({ preview: {} },
            { onPreview: (__VLS_ctx.openPreview) });
        var __VLS_3;
        var __VLS_4;
        // @ts-ignore
        [viewMode, viewMode, filteredImages, filteredImages, filteredImages, loading, openPreview,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-state" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-icon" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-icon']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-images" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-images']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.filteredImages.length > 0))
                    return;
                __VLS_ctx.showUploadModal = true;
                // @ts-ignore
                [showUploadModal,];
            } },
        ...{ class: "link-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['link-btn']} */ ;
}
const __VLS_7 = ImageUploadModal;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClose': {} },
    ...{ 'onUpload': {} },
    ref: "uploadModalRef",
    visible: (__VLS_ctx.showUploadModal),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClose': {} },
    ...{ 'onUpload': {} },
    ref: "uploadModalRef",
    visible: (__VLS_ctx.showUploadModal),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = ({ close: {} },
    { onClose: (...[$event]) => {
            __VLS_ctx.showUploadModal = false;
            // @ts-ignore
            [showUploadModal, showUploadModal,];
        } });
const __VLS_14 = ({ upload: {} },
    { onUpload: (__VLS_ctx.handleUpload) });
var __VLS_15 = {};
var __VLS_10;
var __VLS_11;
const __VLS_17 = ImagePreviewModal;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClose': {} },
    image: (__VLS_ctx.previewImage),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClose': {} },
    image: (__VLS_ctx.previewImage),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = ({ close: {} },
    { onClose: (__VLS_ctx.closePreview) });
var __VLS_20;
var __VLS_21;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    name: "toast-slide",
}));
const __VLS_26 = __VLS_25({
    name: "toast-slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
if (__VLS_ctx.toast.show) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: (['toast', __VLS_ctx.toast.type]) },
    });
    /** @type {__VLS_StyleScopedClasses['toast']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: (__VLS_ctx.toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle') },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.toast.message);
}
// @ts-ignore
[handleUpload, previewImage, closePreview, toast, toast, toast, toast,];
var __VLS_27;
// @ts-ignore
var __VLS_16 = __VLS_15;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=index.vue.js.map