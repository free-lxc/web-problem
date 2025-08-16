<script setup lang="ts">
import { ref } from 'vue';
import TaskProcessor from './components/TaskProcessor.vue';
import ColorMatrixGenerator from './components/ColorMatrixGenerator.vue';

// 功能切换状态
const activeFeature = ref<'matrix' | 'task'>('matrix');

// 切换功能
function toggleFeature() {
  activeFeature.value = activeFeature.value === 'matrix' ? 'task' : 'matrix';
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>功能展示平台</h1>
    </header>

    <div class="feature-toggle">
      <button
        class="toggle-btn" 
        :class="{ 'active': activeFeature === 'matrix' }"
        @click="toggleFeature"
      >
        随机颜色矩阵生成器
      </button>
      <button
        class="toggle-btn"
        :class="{ 'active': activeFeature === 'task' }"
        @click="toggleFeature"
      >
        异步任务处理器
      </button>
    </div>

    <main class="main-content">
      <div class="feature-container">
        <ColorMatrixGenerator v-if="activeFeature === 'matrix'" />
        <TaskProcessor v-else />
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #42b983;
  color: white;
  padding: 20px;
  text-align: center;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.feature-toggle {
  display: flex;
  justify-content: center;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #eee;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background-color: #ddd;
}

.toggle-btn.active {
  background-color: #42b983;
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.feature-container {
  width: 100%;
  max-width: 900px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  margin: 20px auto;
}
</style>
