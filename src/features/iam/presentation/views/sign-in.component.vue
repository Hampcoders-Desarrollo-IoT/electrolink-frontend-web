<script setup>
import { useRouter } from "vue-router";
import useIamStore from "../../application/iam.store.js";
import { reactive, ref } from "vue";
import { SignInCommand } from "../../domain/commands/sign-in.command.js";

const router = useRouter();
const store = useIamStore();
const { signIn } = store;


const form = reactive({
  email: '',
  password: ''
});

function performSignIn() {
  const signInCommand = new SignInCommand(form);
  signIn(signInCommand, router);
}

function goToSignUp() {
  router.push({ name: 'iam-sign-up' });
}

function goToPasswordRecovery() {
  router.push({ name: 'iam-password-recovery' });
}
</script>

<template>
  <main class="sign-in-container">
    <!-- Left Section: Visual / Branding -->
    <section class="sign-in-left">
      <!-- Background decorative shapes -->
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>

      <div class="branding-content">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOjrBnW7S6PgKrzrMWkQf4Yuh9UqrBbwGmHq9wK1yz-vm_LLDOo59P__H9TnuOAYk2ZBenyXYOr-4386laa3GFRF0Z8x96GY_QCU3tCAMM0lL_wBNAlEDCbHIuPMbF-rRewHH15Cyu32aIDjzR-omCnxHS42FQFwZdY2fccKKmz9zZgL-PBzveyjANqB8UjLaPbBxhBJ7Qxg30YviXS6z91SUH8gRSGmlND3N3FMCSBPpgbRKK_g9lwYkWof2iywowLqDLJ5kMh8la"
          alt="ElectroLink Platform"
          class="branding-image"
        />
        <h1 class="branding-title">Empowering the Grid</h1>
        <p class="branding-subtitle">
          Manage assets, track maintenance, and connect your electrical
          infrastructure in one seamless interface.
        </p>
      </div>
    </section>

    <!-- Right Section: Login Form -->
    <section class="sign-in-right">
      <div class="sign-in-form-wrapper">
        <!-- Logo / Header -->
        <div class="form-header">
          <div class="logo-icon">
            <i class="pi pi-bolt" style="font-size: 1.5rem; color: var(--el-accent)"></i>
          </div>
          <h2 class="form-title">Welcome back</h2>
          <p class="form-subtitle">Please enter your details to sign in.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="performSignIn" class="login-form">

          <!-- Email Input -->
          <el-input-text
            id="sign-in-email"
            v-model="form.email"
            label="Email Address"
            placeholder="name@electrolink.com"
            :error="!form.email ? 'Email is required' : ''"
          />

          <!-- Password Input -->
          <div class="field">
            <div class="password-header">
              <label class="field-label" for="sign-in-password">Password</label>
              <a href="#" class="forgot-link" @click.prevent="goToPasswordRecovery">
                Forgot password?
              </a>
            </div>
            
            <el-input-text
              id="sign-in-password"
              v-model="form.password"
              placeholder="••••••••"
              type="password"
              :error="!form.password ? 'Password is required' : ''"
            />
          </div>

          <!-- Sign In Button -->
          <el-button
            id="sign-in-submit"
            type="submit"
            label="Sign In"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="sign-in-btn w-100"
            :disabled="!form.email || !form.password"
          />
        </form>

        <!-- Footer Note -->
        <p class="form-footer">
          New to the platform?
          <a href="#" @click.prevent="goToSignUp" class="footer-link">Sign Up</a>
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Container: Full viewport split layout */
.sign-in-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section: Branding */
.sign-in-left {
  display: none;
  position: relative;
  background-color: var(--el-primary);
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;
}

@media (min-width: 768px) {
  .sign-in-left {
    display: flex;
    width: 50%;
  }
}

@media (min-width: 1024px) {
  .sign-in-left {
    width: 60%;
  }
}

/* Decorative shapes */
.shape {
  position: absolute;
  border-radius: 50%;
}

.shape-1 {
  top: -5rem;
  right: -5rem;
  width: 16rem;
  height: 16rem;
  background-color: var(--el-celeste);
  opacity: 0.1;
}

.shape-2 {
  bottom: -8rem;
  left: -8rem;
  width: 24rem;
  height: 24rem;
  background-color: var(--el-accent);
  opacity: 0.1;
}

.branding-content {
  position: relative;
  z-index: 10;
  max-width: 28rem;
  text-align: center;
}

.branding-image {
  border-radius: 8px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  margin-bottom: 2rem;
  border: 4px solid rgba(181, 213, 245, 0.2);
  width: 100%;
  max-width: 100%;
  object-fit: cover;
}

.branding-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem;
}

.branding-subtitle {
  color: var(--el-celeste);
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
}

/* Right Section: Form */
.sign-in-right {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .sign-in-right {
    width: 50%;
    padding: 3rem;
  }
}

@media (min-width: 1024px) {
  .sign-in-right {
    width: 40%;
    padding: 5rem;
  }
}

.sign-in-form-wrapper {
  width: 75%;
  max-width: 28rem;
}

/* Header */
.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .form-header {
    text-align: left;
  }
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

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0 0 0.5rem;
  letter-spacing: -0.025em;
}

.form-subtitle {
  color: var(--el-warm-gray);
  margin: 0;
  font-size: 0.95rem;
}

/* Form */
.login-form {
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

.role-selector {
  width: 100%;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-custom);
}

.forgot-link:hover {
  text-decoration: underline;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remember-label {
  font-size: 0.875rem;
  color: var(--el-primary);
  cursor: pointer;
}

.sign-in-btn {
  padding-top: 0.875rem !important;
  padding-bottom: 0.875rem !important;
  font-weight: 700 !important;
}

/* Footer */
.form-footer {
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--el-warm-gray);
}

.footer-link {
  font-weight: 700;
  color: var(--el-primary);
}

.footer-link:hover {
  text-decoration: underline;
}

/* Utilities */
.w-full {
  width: 100%;
}


</style>
