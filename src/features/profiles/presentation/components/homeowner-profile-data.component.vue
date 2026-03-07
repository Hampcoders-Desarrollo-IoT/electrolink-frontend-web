<script setup>
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElSelect from '../../../../shared/presentation/components/el-select.vue';
import ElCheckbox from '../../../../shared/presentation/components/el-checkbox.vue';

const props = defineProps({
  preferredContactTime: Number,
  smsNotifications: Boolean,
  emailNotifications: Boolean,
  pushNotifications: Boolean,
  emergencyContact: {
    type: Object,
    default: () => ({
      name: '',
      relationship: '',
      phoneNumber: ''
    })
  }
});

const emit = defineEmits([
  'update:preferredContactTime',
  'update:smsNotifications',
  'update:emailNotifications',
  'update:pushNotifications',
  'update:emergencyContact'
]);

const contactTimeOptions = [
  { label: 'Morning (8AM - 12PM)', value: 0 },
  { label: 'Afternoon (12PM - 4PM)', value: 1 },
  { label: 'Evening (4PM - 8PM)', value: 2 },
  { label: 'Anytime', value: 3 }
];

const updateEmergencyContact = (field, value) => {
  emit('update:emergencyContact', {
    ...props.emergencyContact,
    [field]: value
  });
};
</script>

<template>
  <div class="homeowner-profile-data">
    <!-- Service Preferences -->
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-clock" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Service Preferences</h4>
      </div>
      <div class="group-content">
        <el-select
          :modelValue="preferredContactTime"
          @update:modelValue="emit('update:preferredContactTime', $event)"
          :options="contactTimeOptions"
          label="Preferred Contact Time"
          placeholder="Select a time slot"
        />
      </div>
    </div>

    <!-- Communication -->
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-bell" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Communication Channels</h4>
      </div>
      <div class="notification-grid">
        <el-checkbox
          :modelValue="smsNotifications"
          @update:modelValue="emit('update:smsNotifications', $event)"
          label="SMS"
          variant="card"
        />
        <el-checkbox
          :modelValue="emailNotifications"
          @update:modelValue="emit('update:emailNotifications', $event)"
          label="Email"
          variant="card"
        />
        <el-checkbox
          :modelValue="pushNotifications"
          @update:modelValue="emit('update:pushNotifications', $event)"
          label="Notifications"
          variant="card"
        />
      </div>
    </div>

    <!-- Emergency Support -->
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-shield" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Emergency Support</h4>
      </div>
      <div class="form-grid">
        <el-input-text
          :modelValue="emergencyContact.name"
          @update:modelValue="updateEmergencyContact('name', $event)"
          label="Full Name"
          placeholder="Contact's full name"
          class="col-span-full"
        />
        <el-input-text
          :modelValue="emergencyContact.relationship"
          @update:modelValue="updateEmergencyContact('relationship', $event)"
          label="Relationship"
          placeholder="e.g. Parent, Spouse"
        />
        <el-input-text
          :modelValue="emergencyContact.phoneNumber"
          @update:modelValue="updateEmergencyContact('phoneNumber', $event)"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          icon="pi pi-phone"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.homeowner-profile-data {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-group {
  background-color: #FEFFFE;
  border-radius: 12px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.group-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.notification-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .notification-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.col-span-full {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .col-span-full {
    grid-column: span 2;
  }
}
</style>
