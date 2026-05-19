<template>
  <header class="knowledge-header">
    <div class="knowledge-header-inner">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-code"></i>
        </div>
        <div>
          <h1>前端知识体系</h1>
          <p class="header-subtitle">Frontend Knowledge Framework</p>
        </div>
      </div>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-number">{{ totalItems }}</span>
          <span class="stat-label">知识点</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ categoryCount }}</span>
          <span class="stat-label">分类</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  defineProps<{
    totalItems: number
    categoryCount: number
  }>()
</script>

<style scoped>
  .knowledge-header {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 2rem 0;
  }

  .knowledge-header-inner {
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 3.5rem;
    height: 3.5rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  }

  .header-content h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin: 0;
  }

  .header-subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    margin: 0.25rem 0 0;
    letter-spacing: 0.05em;
  }

  .header-stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }

  .stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  @media (max-width: 768px) {
    .knowledge-header {
      padding: 1rem 1rem;
      flex-direction: column;
      align-items: flex-start;
    }
    .knowledge-header-inner{
      padding: 0 0.5rem;
    }
    .header-stats {
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>
