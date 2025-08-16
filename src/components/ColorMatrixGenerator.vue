<script setup lang="ts">
import { ref } from 'vue';

// 定义五种颜色
const colors = [
  { name: '红色', value: '#FF0000' },
  { name: '绿色', value: '#00FF00' },
  { name: '蓝色', value: '#0000FF' },
  { name: '黄色', value: '#FFFF00' },
  { name: '橙色', value: '#FFA500' },
];

// 定义输入参数的默认值
const xValue = ref<number>(10);
const yValue = ref<number>(10);
const zValue = ref<number>(20);

// 定义矩阵数据
const matrix = ref<Array<Array<{ name: string; value: string }>>>([]);

// 生成随机颜色矩阵
function generateMatrix() {
  const newMatrix: Array<Array<{ name: string; value: string }>> = [];

  for (let m = 0; m < 10; m++) {
    newMatrix[m] = [];
    for (let n = 0; n < 10; n++) {
      if (m === 0 && n === 0) {
        // (0,0) 点随机选择颜色
        const randomIndex = Math.floor(Math.random() * colors.length);
        newMatrix[m][n] = colors[randomIndex];
      } else {
        // 计算其他点的颜色
        let probabilities = [...Array(colors.length)].map(() => 1 / 5); // 基准概率 1/5

        // 获取上方点 (m-1, n) 和左方点 (m, n-1)
        const topColor = m > 0 ? newMatrix[m - 1][n] : null;
        const leftColor = n > 0 ? newMatrix[m][n - 1] : null;

        // 应用概率规则
        if (topColor) {
          const topIndex = colors.findIndex(
            (color) => color.value === topColor.value
          );
          probabilities[topIndex] += xValue.value / 100;
        }

        if (leftColor) {
          const leftIndex = colors.findIndex(
            (color) => color.value === leftColor.value
          );
          probabilities[leftIndex] += yValue.value / 100;
        }

        // 如果上方点和左方点颜色相同，增加该颜色的概率
        if (topColor && leftColor && topColor.value === leftColor.value) {
          const sameIndex = colors.findIndex(
            (color) => color.value === topColor.value
          );
          probabilities[sameIndex] += zValue.value / 100;
        }

        // 归一化概率
        const sum = probabilities.reduce((acc, prob) => acc + prob, 0);
        const normalizedProbabilities = probabilities.map((prob) => prob / sum);

        // 根据概率选择颜色
        let random = Math.random();
        let selectedIndex = 0;
        while (random > normalizedProbabilities[selectedIndex]) {
          random -= normalizedProbabilities[selectedIndex];
          selectedIndex++;
        }

        newMatrix[m][n] = colors[selectedIndex];
      }
    }
  }

  matrix.value = newMatrix;
}

// 初始生成矩阵
generateMatrix();
</script>

<template>
  <div class="color-matrix-generator">
    <h2>随机颜色矩阵生成器</h2>
    <p class="description">
      本程序生成一个10×10的随机颜色矩阵，颜色选择基于概率规则。
    </p>

    <div class="color-palette">
      <span class="color-label">颜色:</span>
      <div
        v-for="color in colors"
        :key="color.name"
        class="color-swatch"
        :style="{ backgroundColor: color.value }"
        :title="color.name"
      ></div>
    </div>

    <div class="controls">
      <div class="input-group">
        <label for="xValue">X值 (%):</label>
        <input
          type="number"
          id="xValue"
          v-model.number="xValue"
          min="0"
          max="100"
        />
      </div>
      <div class="input-group">
        <label for="yValue">Y值 (%):</label>
        <input
          type="number"
          id="yValue"
          v-model.number="yValue"
          min="0"
          max="100"
        />
      </div>
      <div class="input-group">
        <label for="zValue">Z值 (%):</label>
        <input
          type="number"
          id="zValue"
          v-model.number="zValue"
          min="0"
          max="100"
        />
      </div>
      <button class="generate-btn" @click="generateMatrix">生成矩阵</button>
    </div>

    <div class="matrix-container">
      <div class="matrix">
        <div v-for="(row, m) in matrix" :key="m" class="matrix-row">
          <div
            v-for="(cell, n) in row"
            :key="n"
            class="matrix-cell"
            :style="{ backgroundColor: cell.value }"
            :title="`(${m},${n}): ${cell.name}`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-matrix-generator {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  color: #333;
  margin-top: 0;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.color-palette {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.color-label {
  margin-right: 10px;
  color: #333;
}

.color-swatch {
  width: 30px;
  height: 30px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group label {
  margin-bottom: 5px;
  color: #333;
}

.input-group input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.generate-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  align-self: flex-end;
}

.generate-btn:hover {
  background-color: #3aa876;
}

.matrix-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.matrix {
  display: inline-block;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.matrix-row {
  display: flex;
}

.matrix-cell {
  width: 25px;
  height: 25px;
  border: 0.5px solid #eee;
  box-sizing: border-box;
}
</style>