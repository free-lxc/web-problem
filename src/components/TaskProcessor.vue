<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// 任务状态枚举
const TaskStatus = {
  IDLE: '空闲',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  FAILED: '失败'
} as const;

// 状态管理
const status = ref<typeof TaskStatus[keyof typeof TaskStatus]>(TaskStatus.IDLE);
const logs = ref<string[]>([]);
const progress = ref<number>(0);
const totalFiles = ref<number>(0);
const loadedFiles = ref<number>(0);
const errorFiles = ref<number>(0);

// 添加日志
function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push(`[${timestamp}] ${message}`);
  // 自动滚动到底部
  setTimeout(() => {
    const logElement = document.getElementById('log-container');
    if (logElement) {
      logElement.scrollTop = logElement.scrollHeight;
    }
  }, 100);
}

// 加载配置文件
async function loadConfig(): Promise<string[]> {
  addLog('开始加载配置文件...');
  return new Promise((resolve, reject) => {
    // 模拟异步加载配置文件
    setTimeout(() => {
      // 模拟随机失败 (10% 失败率)
      if (Math.random() < 0.1) {
        addLog('配置文件加载失败!');
        reject(new Error('加载配置文件失败'));
      } else {
        // 生成10个文件名作为示例
        const files = Array.from({ length: 10 }, (_, i) => `file-${i + 1}.txt`);
        totalFiles.value = files.length;
        addLog(`配置文件加载成功，共 ${files.length} 个文件需要加载`);
        resolve(files);
      }
    }, 1000);
  });
}

// 加载单个文件 with 超时和重试
async function loadFileWithRetry(file: string, retryCount: number = 3, delay: number = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    // 超时控制
    const timeoutId = setTimeout(() => {
      addLog(`文件 ${file} 加载超时!`);
      if (retryCount > 0) {
        addLog(`文件 ${file} 准备重试，剩余重试次数: ${retryCount}`);
        // 指数退避策略
        setTimeout(() => {
          loadFileWithRetry(file, retryCount - 1, delay * 2)
            .then(resolve)
            .catch(reject);
        }, delay);
      } else {
        addLog(`文件 ${file} 加载失败，已达到最大重试次数`);
        errorFiles.value++;
        reject(new Error(`文件 ${file} 加载失败`));
      }
    }, 5000); // 5秒超时

    // 模拟文件加载
    setTimeout(() => {
      clearTimeout(timeoutId); // 清除超时计时器
      // 模拟90%成功率
      if (Math.random() < 0.9) {
        addLog(`文件 ${file} 加载成功`);
        loadedFiles.value++;
        progress.value = Math.round((loadedFiles.value / totalFiles.value) * 100);
        resolve();
      } else {
        addLog(`文件 ${file} 加载失败!`);
        if (retryCount > 0) {
          addLog(`文件 ${file} 准备重试，剩余重试次数: ${retryCount}`);
          // 指数退避策略
          setTimeout(() => {
            loadFileWithRetry(file, retryCount - 1, delay * 2)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          addLog(`文件 ${file} 加载失败，已达到最大重试次数`);
          errorFiles.value++;
          reject(new Error(`文件 ${file} 加载失败`));
        }
      }
    }, Math.random() * 2000 + 1000); // 1-3秒随机延迟
  });
}

// 并发控制加载文件
async function loadFiles(files: string[]): Promise<void> {
  addLog('开始加载文件...');
  const maxConcurrent = 3; // 最大并发数
  const fileChunks = [];

  // 分割文件列表为多个批次
  for (let i = 0; i < files.length; i += maxConcurrent) {
    fileChunks.push(files.slice(i, i + maxConcurrent));
  }

  // 逐批加载文件
  for (const chunk of fileChunks) {
    addLog(`开始加载批次: ${chunk.join(', ')}`);
    // 并行加载当前批次的文件
    await Promise.allSettled(chunk.map(file => loadFileWithRetry(file)));
    addLog(`批次加载完成: ${chunk.join(', ')}`);
  }

  addLog(`所有文件加载完成。成功: ${loadedFiles.value}, 失败: ${errorFiles.value}`);
}

// 初始化系统
async function initSystem(): Promise<void> {
  addLog('开始初始化系统...');
  return new Promise(resolve => {
    // 模拟系统初始化
    setTimeout(() => {
      addLog('系统初始化成功!');
      resolve();
    }, 1000);
  });
}

// 开始处理按钮点击事件
async function onStartBtnClick() {
  // 重置状态
  status.value = TaskStatus.PROCESSING;
  logs.value = [];
  progress.value = 0;
  loadedFiles.value = 0;
  errorFiles.value = 0;
  totalFiles.value = 0;

  addLog('开始任务处理...');

  try {
    // 步骤1: 加载配置
    const files = await loadConfig();

    // 步骤2: 加载文件
    await loadFiles(files);

    // 步骤3: 初始化系统
    await initSystem();

    // 完成所有步骤
    addLog('任务处理完成!');
    status.value = TaskStatus.COMPLETED;
  } catch (error) {
    addLog(`任务处理失败: ${error instanceof Error ? error.message : String(error)}`);
    status.value = TaskStatus.FAILED;
  }
}
</script>

<template>
  <div class="task-processor-container">
    <h2>异步任务处理器</h2>
    <p class="description">本程序演示一个具有并发控制、超时控制和重试机制的异步任务处理器。</p>

    <div class="controls">
      <button class="start-btn" @click="onStartBtnClick" :disabled="status === '处理中'">{{ status === '处理中' ? '处理中...' : '开始处理' }}</button>
      <span class="status-badge">{{ status }}</span>
      <div class="progress-container" v-if="status === '处理中'">
        <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>

    <div class="log-container" id="log-container">
      <div class="log-header">控制台输出:</div>
      <div v-for="(log, index) in logs" :key="index" class="log-entry">{{ log }}</div>
    </div>
  </div>
</template>

<style scoped>
.task-processor-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.start-btn {
  padding: 8px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.start-btn:hover:not(:disabled) {
  background-color: #3367d6;
}

.start-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-badge {
  padding: 5px 10px;
  background-color: #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
}

.progress-container {
  width: 200px;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #333;
}

.log-container {
  height: 300px;
  overflow-y: auto;
  background-color: #2d2d2d;
  color: #f8f8f8;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  font-size: 14px;
}

.log-header {
  font-weight: bold;
  margin-bottom: 10px;
  color: #bbb;
}

.log-entry {
  margin-bottom: 5px;
  line-height: 1.4;
}
</style>