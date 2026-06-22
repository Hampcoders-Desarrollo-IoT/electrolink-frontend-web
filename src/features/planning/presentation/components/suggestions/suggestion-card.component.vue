<script setup>
import { useServiceSuggestionStore } from '../../../application/service-suggestion.store.js';

const props = defineProps({
    suggestion: { type: Object, required: true }
});

const store = useServiceSuggestionStore();

const severityColors = { critical: 'danger', high: 'warn', medium: 'info', low: 'success' };

function getSeverity() {
    return severityColors[props.suggestion.severity] || 'info';
}

async function accept() {
    await store.acceptSuggestion(props.suggestion.suggestionId);
}

async function dismiss() {
    await store.dismissSuggestion(props.suggestion.suggestionId);
}
</script>

<template>
  <div :class="['suggestion-card', `suggestion-card--${suggestion.severity}`]" @mouseenter="store.markAsViewed(suggestion.suggestionId)">
    <div class="suggestion-card__header">
      <pv-tag :value="suggestion.severity" :severity="getSeverity()" />
      <span class="suggestion-card__date">{{ suggestion.createdAt ? new Date(suggestion.createdAt).toLocaleDateString() : '' }}</span>
    </div>
    <h4 class="suggestion-card__title">{{ suggestion.title }}</h4>
    <p class="suggestion-card__desc">{{ suggestion.description }}</p>
    <div class="suggestion-card__actions">
      <el-button label="Accept" icon="pi pi-check" @click="accept" />
      <el-button label="Dismiss" icon="pi pi-times" variant="text" @click="dismiss" />
    </div>
  </div>
</template>

<style scoped>
.suggestion-card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-left: 4px solid; border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;
}
.suggestion-card--critical { border-left-color: var(--el-danger, #ef4444); }
.suggestion-card--high { border-left-color: var(--el-warning, #f59e0b); }
.suggestion-card--medium { border-left-color: var(--el-info, #3b82f6); }
.suggestion-card--low { border-left-color: var(--el-success, #10b981); }
.suggestion-card__header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.suggestion-card__date { font-size: 0.75rem; color: var(--el-warm-gray); margin-left: auto; }
.suggestion-card__title { margin: 0 0 0.5rem; font-size: 1rem; color: var(--el-primary); }
.suggestion-card__desc { font-size: 0.85rem; color: var(--el-warm-gray); margin: 0 0 1rem; }
.suggestion-card__actions { display: flex; gap: 0.5rem; }
</style>
