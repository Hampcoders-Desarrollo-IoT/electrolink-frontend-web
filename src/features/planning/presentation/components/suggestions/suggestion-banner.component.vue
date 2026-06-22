<script setup>
import { useServiceSuggestionStore } from '../../../application/service-suggestion.store.js';

const store = useServiceSuggestionStore();

async function accept(suggestion) {
    await store.acceptSuggestion(suggestion.suggestionId);
}

async function dismiss(suggestion) {
    await store.dismissSuggestion(suggestion.suggestionId);
}
</script>

<template>
  <div v-if="store.criticalSuggestions.length" class="suggestion-banner">
    <div v-for="suggestion in store.criticalSuggestions.slice(0, 1)" :key="suggestion.suggestionId" class="suggestion-banner__content">
      <i class="pi pi-exclamation-triangle suggestion-banner__icon"></i>
      <div class="suggestion-banner__text">
        <strong>{{ suggestion.title }}</strong>
        <p>{{ suggestion.description }}</p>
      </div>
      <div class="suggestion-banner__actions">
        <el-button label="Accept" icon="pi pi-check" @click="accept(suggestion)" />
        <el-button label="Dismiss" icon="pi pi-times" variant="text" @click="dismiss(suggestion)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.suggestion-banner {
  background: linear-gradient(135deg, #fef2f2, #fff);
  border: 1px solid #fecaca;
  border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 1rem;
}
.suggestion-banner__content { display: flex; align-items: center; gap: 1rem; }
.suggestion-banner__icon { font-size: 1.5rem; color: var(--el-danger); flex-shrink: 0; }
.suggestion-banner__text { flex: 1; }
.suggestion-banner__text strong { font-size: 0.9rem; color: var(--el-primary); display: block; }
.suggestion-banner__text p { font-size: 0.8rem; color: var(--el-warm-gray); margin: 0.25rem 0 0; }
.suggestion-banner__actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
</style>
