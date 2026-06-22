<script setup>
import { ref } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();
const photos = ref([]);
const isUploading = ref(false);

async function uploadPhoto() {
    isUploading.value = true;
    try {
        const urlResponse = await store.currentExecution;//store.getUploadUrl(props.executionId);
        if (urlResponse) {
            photos.value.push({ url: urlResponse.publicUrl, preview: urlResponse.publicUrl });
        }
    } finally {
        isUploading.value = false;
    }
}
</script>

<template>
  <div class="photo-upload">
    <h4 class="photo-upload__title">Photos</h4>
    <div class="photo-upload__grid">
      <div v-for="(photo, i) in photos" :key="i" class="photo-upload__item">
        <img :src="photo.preview" alt="Photo" class="photo-upload__img" />
      </div>
      <div class="photo-upload__add" @click="uploadPhoto">
        <i class="pi pi-camera"></i>
        <span>{{ isUploading ? 'Uploading...' : 'Add Photo' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-upload__title { margin: 0 0 1rem; color: var(--el-primary); }
.photo-upload__grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.photo-upload__item { width: 120px; height: 120px; border-radius: 8px; overflow: hidden; }
.photo-upload__img { width: 100%; height: 100%; object-fit: cover; }
.photo-upload__add {
  width: 120px; height: 120px; border: 2px dashed rgba(169, 177, 186, 0.3);
  border-radius: 8px; display: flex; flex-direction: column; align-items: center;
  justify-content: center; cursor: pointer; color: var(--el-warm-gray); font-size: 0.8rem;
  transition: all 0.2s;
}
.photo-upload__add:hover { border-color: var(--el-primary); color: var(--el-primary); }
.photo-upload__add i { font-size: 1.5rem; margin-bottom: 0.25rem; }
</style>
