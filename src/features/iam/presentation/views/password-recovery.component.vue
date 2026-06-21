<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const email = ref('');
const emailSent = ref(false);

function sendRecoveryLink() {
  // Simulate sending recovery email (UI only for now)
  emailSent.value = true;
}

function returnToLogin() {
  router.push({ name: 'iam-sign-in' });
}

function resendEmail() {
  // Simulate resend
  emailSent.value = false;
  setTimeout(() => {
    emailSent.value = true;
  }, 500);
}
</script>

<template>
  <div class="recovery-page">
    <!-- Recovery Form Screen -->
    <main v-if="!emailSent" class="recovery-card el-glass-card el-shadow">
      <div class="card-content">
        <!-- Logo -->
        <div class="logo-icon">
          <i class="pi pi-bolt" style="font-size: 1.5rem; color: white"></i>
        </div>
        <h1 class="card-title">Recover Password</h1>
        <p class="card-subtitle">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <form @submit.prevent="sendRecoveryLink" class="recovery-form">
        <el-input-text
          id="recovery-email"
          v-model="email"
          label="Email Address"
          placeholder="name@company.com"
          type="email"
        />

        <pv-button
          type="submit"
          label="Send Recovery Link"
          class="w-full submit-btn"
          :disabled="!email"
        />
      </form>

      <div class="back-link-container">
        <a href="#" @click.prevent="returnToLogin" class="back-link">
          Back to Sign In
        </a>
      </div>
    </main>

    <!-- Success Screen -->
    <main v-else class="recovery-card el-glass-card el-shadow">
      <div class="success-content">
        <!-- Success Icon -->
        <div class="success-icon">
          <i class="pi pi-envelope" style="font-size: 2.5rem; color: #16a34a"></i>
        </div>
        <h1 class="card-title">Email Sent!</h1>
        <p class="success-message">
          We've sent a password recovery link to your email address.
          Please check your inbox and follow the instructions.
        </p>

        <pv-button
          label="Return to Login"
          outlined
          class="w-full return-btn"
          @click="returnToLogin"
        />

        <div class="resend-section">
          <p class="resend-text">
            Didn't receive the email?
            <a href="#" @click.prevent="resendEmail" class="resend-link">Click to resend</a>
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.recovery-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--el-bg-soft);
}

.recovery-card {
  max-width: 420px;
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
}

/* Shared */
.card-content,
.success-content {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--el-primary);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0 0 0.75rem;
}

.card-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

/* Form */
.recovery-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.submit-btn {
  font-weight: 600 !important;
}

.back-link-container {
  margin-top: 1.5rem;
  text-align: center;
}

.back-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--el-custom);
}

.back-link:hover {
  text-decoration: underline;
}

/* Success State */
.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background-color: #dcfce7;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.success-message {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.return-btn {
  font-weight: 600 !important;
}

.resend-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.resend-text {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.resend-link {
  color: var(--el-custom);
  font-weight: 500;
}

.resend-link:hover {
  text-decoration: underline;
}

/* Utilities */
.w-full {
  width: 100%;
}
</style>
