<script setup>
import { useRouter } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { reactive, ref } from "vue";
import { SignUpCommand } from "../../domain/commands/sign-up.command.js";

const router = useRouter();
const store = useIamStore();
const { signUp } = store;

const selectedRole = ref('owner');
const acceptTerms = ref(false);

const form = reactive({
  email: '',
  password: '',
  passwordConfirmation: ''
});

function performSignUp() {
  const signUpCommand = new SignUpCommand(form);
  signUp(signUpCommand, selectedRole.value, router);
}

function goToSignIn() {
  router.push({ name: 'iam-sign-in' });
}
</script>

<template>
  <div class="register-page">
    <!-- Register Card -->
    <main class="register-container">
      <div class="register-card el-glass-card">
        <!-- Brand Header -->
        <header class="brand-header">
          <h1 class="brand-title">
            <i class="pi pi-bolt" style="color: var(--el-custom); font-size: 1.5rem"></i>
            ElectroLink
          </h1>
          <p class="brand-subtitle">Join the network of professional energy solutions</p>
        </header>

        <!-- Registration Form -->
        <form @submit.prevent="performSignUp" class="register-form">
          <!-- Role Selection -->
          <div class="field">
            <label class="field-label">Select your role</label>
            <div class="role-grid">
              <!-- Homeowner Option -->
              <label class="role-option" :class="{ 'role-active': selectedRole === 'owner' }">
                <pv-radio-button
                  v-model="selectedRole"
                  inputId="role-owner"
                  value="owner"
                  class="role-radio-hidden"
                />
                <i class="pi pi-home" style="font-size: 1.25rem; margin-bottom: 0.25rem"></i>
                <span class="role-label">Homeowner</span>
              </label>

              <!-- Technician Option -->
              <label class="role-option" :class="{ 'role-active': selectedRole === 'technician' }">
                <pv-radio-button
                  v-model="selectedRole"
                  inputId="role-technician"
                  value="technician"
                  class="role-radio-hidden"
                />
                <i class="pi pi-wrench" style="font-size: 1.25rem; margin-bottom: 0.25rem"></i>
                <span class="role-label">Technician</span>
              </label>
            </div>
          </div>

          <!-- Email Field -->
          <div class="field">
            <label class="field-label" for="reg-email">Email Address</label>
            <pv-input-text
              id="reg-email"
              v-model="form.email"
              placeholder="name@example.com"
              type="email"
              class="w-full"
            />
          </div>

          <!-- Password Field -->
          <div class="field">
            <label class="field-label" for="reg-password">Password</label>
            <pv-password
              id="reg-password"
              v-model="form.password"
              placeholder="••••••••"
              toggleMask
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <!-- Confirm Password Field -->
          <div class="field">
            <label class="field-label" for="reg-confirm">Confirm Password</label>
            <pv-password
              id="reg-confirm"
              v-model="form.passwordConfirmation"
              placeholder="••••••••"
              :feedback="false"
              toggleMask
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <!-- Terms and Conditions -->
          <div class="terms-row">
            <pv-checkbox
              v-model="acceptTerms"
              :binary="true"
              inputId="terms"
            />
            <label for="terms" class="terms-label">
              I agree to the
              <a href="#" class="terms-link">Terms of Service</a>
              and
              <a href="#" class="terms-link">Privacy Policy</a>.
            </label>
          </div>

          <!-- Submit Button -->
          <pv-button
            type="submit"
            label="Create Account"
            class="submit-btn w-full"
            :disabled="!form.email || !form.password || !form.passwordConfirmation || !acceptTerms"
          />
        </form>

        <!-- Footer -->
        <footer class="card-footer">
          <p class="footer-text">
            Already have an account?
            <a href="#" @click.prevent="goToSignIn" class="footer-link">Sign in</a>
          </p>
        </footer>
      </div>

      <!-- Security Badge -->
      <div class="security-badges">
        <span class="badge-item">
          <i class="pi pi-lock"></i>
          Secure SSL
        </span>
        <span class="badge-separator">•</span>
        <span class="badge-item">24/7 Support</span>
      </div>
    </main>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: var(--el-bg-soft);
}

.register-container {
  width: 100%;
  max-width: 28rem;
}

.register-card {
  padding: 2rem;
}

@media (min-width: 768px) {
  .register-card {
    padding: 2.5rem;
  }
}

/* Brand Header */
.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem;
}

.brand-subtitle {
  color: var(--el-warm-gray);
  font-size: 0.875rem;
  margin: 0;
}

/* Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
}

/* Role Selection */
.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 2px solid var(--el-celeste);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--el-primary);
  font-weight: 500;
}

.role-option:hover {
  border-color: var(--el-custom);
}

.role-active {
  border-color: var(--el-custom);
  background-color: #f0f7ff;
  color: var(--el-custom);
  box-shadow: 0 0 0 1px var(--el-custom);
}

.role-radio-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.role-label {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Terms */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.terms-label {
  font-size: 0.875rem;
  color: var(--el-warm-gray);
  line-height: 1.4;
}

.terms-link {
  color: var(--el-custom);
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Submit Button */
.submit-btn {
  padding-top: 0.75rem !important;
  padding-bottom: 0.75rem !important;
  font-weight: 700 !important;
}

/* Footer */
.card-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(181, 213, 245, 0.5);
  text-align: center;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--el-warm-gray);
  margin: 0;
}

.footer-link {
  color: var(--el-primary);
  font-weight: 600;
}

.footer-link:hover {
  text-decoration: underline;
}

/* Security Badges */
.security-badges {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: var(--el-warm-gray);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.badge-separator {
  color: var(--el-warm-gray);
}

/* Utilities */
.w-full {
  width: 100%;
}
</style>
