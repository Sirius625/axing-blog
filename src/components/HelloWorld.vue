<template>
  <div class="content">
    <h1>探索自然之美</h1>
    <p>静态图片通过缓慢的缩放与平移，也能呈现出电影般的动态叙事感。</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  body,
  html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: 'Segoe UI', sans-serif;
  }

  /* 内容样式 */
  .content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.5rem;
    max-width: 600px;
    line-height: 1.6;
  }
</style>
