<template>
  <div class="bg-container">
    <!-- 替换为您自己的图片URL -->
    <img src="https://gips2.baidu.com/it/u=641660390,3943119249&fm=3074&app=3074&f=PNG?w=2560&h=1440" alt="Background"
      class="ken-burns-img">
    <div class="overlay"></div>
  </div>

  <div class="content">
    <h1>探索自然之美</h1>
    <p>静态图片通过缓慢的缩放与平移，也能呈现出电影般的动态叙事感。</p>
  </div>
</template>

<script setup lang="ts">


</script>

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

/* 背景容器 */
.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

/* 动态图片层 */
.ken-burns-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 关键动画：20秒内从1.0倍放大到1.15倍，并轻微平移 */
  animation: kenBurns 20s ease-in-out infinite alternate;
}

/* 遮罩层：确保文字可读性 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  /* 半透明黑色遮罩 */
  z-index: 0;
}

@keyframes kenBurns {
  0% {
    transform: scale(1) translate(0, 0);
  }

  100% {
    transform: scale(1.15) translate(-2%, -2%);
  }
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