<script setup>
import SuggestionList from '../../components/suggestions/suggestion-list.component.vue';
import SuggestionBanner from '../../components/suggestions/suggestion-banner.component.vue';
</script>

<template>
  <div class="suggestions-page">
    <SuggestionBanner />
    <SuggestionList client-type="HOMEOWNER" />
  </div>
</template>
