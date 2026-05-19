<template>
  <div class="blog-app">
    <!-- 顶部标题区 -->
    <div class="blog-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fa-solid fa-pen-fancy"></i>
            我的博客
          </h1>
          <p class="page-subtitle">记录思考，分享知识</p>
        </div>
        <div class="header-right">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalItems }}</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ categories.length }}</span>
              <span class="stat-label">分类</span>
            </div>
          </div>
          <button v-if="authStore.isLoggedIn" class="write-btn" @click="openEditor()">
            <i class="fa-solid fa-plus"></i>
            写文章
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索与筛选 -->
    <div class="blog-toolbar">
      <div class="toolbar-inner">
        <div class="search-box">
          <i class="fa-solid fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="search-input"
            @input="onSearch"
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="category-tabs">
          <button
            :class="['category-tab', { active: activeCategory === 'all' }]"
            @click="activeCategory = 'all'"
          >
            <i class="fa-solid fa-layer-group"></i>
            全部
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['category-tab', { active: activeCategory === cat }]"
            @click="activeCategory = cat"
          >
            <i class="fa-solid fa-folder"></i>
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="blog-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 文章网格 -->
      <div v-else-if="articles.length > 0" class="article-grid">
        <article
          v-for="article in articles"
          :key="article.id"
          class="article-card"
          @click="openDetail(article)"
        >
          <div class="card-header">
            <span class="card-category">
              <i class="fa-solid fa-folder-open"></i>
              {{ article.category }}
            </span>
            <span class="card-date">{{ formatDate(article.created_at) }}</span>
          </div>
          <h3 class="card-title">{{ article.title }}</h3>
          <p class="card-summary">{{ article.summary || '暂无摘要' }}</p>
          <div class="card-tags" v-if="article.tags && article.tags.length">
            <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="card-tag">
              <i class="fa-solid fa-tag"></i>
              {{ tag }}
            </span>
          </div>
          <div class="card-footer">
            <div class="card-author">
              <i class="fa-solid fa-user"></i>
              {{ article.author }}
            </div>
            <div class="card-meta">
              <span><i class="fa-regular fa-eye"></i> {{ article.views }}</span>
              <span><i class="fa-regular fa-thumbs-up"></i> {{ article.likes }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <i class="fa-solid fa-newspaper"></i>
        <h3>{{ searchQuery || activeCategory !== 'all' ? '未找到相关文章' : '还没有文章' }}</h3>
        <p>
          {{
            searchQuery || activeCategory !== 'all'
              ? '尝试更换关键词或分类'
              : '点击上方按钮写第一篇文章吧'
          }}
        </p>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage <= 1" @click="currentPage--" class="page-btn">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage >= totalPages" @click="currentPage++" class="page-btn">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 文章详情弹窗 -->
    <Teleport to="body">
      <div v-if="detailArticle" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-container modal-detail">
          <div class="modal-header">
            <h2>{{ detailArticle.title }}</h2>
            <button class="close-btn" @click="closeDetail">&times;</button>
          </div>
          <div class="modal-body detail-body">
            <div class="detail-meta">
              <span><i class="fa-solid fa-user"></i> {{ detailArticle.author }}</span>
              <span
                ><i class="fa-regular fa-calendar"></i>
                {{ formatDate(detailArticle.created_at) }}</span
              >
              <span><i class="fa-regular fa-eye"></i> {{ detailArticle.views }}</span>
              <span><i class="fa-regular fa-thumbs-up"></i> {{ detailArticle.likes }}</span>
              <span class="detail-category"
                ><i class="fa-solid fa-folder"></i> {{ detailArticle.category }}</span
              >
            </div>
            <div class="detail-tags" v-if="detailArticle.tags && detailArticle.tags.length">
              <span v-for="tag in detailArticle.tags" :key="tag" class="detail-tag">{{ tag }}</span>
            </div>
            <div
              class="detail-content markdown-body"
              v-html="renderContent(detailArticle.content)"
            ></div>
            <div class="detail-actions">
              <button class="action-btn like-btn" @click="handleLike(detailArticle.id)">
                <i class="fa-regular fa-thumbs-up"></i>
                点赞 {{ detailArticle.likes }}
              </button>
              <button
                v-if="authStore.isLoggedIn && currentUsername === detailArticle.author"
                class="action-btn delete-btn"
                @click="handleDelete(detailArticle.id)"
              >
                <i class="fa-regular fa-trash-can"></i>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 文章编辑器弹窗 -->
    <Teleport to="body">
      <div v-if="showEditor" class="modal-overlay" @click.self="closeEditor">
        <div class="modal-container modal-editor">
          <div class="modal-header">
            <h2>{{ editingArticle ? '编辑文章' : '写文章' }}</h2>
            <button class="close-btn" @click="closeEditor">&times;</button>
          </div>
          <div class="modal-body editor-body">
            <div class="editor-form">
              <div class="form-row">
                <div class="form-group flex-1">
                  <label>文章标题 <span class="required">*</span></label>
                  <input
                    v-model="editorForm.title"
                    type="text"
                    placeholder="请输入文章标题"
                    class="form-input"
                  />
                </div>
                <div class="form-group" style="width: 160px">
                  <label>分类 <span class="required">*</span></label>
                  <select v-model="editorForm.category" class="form-input">
                    <option value="">选择分类</option>
                    <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>摘要</label>
                <textarea
                  v-model="editorForm.summary"
                  placeholder="文章摘要（可选）"
                  class="form-input form-textarea"
                  rows="2"
                ></textarea>
              </div>
              <div class="form-group">
                <label>标签（逗号分隔）</label>
                <input
                  v-model="editorTags"
                  type="text"
                  placeholder="例如: Vue, TypeScript, 前端"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>文章内容 <span class="required">*</span></label>
                <div class="editor-tabs">
                  <button
                    :class="['editor-tab', { active: editorTab === 'write' }]"
                    @click="editorTab = 'write'"
                  >
                    <i class="fa-solid fa-pen"></i> 编辑
                  </button>
                  <button
                    :class="['editor-tab', { active: editorTab === 'preview' }]"
                    @click="editorTab = 'preview'"
                  >
                    <i class="fa-solid fa-eye"></i> 预览
                  </button>
                </div>
                <div class="textarea-wrapper" v-if="editorTab === 'write'">
                  <textarea
                    v-model="editorForm.content"
                    placeholder="支持 Markdown 语法&#10;&#10;# 标题&#10;## 二级标题&#10;**粗体** *斜体*&#10;- 列表项&#10;1. 有序列表&#10;`代码`&#10;```代码块```"
                    class="form-input editor-textarea"
                    maxlength="2000"
                  ></textarea>
                  <span class="word-count" :class="{ 'word-limit': editorForm.content.length >= 2000 }">
                    {{ editorForm.content.length }}/2000
                  </span>
                </div>
                <div
                  v-else
                  class="preview-area markdown-body"
                  v-html="renderContent(editorForm.content)"
                ></div>
              </div>
            </div>
            <div class="editor-footer">
              <button class="cancel-btn" @click="closeEditor">取消</button>
              <button
                class="submit-btn"
                :disabled="!editorForm.title || !editorForm.content"
                @click="submitArticle"
              >
                <i class="fa-solid fa-paper-plane"></i>
                {{ editingArticle ? '更新' : '发布' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  import { useAuthStore } from '@/store'
  import {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    getArticleCategories,
    type Article
  } from '@/api/http1'
  import { useMessage } from '@/composables/useMessage'
  const msg = useMessage()

  const authStore = useAuthStore()

  // ===== 状态 =====
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const activeCategory = ref<string>('all')
  const currentPage = ref(1)
  const pageSize = 20
  const totalItems = ref(0)
  const categories = ref<string[]>([])
  const allCategories = ref<string[]>(['技术', '生活', '随笔', '教程', '笔记', '其他'])

  // 详情
  const detailArticle = ref<Article | null>(null)

  // 编辑器
  const showEditor = ref(false)
  const editingArticle = ref<Article | null>(null)
  const editorTab = ref<'write' | 'preview'>('write')
  const editorForm = ref({
    title: '',
    content: '',
    summary: '',
    category: ''
  })
  const editorTags = ref('')

  // ===== 计算属性 =====
  const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))
  const currentUsername = computed(() => {
    // 优先使用 localStorage 中的 username（登录时存储的原始用户名）
    // 其次使用 authStore.user?.name
    return localStorage.getItem('username') || authStore.user?.name || ''
  })

  // ===== 方法 =====
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const renderContent = (content: string) => {
    if (!content) return ''
    // 简单的 Markdown 渲染
    let html = content
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // 标题
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // 粗体和斜体
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 链接
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 无序列表
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // 有序列表
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // 换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')

    return `<p>${html}</p>`
  }

  const fetchArticles = async () => {
    loading.value = true
    try {
      const result = await getArticles({
        page: currentPage.value,
        pageSize,
        category: activeCategory.value === 'all' ? '' : activeCategory.value,
        keyword: searchQuery.value
      })
      articles.value = result?.data || []
      totalItems.value = result?.total || 0
    } catch (err) {
      console.error('获取文章失败:', err)
      articles.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const cats = await getArticleCategories()
      if (cats && cats.length > 0) {
        categories.value = cats
        // 合并到所有分类中
        const merged = new Set([...allCategories.value, ...cats])
        allCategories.value = Array.from(merged)
      }
    } catch (err) {
      console.error('获取分类失败:', err)
    }
  }

  let searchTimer: ReturnType<typeof setTimeout> | null = null
  const onSearch = () => {
    if (searchTimer) clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      currentPage.value = 1
      fetchArticles()
    }, 300)
  }

  // 监听筛选条件变化
  watch([activeCategory, currentPage], () => {
    fetchArticles()
  })

  // 文章详情
  const openDetail = async (article: Article) => {
    try {
      const detail = await getArticle(article.id)
      if (detail) {
        detailArticle.value = detail
        document.body.style.overflow = 'hidden'
        document.body.style.touchAction = 'none'
      }
    } catch (err) {
      console.error('获取文章详情失败:', err)
    }
  }

  const closeDetail = () => {
    detailArticle.value = null
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }

  // 点赞
  const handleLike = async (id: number) => {
    try {
      await likeArticle(id)
      if (detailArticle.value) {
        detailArticle.value.likes++
      }
      msg.success('点赞成功')
    } catch (err) {
      console.error('点赞失败:', err)
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    console.log('准备删除文章 ID:', id)
    try {
      const confirmed = await msg.confirm({
        title: '确认删除',
        message: '确定要删除这篇文章吗？此操作不可恢复。',
        type: 'warning',
        confirmText: '确定删除',
        cancelText: '取消'
      })
      if (!confirmed) return
      const result = await deleteArticle(id)
      if (result && (result as any).success) {
        msg.success('删除成功')
        closeDetail()
        fetchArticles()
        fetchCategories()
      } else {
        msg.error((result as any)?.message || '删除失败，请稍后重试')
      }
    } catch (err: any) {
      console.error('删除失败:', err)
      const errMsg = err?.response?.data?.message || err?.message || '删除失败，请稍后重试'
      msg.error(errMsg)
    }
  }

  // 编辑器
  const openEditor = (article?: Article) => {
    if (article) {
      editingArticle.value = article
      editorForm.value = {
        title: article.title,
        content: article.content,
        summary: article.summary || '',
        category: article.category
      }
      editorTags.value = (article.tags || []).join(', ')
    } else {
      editingArticle.value = null
      editorForm.value = {
        title: '',
        content: '',
        summary: '',
        category: ''
      }
      editorTags.value = ''
    }
    editorTab.value = 'write'
    showEditor.value = true
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  }

  const closeEditor = () => {
    showEditor.value = false
    editingArticle.value = null
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }

  const submitArticle = async () => {
    if (!editorForm.value.title.trim() || !editorForm.value.content.trim()) {
      msg.warning('请填写标题和内容')
      return
    }

    const tags = editorTags.value
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean)

    const data = {
      title: editorForm.value.title,
      content: editorForm.value.content,
      summary: editorForm.value.summary,
      category: editorForm.value.category || '未分类',
      tags
    }

    try {
      if (editingArticle.value) {
        await updateArticle(editingArticle.value.id, data)
        msg.success('文章更新成功')
      } else {
        await createArticle(data)
        msg.success('文章发布成功')
      }
      closeEditor()
      fetchArticles()
      fetchCategories()
    } catch (err) {
      console.error('保存文章失败:', err)
    }
  }

  // ===== 初始化 =====
  onMounted(() => {
    fetchArticles()
    fetchCategories()
  })
