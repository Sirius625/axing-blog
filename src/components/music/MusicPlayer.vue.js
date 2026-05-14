/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="E:/management-system/axing-blog/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, onMounted, onUnmounted } from 'vue';
const props = defineProps();
const emit = defineEmits();
const progressPercent = computed(() => {
    if (props.duration === 0)
        return 0;
    return (props.currentTime / props.duration) * 100;
});
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds))
        return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};
const progressRef = ref(null);
const progressRef2 = ref(null);
const seekTo = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    emit('seek', percent * props.duration);
};
const setVolume = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    emit('setVolume', percent * 100);
};
// 检测是否为移动端
const isMobile = ref(false);
const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
});
onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
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
/** @type {__VLS_StyleScopedClasses['player-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['player-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['liked']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['volume-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['volume-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['volume-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['player-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['player-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['player-inner']} */ ;
/** @type {__VLS_StyleScopedClasses['player-left']} */ ;
/** @type {__VLS_StyleScopedClasses['cover-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['player-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['player-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['playing']} */ ;
/** @type {__VLS_StyleScopedClasses['player-song-info']} */ ;
/** @type {__VLS_StyleScopedClasses['player-song-name']} */ ;
/** @type {__VLS_StyleScopedClasses['player-song-artist']} */ ;
/** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['liked']} */ ;
/** @type {__VLS_StyleScopedClasses['player-center']} */ ;
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['player-right']} */ ;
/** @type {__VLS_StyleScopedClasses['player-right']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['time']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-thumb']} */ ;
/** @type {__VLS_StyleScopedClasses['volume-control']} */ ;
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-bar" },
});
/** @type {__VLS_StyleScopedClasses['player-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-progress-bar" },
});
/** @type {__VLS_StyleScopedClasses['player-progress-bar']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.seekTo) },
    ...{ class: "progress-track" },
    ref: "progressRef",
});
/** @type {__VLS_StyleScopedClasses['progress-track']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-fill" },
    ...{ style: ({ width: __VLS_ctx.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-thumb" },
    ...{ style: ({ left: __VLS_ctx.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['progress-thumb']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-inner" },
});
/** @type {__VLS_StyleScopedClasses['player-inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-left" },
});
/** @type {__VLS_StyleScopedClasses['player-left']} */ ;
if (__VLS_ctx.currentSong) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "cover-wrapper" },
    });
    /** @type {__VLS_StyleScopedClasses['cover-wrapper']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.currentSong.al?.picUrl || 'https://picsum.photos/50'),
        ...{ class: "player-cover" },
        ...{ class: ({ playing: __VLS_ctx.isPlaying }) },
    });
    /** @type {__VLS_StyleScopedClasses['player-cover']} */ ;
    /** @type {__VLS_StyleScopedClasses['playing']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "cover-ring" },
        ...{ class: ({ playing: __VLS_ctx.isPlaying }) },
    });
    /** @type {__VLS_StyleScopedClasses['cover-ring']} */ ;
    /** @type {__VLS_StyleScopedClasses['playing']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "player-song-info" },
    });
    /** @type {__VLS_StyleScopedClasses['player-song-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "player-song-name" },
    });
    /** @type {__VLS_StyleScopedClasses['player-song-name']} */ ;
    (__VLS_ctx.currentSong.name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "player-song-artist" },
    });
    /** @type {__VLS_StyleScopedClasses['player-song-artist']} */ ;
    (__VLS_ctx.currentSong.ar?.[0]?.name || '-未知');
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.currentSong))
                    return;
                __VLS_ctx.$emit('toggleLike', __VLS_ctx.currentSong);
                // @ts-ignore
                [seekTo, progressPercent, progressPercent, currentSong, currentSong, currentSong, currentSong, currentSong, isPlaying, isPlaying, $emit,];
            } },
        ...{ class: "like-btn" },
        ...{ class: ({ liked: __VLS_ctx.isLiked }) },
    });
    /** @type {__VLS_StyleScopedClasses['like-btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['liked']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: (__VLS_ctx.isLiked ? 'fas' : 'far') },
        ...{ class: "fa-heart" },
    });
    /** @type {__VLS_StyleScopedClasses['fa-heart']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "player-empty-info" },
    });
    /** @type {__VLS_StyleScopedClasses['player-empty-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "empty-icon-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-icon-wrap']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
        ...{ class: "fas fa-music" },
    });
    /** @type {__VLS_StyleScopedClasses['fas']} */ ;
    /** @type {__VLS_StyleScopedClasses['fa-music']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "empty-text" },
    });
    /** @type {__VLS_StyleScopedClasses['empty-text']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-center" },
});
/** @type {__VLS_StyleScopedClasses['player-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-controls" },
});
/** @type {__VLS_StyleScopedClasses['player-controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('prev');
            // @ts-ignore
            [$emit, isLiked, isLiked,];
        } },
    ...{ class: "control-btn skip-btn" },
    title: "上一首",
});
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['skip-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-step-backward" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-step-backward']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('togglePlay');
            // @ts-ignore
            [$emit,];
        } },
    ...{ class: "control-btn play-btn" },
    title: (__VLS_ctx.isPlaying ? '暂停' : '播放'),
});
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['play-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: (__VLS_ctx.isPlaying ? 'fas fa-pause' : 'fas fa-play') },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('next');
            // @ts-ignore
            [isPlaying, isPlaying, $emit,];
        } },
    ...{ class: "control-btn skip-btn" },
    title: "下一首",
});
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['skip-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-step-forward" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-step-forward']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-progress" },
});
/** @type {__VLS_StyleScopedClasses['player-progress']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "time" },
});
/** @type {__VLS_StyleScopedClasses['time']} */ ;
(__VLS_ctx.formatTime(__VLS_ctx.currentTime));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (__VLS_ctx.seekTo) },
    ...{ class: "progress-bar desktop-progress" },
    ref: "progressRef2",
});
/** @type {__VLS_StyleScopedClasses['progress-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['desktop-progress']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-fill" },
    ...{ style: ({ width: __VLS_ctx.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['progress-fill']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-thumb" },
    ...{ style: ({ left: __VLS_ctx.progressPercent + '%' }) },
});
/** @type {__VLS_StyleScopedClasses['progress-thumb']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "time" },
});
/** @type {__VLS_StyleScopedClasses['time']} */ ;
(__VLS_ctx.formatTime(__VLS_ctx.duration));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "player-right" },
});
/** @type {__VLS_StyleScopedClasses['player-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('toggleLyrics');
            // @ts-ignore
            [seekTo, progressPercent, progressPercent, $emit, formatTime, formatTime, currentTime, duration,];
        } },
    ...{ class: "control-btn lyric-btn" },
    title: "歌词",
});
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['lyric-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: "fas fa-microphone-alt" },
});
/** @type {__VLS_StyleScopedClasses['fas']} */ ;
/** @type {__VLS_StyleScopedClasses['fa-microphone-alt']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "volume-control" },
    title: (__VLS_ctx.isMobile ? '切换静音' : '调节音量'),
});
/** @type {__VLS_StyleScopedClasses['volume-control']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('toggleMute');
            // @ts-ignore
            [$emit, isMobile,];
        } },
    ...{ class: "control-btn" },
});
/** @type {__VLS_StyleScopedClasses['control-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.i, __VLS_intrinsics.i)({
    ...{ class: (__VLS_ctx.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up') },
});
if (!__VLS_ctx.isMobile) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (__VLS_ctx.setVolume) },
        ...{ class: "volume-bar" },
        ref: "volumeRef",
    });
    /** @type {__VLS_StyleScopedClasses['volume-bar']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "volume-fill" },
        ...{ style: ({ width: __VLS_ctx.volume + '%' }) },
    });
    /** @type {__VLS_StyleScopedClasses['volume-fill']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "volume-thumb" },
        ...{ style: ({ left: __VLS_ctx.volume + '%' }) },
    });
    /** @type {__VLS_StyleScopedClasses['volume-thumb']} */ ;
}
// @ts-ignore
[isMobile, isMuted, setVolume, volume, volume,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
//# sourceMappingURL=MusicPlayer.vue.js.map