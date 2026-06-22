<script setup>
import { onMounted } from 'vue';
import { useServiceSuggestionStore } from '../../../application/service-suggestion.store.js';
import SuggestionCard from './suggestion-card.component.vue';

const props = defineProps({
    clientType: { type: String, default: '' }
});

const store = useServiceSuggestionStore();

onMounted(async () => {
    await store.fetchSuggestions(props.clientType);
});
</script>

<template>
  <div class="suggestion-list">
    <div class="suggestion-list__header">
      <h2 class="suggestion-list__title">Proactive Suggestions</h2>
      <pv-tag v-if="store.unreadCount" :value="`${store.unreadCount} new`" severity="warn" />
    </div>
    <div v-if="store.suggestions.length === 0" class="suggestion-list__empty">
      <i class="pi pi-check-circle suggestion-list__empty-icon"></i>
      <p>No suggestions at this time</p>
    </div>
    <div v-else class="suggestion-list__items">
      <SuggestionCard
        v-for="suggestion in store.criticalSuggestions"
        :key="suggestion.suggestionId"
        :suggestion="suggestion"
      />
      <SuggestionCard
        v-for="suggestion in store.suggestions.filter(s => s.severity !== 'critical' && s.severity !== 'high')"
        :key="suggestion.suggestionId"
        :suggestion="suggestion"
      />
    </div>
  </div>
</template>

<style scoped>
.suggestion-list__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
.suggestion-list__title { margin: 0; color: var(--el-primary); }
.suggestion-list__empty { text-align: center; padding: 3rem; color: var(--el-warm-gray); }
.suggestion-list__empty-icon { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
</style>