</script>

<style scoped>
  /* ===== 全局 ===== */
  .blog-app {
    min-height: 100vh;
    background: #f5f5f7;
    color: #374151;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    padding-bottom: 0;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* ===== 头部 ===== */
  .blog-header {
    background: #ffffff;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid #e5e7eb;
    padding: 2rem 0;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .page-title i {
    color: #a78bfa;
  }

  .page-subtitle {
    margin: 0.25rem 0 0;
    color: #6b7280;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .write-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .write-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  /* ===== 工具栏 ===== */
  .blog-toolbar {
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 64px;
    z-index: 30;
    backdrop-filter: blur(10px);
  }

  .toolbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
  }

  .search-box {
    position: relative;
    max-width: 400px;
    margin-bottom: 1rem;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 0.9rem;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    color: #374151;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;
  }

  .search-input:focus {
    border-color: rgba(99, 102, 241, 0.5);
    background: #ffffff;
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .clear-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 0.85rem;
  }

  .clear-btn:hover {
    color: #d1d5db;
  }

  .category-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .category-tab {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 2rem;
    color: #6b7280;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .category-tab:hover {
    background: #e5e7eb;
    color: #374151;
  }

  .category-tab.active {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: #ffffff;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  /* ===== 文章列表 ===== */
  .blog-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
  }

  .article-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .article-card:hover {
    background: #f9fafb;
    border-color: #6366f1;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .card-category {
    font-size: 0.8rem;
    color: #818cf8;
    background: rgba(99, 102, 241, 0.1);
    padding: 3px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-date {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .card-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #000000;
    margin: 0 0 0.5rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-summary {
    font-size: 0.9rem;
    color: #9ca3af;
    line-height: 1.5;
    margin: 0 0 0.75rem;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  .card-tag {
    font-size: 0.75rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid #e5e7eb;
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .card-author i,
  .card-meta i {
    margin-right: 4px;
  }

  .card-meta {
    display: flex;
    gap: 12px;
  }

  /* ===== 加载状态 ===== */
  .loading-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(99, 102, 241, 0.2);
    border-top-color: #818cf8;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ===== 空状态 ===== */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #9ca3af;
  }

  .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
  }

  .empty-state h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #9ca3af;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.9rem;
  }

  /* ===== 分页 ===== */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
  }

  .page-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-btn:hover:not(:disabled) {
    background: #f3f4f6;
    color: #374151;
  }

  .page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .page-info {
    font-size: 0.9rem;
    color: #9ca3af;
  }

  /* ===== 弹窗通用 ===== */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
    touch-action: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-container {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    animation: slideUp 0.25s ease;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #1f2937;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .close-btn:hover {
    color: #374151;
    background: #f3f4f6;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  /* ===== 详情弹窗 ===== */
  .modal-detail {
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
  }

  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
    color: #9ca3af;
    margin-bottom: 1rem;
  }

  .detail-meta i {
    margin-right: 4px;
  }

  .detail-category {
    color: #a78bfa;
  }

  .detail-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }

  .detail-tag {
    font-size: 0.8rem;
    color: #a78bfa;
    background: rgba(99, 102, 241, 0.1);
    padding: 3px 10px;
    border-radius: 6px;
  }

  .detail-content {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #374151;
  }

  .detail-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #6b7280;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: #f9fafb;
    color: #374151;
  }

  .like-btn:hover {
    color: #ef4444;
    border-color: rgba(248, 113, 113, 0.3);
  }

  .delete-btn:hover {
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }

  /* ===== 编辑器弹窗 ===== */
  .modal-editor {
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
  }

  .editor-body {
    padding: 1.25rem 1.5rem;
  }

  .editor-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .flex-1 {
    flex: 1;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
  }

  .required {
    color: #ef4444;
  }

  .form-input {
    padding: 10px 12px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #374151;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.2s ease;
    font-family: inherit;
    box-sizing: border-box;
    width: 100%;
  }

  .form-input:focus {
    border-color: rgba(99, 102, 241, 0.4);
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .form-input::placeholder {
    color: #9ca3af;
  }

  .form-textarea {
    resize: vertical;
    min-height: 50px;
  }

  .textarea-wrapper {
    position: relative;
    padding-bottom: 2rem;
  }

  .editor-textarea {
    min-height: 350px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    line-height: 1.6;
    font-size: 0.9rem;
    resize: vertical;
  }

  .word-count {
    position: absolute;
    bottom: 0.25rem;
    right: 0.75rem;
    font-size: 0.75rem;
    color: #9ca3af;
    pointer-events: none;
    background: #ffffff;
    padding: 2px 8px;
    border-radius: 4px;
    z-index: 1;
  }

  .word-count.word-limit {
    color: #ef4444;
  }

  .editor-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 4px;
  }

  .editor-tab {
    padding: 6px 14px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #6b7280;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .editor-tab.active {
    background: #6366f1;
    border-color: #6366f1;
    color: #ffffff;
  }

  .preview-area {
    min-height: 350px;
    padding: 1rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9rem;
    line-height: 1.7;
    color: #374151;
    overflow-y: auto;
  }

  .editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .cancel-btn {
    padding: 8px 20px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    color: #6b7280;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .cancel-btn:hover {
    background: #f9fafb;
    color: #374151;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 24px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  }

  .submit-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ===== Markdown 内容样式 ===== */
  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3 {
    color: #1f2937;
    margin: 1.5rem 0 0.75rem;
  }

  .markdown-body h1 {
    font-size: 1.5rem;
  }
  .markdown-body h2 {
    font-size: 1.3rem;
  }
  .markdown-body h3 {
    font-size: 1.1rem;
  }

  .markdown-body p {
    margin: 0 0 0.75rem;
  }

  .markdown-body code {
    background: rgba(99, 102, 241, 0.1);
    color: #a78bfa;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.85em;
    font-family: 'Consolas', 'Monaco', monospace;
  }

  .markdown-body pre {
    background: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    overflow-x: auto;
    margin: 0.75rem 0;
  }

  .markdown-body pre code {
    background: none;
    color: #374151;
    padding: 0;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .markdown-body a {
    color: #6366f1;
    text-decoration: none;
  }

  .markdown-body a:hover {
    text-decoration: underline;
  }

  .markdown-body li {
    margin: 0.25rem 0;
    color: #374151;
  }

  .markdown-body strong {
    color: #1f2937;
  }

  .markdown-body em {
    color: #6b7280;
  }

  /* ===== 响应式 ===== */
  @media (max-width: 768px) {
    .blog-toolbar {
      top: 56px;
    }

    .header-content {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }

    .header-right {
      width: 100%;
      justify-content: space-between;
    }

    .article-grid {
      grid-template-columns: 1fr;
    }

    .blog-content {
      padding: 1rem;
    }

    .toolbar-inner {
      padding: 0.75rem 1rem;
    }

    .modal-editor,
    .modal-detail {
      width: 95%;
      max-height: 95vh;
    }

    .form-row {
      flex-direction: column;
    }

    .form-group[style*='width: 160px'] {
      width: 100% !important;
    }

    .stats {
      gap: 0.75rem;
    }

    .stat-value {
      font-size: 1rem;
    }
  }
</style>
