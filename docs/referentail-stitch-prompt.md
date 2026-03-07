# ElectroLink Mockup Skill — Stitch + Vue 3 + PrimeVue + Pinia + Leaflet

## Propósito

Genera mockups de alta fidelidad para la aplicación **ElectroLink** usando el stack:

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** para gestión de estado global
- **PrimeVue 4** para componentes UI y estilos (usando prefijo `pv-`)
- **Leaflet** para mapas interactivos
- **JavaScript** (ES6+)

Antes de escribir cualquier código, lee esta skill completa. Cada sección es obligatoria.

---

## 1. Contexto del Sistema ElectroLink

ElectroLink conecta **Propietarios** y **Técnicos** eléctricos. Los bounded contexts son:

| Bounded Context                | Roles | Pantallas Clave                                                       |
| ------------------------------ | ----- | --------------------------------------------------------------------- |
| Identity & Access              | Ambos | Login, Registro diferenciado, Recuperar contraseña                    |
| Subscription & Payments        | Ambos | Planes, Checkout Stripe, Portal de cliente                            |
| Profiles & Preferences         | Ambos | Perfil Técnico (certificaciones, zona cobertura), Perfil Propietario  |
| Service Design & Planning      | Ambos | Catálogo de servicios, Asistente de solicitud, Recetas de componentes |
| Service Operation & Monitoring | Ambos | Dashboard en tiempo real, Registro fotográfico, Reportes técnicos     |
| Analytics                      | Ambos | Dashboard consumo (Propietario), Métricas rentabilidad (Técnico)      |
| Assets & Resource Management   | Ambos | Inventario Técnico, Propiedades con geolocalización                   |

**Planes de suscripción:**

- **Básico/Gratis (Propietario):** Límite 2 solicitudes/mes. Al superar → oferta upgrade Premium.
- **Premium (Propietario):** Sin límite, opción "Solicitud Prioritaria".
- **Técnico:** Debe suscribirse para activar su catálogo.

---

## 2. Decisiones de Arquitectura Front-end (Obligatorias)

### 2.1 Estructura de Carpetas Estándar

```
src/
├── features/            # Dominios de negocio (IAM, Analytics, Monitoring, etc.)
│   └── [feature]/
│       ├── application/    # Lógica de aplicación
│       ├── domain/         # Modelos y lógica de dominio
│       ├── infrastructure/ # Repositorios y adaptadores externos
│       └── presentation/   # UI: components, views, routes
├── shared/              # Recursos compartidos entre features
│   ├── application/
│   ├── domain/
│   ├── infrastructure/ # config (axios, pinia, i18n)
│   └── presentation/   # components, layouts, router, views
├── assets/              # Imágenes y estilos globales
├── App.vue
└── main.js
```

### 2.2 Convenciones Vue 3

```javascript
<!-- SIEMPRE usar <script setup> -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/shared/infrastructure/config/pinia";

// Props
const props = defineProps({
  serviceId: { type: String, required: true },
  isPriority: { type: Boolean, default: false }
});

// Emits
const emit = defineEmits(['confirm', 'cancel']);
</script>
```

### 2.3 Stores Pinia — Estructura Estándar

```typescript
// stores/auth.store.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export type UserRole = "owner" | "technician";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<{
    id: string;
    name: string;
    role: UserRole;
    plan: "basic" | "premium";
  } | null>(null);
  const isAuthenticated = computed(() => !!user.value);
  const isOwner = computed(() => user.value?.role === "owner");
  const isTechnician = computed(() => user.value?.role === "technician");
  const isPremium = computed(() => user.value?.plan === "premium");

  function login(userData: typeof user.value) {
    user.value = userData;
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    isOwner,
    isTechnician,
    isPremium,
    login,
    logout,
  };
});
```

```typescript
// stores/subscription.store.ts
export const useSubscriptionStore = defineStore("subscription", () => {
  const monthlyRequestCount = ref(0);
  const FREE_LIMIT = 2;
  const hasReachedLimit = computed(
    () => monthlyRequestCount.value >= FREE_LIMIT,
  );

  function incrementRequests() {
    monthlyRequestCount.value++;
  }

  return {
    monthlyRequestCount,
    FREE_LIMIT,
    hasReachedLimit,
    incrementRequests,
  };
});
```

---

## 3. Configuración PrimeVue (Obligatoria)

### 3.1 main.ts

```javascript
import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Material from "@primeuix/themes/material";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import App from "./App.vue";
import router from "./shared/presentation/router.js";
import pinia from "./shared/infrastructure/config/pinia.js";

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Material,
  },
  ripple: true,
});
app.use(ToastService);
app.use(ConfirmationService);

// Registrar componentes con prefijo pv-
app.component("pv-button", Button);
// ... otros componentes
app.mount("#app");
```

### 3.2 Paleta de Colores ElectroLink

Define en tu tema o variables CSS:

```css
:root {
  --el-primary: #2e3a59; /* Grafito profundo (Texto/Íconos) */
  --el-bg-soft: #e8eef7; /* Azul grisáceo suave (Fondos de secciones) */
  --el-warm-gray: #a9b1ba; /* Gris cálido (Texto secundario/Bordes) */
  --el-celeste: #b5d5f5; /* Celeste claro (Hover/Secundarios) */
  --el-accent: #ffe492; /* Amarillo pastel (Destacados/Avisos) */
  --el-success: #10b981;
  --el-danger: #ef4444;
}
```

### 3.3 Paleta de Colores Solicitada

| Color               | Uso                                            | Código Hex |
| ------------------- | ---------------------------------------------- | ---------- |
| Azul grisáceo suave | Fondo de secciones, tarjetas, menús laterales  | `#E8EEF7`  |
| Gris cálido         | Texto secundario, bordes suaves, fondos suaves | `#A9B1BA`  |
| Celeste claro       | Hover, botones secundarios, íconos de ayuda    | `#B5D5F5`  |
| Amarillo pastel     | Elementos destacados suaves, fondos de aviso   | `#FFE492`  |
| Grafito profundo    | Texto principal, íconos oscuros                | `#2E3A59`  |

### 3.3 Componentes PrimeVue de Uso Frecuente en ElectroLink

| Componente        | Import                   | Uso en ElectroLink                      |
| ----------------- | ------------------------ | --------------------------------------- |
| `<DataTable>`     | `primevue/datatable`     | Inventario técnico, historial servicios |
| `<Stepper>`       | `primevue/stepper`       | Asistente solicitud de servicio         |
| `<Card>`          | `primevue/card`          | Cards de servicios, propiedades         |
| `<Badge>`         | `primevue/badge`         | Estado servicio, plan usuario           |
| `<Tag>`           | `primevue/tag`           | Especialidades técnico, prioridad       |
| `<Timeline>`      | `primevue/timeline`      | Historial de estados del servicio       |
| `<Chart>`         | `primevue/chart`         | Dashboard Analytics                     |
| `<FileUpload>`    | `primevue/fileupload`    | Fotos antes/después del servicio        |
| `<Dialog>`        | `primevue/dialog`        | Modales de confirmación, upgrade plan   |
| `<Drawer>`        | `primevue/drawer`        | Sidebar en mobile                       |
| `<Menubar>`       | `primevue/menubar`       | Navbar principal                        |
| `<Toast>`         | `primevue/toast`         | Notificaciones del sistema              |
| `<ConfirmDialog>` | `primevue/confirmdialog` | Confirmaciones críticas                 |
| `<Skeleton>`      | `primevue/skeleton`      | Loading states                          |
| `<ProgressBar>`   | `primevue/progressbar`   | Consumo de solicitudes mes              |
| `<ToggleButton>`  | `primevue/togglebutton`  | Disponibilidad técnico                  |
| `<Rating>`        | `primevue/rating`        | Evaluación mutua post-servicio          |
| `<Steps>`         | `primevue/steps`         | Progreso del stepper de solicitud       |
| `<Splitter>`      | `primevue/splitter`      | Layout map + lista                      |

---

## 4. Integración Leaflet — Reglas Estrictas

### 4.1 Instalación

```bash
npm install leaflet
npm install @types/leaflet -D
```

### 4.2 Componente Mapa Base (Obligatorio para ElectroLink)

```vue
<!-- components/common/ElectroMap.vue -->
<template>
  <div ref="mapContainer" class="el-map" :style="{ height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons en Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapMarker {
  lat: number;
  lng: number;
  popup?: string;
  type?: "property" | "technician" | "service";
}

const props = defineProps<{
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  coverageRadius?: number; // Para zona de cobertura del técnico (metros)
}>();

const emit = defineEmits<{
  markerClick: [marker: MapMarker];
  mapClick: [latlng: { lat: number; lng: number }];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markerLayer: L.LayerGroup | null = null;
let coverageCircle: L.Circle | null = null;

// Íconos personalizados por tipo
const icons = {
  property: L.divIcon({
    html: '<i class="pi pi-home" style="font-size:1.4rem; color:#1E40AF"></i>',
    className: "el-map-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  technician: L.divIcon({
    html: '<i class="pi pi-wrench" style="font-size:1.4rem; color:#F59E0B"></i>',
    className: "el-map-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  service: L.divIcon({
    html: '<i class="pi pi-bolt" style="font-size:1.4rem; color:#10B981"></i>',
    className: "el-map-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};

onMounted(() => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value).setView(
    props.center ?? [-12.046374, -77.042793], // Lima, Perú por defecto
    props.zoom ?? 12,
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);

  map.on("click", (e) => {
    emit("mapClick", { lat: e.latlng.lat, lng: e.latlng.lng });
  });

  renderMarkers();
  renderCoverage();
});

function renderMarkers() {
  markerLayer?.clearLayers();
  props.markers?.forEach((m) => {
    const icon = m.type ? icons[m.type] : undefined;
    const marker = icon
      ? L.marker([m.lat, m.lng], { icon })
      : L.marker([m.lat, m.lng]);

    if (m.popup) marker.bindPopup(m.popup);
    marker.on("click", () => emit("markerClick", m));
    markerLayer?.addLayer(marker);
  });
}

function renderCoverage() {
  coverageCircle?.remove();
  if (props.coverageRadius && props.center) {
    coverageCircle = L.circle(props.center, {
      radius: props.coverageRadius,
      color: "#3B82F6",
      fillColor: "#3B82F6",
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(map!);
  }
}

watch(() => props.markers, renderMarkers, { deep: true });
watch(() => props.coverageRadius, renderCoverage);

onUnmounted(() => {
  map?.remove();
});
</script>

<style scoped>
.el-map {
  width: 100%;
  border-radius: 8px;
  z-index: 0;
}
.el-map-icon {
  background: transparent;
  border: none;
}
</style>
```

### 4.3 Casos de Uso del Mapa en ElectroLink

| Pantalla                                    | Configuración Leaflet                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Perfil Técnico — Zona de Cobertura          | `center` = ubicación técnico, `coverageRadius` = km configurado, tipo marker `technician` |
| Propiedades del Propietario                 | Markers tipo `property` con popup = nombre propiedad                                      |
| Asistente Solicitud — Seleccionar Propiedad | Markers `property` clicables, emit `markerClick` para seleccionar                         |
| Dashboard Técnico — Servicios del Día       | Markers tipo `service` con popup = dirección + hora                                       |
| Asignación Automática (Admin view)          | Markers `technician` + `property` con línea L.polyline entre ellos                        |

---

## 5. Flujos de Pantallas — Guía por Rol

### 5.1 Flujo Propietario

```
Login/Registro
  └─► Dashboard Propietario
        ├─► [Botón "Nueva Solicitud"]
        │     └─► Asistente Solicitud (Stepper 4 pasos)
        │           ├─ Paso 1: Verificación Plan (si Basic → check límite)
        │           ├─ Paso 2: Selección Propiedad (mapa) + Servicio (catálogo)
        │           ├─ Paso 3: Detalles (descripción + recibo eléctrico + prioridad si Premium)
        │           └─ Paso 4: Confirmación
        ├─► Mis Propiedades (Assets)
        │     └─► Agregar Propiedad (mapa para geolocalización)
        ├─► Mis Servicios (historial)
        │     └─► Detalle Servicio (timeline estados + fotos + reporte)
        ├─► Analytics (dashboard consumo + alertas)
        └─► Suscripción (plan actual + upgrade)
```

### 5.2 Flujo Técnico

```
Login/Registro
  └─► Onboarding: Elegir Plan (requerido para activar catálogo)
        └─► Dashboard Técnico
              ├─► Agenda del Día (mapa + lista)
              ├─► Mi Catálogo de Servicios
              │     └─► Crear/Editar Servicio (receta componentes)
              ├─► Inventario (tabla + alertas stock)
              ├─► Perfil (certificaciones + zona cobertura en mapa)
              ├─► Analytics (ingresos + métricas desempeño)
              └─► Servicio Activo (seguimiento + fotos + reporte + evaluación)
```

---

## 6. Componentes Clave — Plantillas Completas

### 6.1 Asistente de Solicitud (Stepper PrimeVue)

```vue
<!-- views/owner/ServiceRequestWizard.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6" style="color: var(--el-primary)">
      <i class="pi pi-bolt mr-2"></i>Nueva Solicitud de Servicio
    </h1>

    <!-- Banner límite alcanzado -->
    <pv-message v-if="hasReachedLimit && !isPremium" severity="warn" class="mb-4">
      Has alcanzado tu límite de 2 solicitudes mensuales del Plan Básico.
      <pv-button
        label="Actualizar a Premium"
        size="small"
        class="ml-3"
        @click="showUpgradeDialog = true"
      />
    </pv-message>

    <pv-stepper v-model:value="activeStep" :linear="true">
      <!-- PASO 1: Verificación de plan -->
      <pv-step-list>
        <pv-step value="1">Plan</pv-step>
        <pv-step value="2">Propiedad y Servicio</pv-step>
        <pv-step value="3">Detalles</pv-step>
        <pv-step value="4">Confirmación</pv-step>
      </pv-step-list>

      <pv-step-panels>
        <!-- Panel 1 -->
        <pv-step-panel value="1">
          <div class="flex flex-col gap-4 py-6">
            <div
              class="flex items-center gap-3 p-4 rounded-lg border"
              :class="
                isPremium
                  ? 'border-green-300 bg-green-50'
                  : 'border-blue-200 bg-blue-50'
              "
            >
              <i
                class="pi text-2xl"
                :class="
                  isPremium
                    ? 'pi-star-fill text-yellow-500'
                    : 'pi-info-circle text-blue-500'
                "
              ></i>
              <div>
                <p class="font-semibold">
                  {{
                    isPremium ? "Plan Premium Activo" : "Plan Básico (Gratis)"
                  }}
                </p>
                <p v-if="!isPremium" class="text-sm text-gray-600">
                  Solicitudes este mes: {{ monthlyCount }}/2
                </p>
              </div>
              <Tag
                v-if="isPremium"
                value="PREMIUM"
                severity="warning"
                class="ml-auto"
              />
            </div>

            <pv-progress-bar
              v-if="!isPremium"
              :value="(monthlyCount / 2) * 100"
              :class="monthlyCount >= 2 ? 'p-progressbar-danger' : ''"
            />

            <pv-button
              label="Continuar"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="hasReachedLimit && !isPremium"
              @click="activeStep = '2'"
            />
          </div>
        </pv-step-panel>

        <!-- Panel 2 -->
        <StepPanel value="2">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div>
              <label class="block font-semibold mb-2"
                >Selecciona tu Propiedad</label
              >
              <ElectroMap
                :markers="propertyMarkers"
                height="280px"
                @marker-click="selectProperty"
              />
              <Dropdown
                v-model="selectedProperty"
                :options="properties"
                optionLabel="name"
                placeholder="O elige de la lista..."
                class="w-full mt-2"
              />
            </div>
            <div>
              <label class="block font-semibold mb-2"
                >Servicio Disponible en tu Zona</label
              >
              <div class="flex flex-col gap-2 max-h-64 overflow-y-auto">
                <div
                  v-for="svc in availableServices"
                  :key="svc.id"
                  class="p-3 border rounded-lg cursor-pointer transition-all"
                  :class="
                    selectedService?.id === svc.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  "
                  @click="selectedService = svc"
                >
                  <p class="font-semibold">{{ svc.name }}</p>
                  <p class="text-sm text-gray-500">{{ svc.description }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Tag :value="`S/ ${svc.basePrice}`" />
                    <Tag
                      v-if="svc.estimatedTime"
                      :value="svc.estimatedTime"
                      severity="info"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <Button
              label="Atrás"
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="activeStep = '1'"
            />
            <Button
              label="Continuar"
              icon="pi pi-arrow-right"
              iconPos="right"
              :disabled="!selectedProperty || !selectedService"
              @click="activeStep = '3'"
            />
          </div>
        </StepPanel>

        <!-- Panel 3 -->
        <StepPanel value="3">
          <div class="flex flex-col gap-4 py-6">
            <div>
              <label class="block font-semibold mb-1"
                >Descripción del Problema (Opcional)</label
              >
              <Textarea
                v-model="description"
                rows="3"
                class="w-full"
                placeholder="Describe brevemente el problema..."
              />
            </div>

            <div>
              <label class="block font-semibold mb-1"
                >Último Recibo Eléctrico</label
              >
              <div class="grid grid-cols-2 gap-3">
                <InputNumber
                  v-model="receipt.consumption"
                  prefix="kWh "
                  placeholder="Consumo"
                />
                <InputNumber
                  v-model="receipt.amount"
                  prefix="S/ "
                  placeholder="Monto"
                  mode="currency"
                  currency="PEN"
                />
              </div>
              <FileUpload
                mode="basic"
                accept="image/*,application/pdf"
                class="mt-2"
                chooseLabel="Adjuntar recibo (opcional)"
              />
            </div>

            <!-- Solo para Premium -->
            <div
              v-if="isPremium"
              class="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <i class="pi pi-star-fill text-yellow-500 text-xl"></i>
              <div class="flex-1">
                <p class="font-semibold">Solicitud Prioritaria</p>
                <p class="text-sm text-gray-600">
                  Tu solicitud será procesada primero
                </p>
              </div>
              <ToggleButton
                v-model="isPriorityRequest"
                onIcon="pi pi-bolt"
                offIcon="pi pi-bolt"
                onLabel="Activada"
                offLabel="Activar"
              />
            </div>
          </div>
          <div class="flex justify-between">
            <Button
              label="Atrás"
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="activeStep = '2'"
            />
            <Button
              label="Revisar Solicitud"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activeStep = '4'"
            />
          </div>
        </StepPanel>

        <!-- Panel 4 -->
        <StepPanel value="4">
          <div class="flex flex-col gap-4 py-6">
            <h3 class="font-semibold text-lg">Resumen de tu Solicitud</h3>
            <Card>
              <template #content>
                <div class="flex flex-col gap-2">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Propiedad</span>
                    <span class="font-medium">{{
                      selectedProperty?.name
                    }}</span>
                  </div>
                  <Divider />
                  <div class="flex justify-between">
                    <span class="text-gray-500">Servicio</span>
                    <span class="font-medium">{{ selectedService?.name }}</span>
                  </div>
                  <Divider />
                  <div class="flex justify-between">
                    <span class="text-gray-500">Precio estimado</span>
                    <span class="font-semibold text-blue-600"
                      >S/ {{ selectedService?.basePrice }}</span
                    >
                  </div>
                  <Divider v-if="isPriorityRequest" />
                  <div v-if="isPriorityRequest" class="flex justify-between">
                    <span class="text-gray-500">Prioridad</span>
                    <Tag
                      value="PRIORITARIA"
                      severity="warning"
                      icon="pi pi-bolt"
                    />
                  </div>
                </div>
              </template>
            </Card>

            <Message severity="info">
              El sistema asignará automáticamente el técnico más adecuado según
              disponibilidad y zona.
            </Message>
          </div>
          <div class="flex justify-between">
            <pv-button
              label="Atrás"
              icon="pi pi-arrow-left"
              severity="secondary"
              @click="activeStep = '3'"
            />
            <pv-button
              label="Confirmar Solicitud"
              icon="pi pi-check"
              severity="success"
              :loading="isSubmitting"
              @click="submitRequest"
            />
          </div>
        </pv-step-panel>
      </pv-step-panels>
    </pv-stepper>

    <!-- Dialog Upgrade -->
    <pv-dialog
      v-model:visible="showUpgradeDialog"
      header="Actualiza tu Plan"
      modal
      :style="{ width: '420px' }"
    >
      <div class="flex flex-col gap-4 py-2">
        <p>Desbloquea solicitudes ilimitadas y prioridad en la atención.</p>
        <div
          class="p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white text-center"
        >
          <p class="text-3xl font-bold">S/ 29.90</p>
          <p class="text-blue-200">/ mes — Plan Premium</p>
        </div>
        <ul class="flex flex-col gap-2">
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i> Solicitudes ilimitadas
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i> Prioridad en asignación
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i> Analytics avanzados
          </li>
        </ul>
      </div>
      <template #footer>
        <Button
          label="Cancelar"
          severity="secondary"
          @click="showUpgradeDialog = false"
        />
        <Button
          label="Actualizar ahora"
          icon="pi pi-crown"
          severity="warning"
          @click="goToPremium"
        />
      </template>
    </Dialog>
  </div>
</template>
```

### 6.2 Dashboard Técnico — Layout con Mapa

```vue
<!-- views/technician/TechnicianDashboard.vue -->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
    <!-- Columna izquierda: estadísticas + agenda -->
    <div class="lg:col-span-1 flex flex-col gap-4">
      <!-- KPIs -->
      <div class="grid grid-cols-2 gap-3">
        <Card class="text-center">
          <template #content>
            <p class="text-3xl font-bold text-blue-600">
              {{ stats.todayJobs }}
            </p>
            <p class="text-sm text-gray-500">Trabajos hoy</p>
          </template>
        </Card>
        <Card class="text-center">
          <template #content>
            <p class="text-3xl font-bold text-green-600">
              S/ {{ stats.monthEarnings }}
            </p>
            <p class="text-sm text-gray-500">Este mes</p>
          </template>
        </Card>
      </div>

      <!-- Disponibilidad -->
      <Card>
        <template #title>Estado</template>
        <template #content>
          <div class="flex items-center justify-between">
            <span>Disponible para trabajos</span>
            <ToggleButton
              v-model="isAvailable"
              onLabel="Activo"
              offLabel="Inactivo"
              onIcon="pi pi-check-circle"
              offIcon="pi pi-times-circle"
            />
          </div>
        </template>
      </Card>

      <!-- Agenda del día -->
      <Card>
        <template #title>Agenda de Hoy</template>
        <template #content>
          <Timeline :value="todayServices">
            <template #marker="{ item }">
              <span class="pi" :class="serviceIcon(item.status)"></span>
            </template>
            <template #content="{ item }">
              <div class="flex flex-col">
                <span class="font-semibold text-sm">{{ item.clientName }}</span>
                <span class="text-xs text-gray-500">{{ item.address }}</span>
                <span class="text-xs">{{ item.scheduledTime }}</span>
                <Tag
                  :value="item.status"
                  :severity="statusSeverity(item.status)"
                  class="mt-1 w-fit"
                />
              </div>
            </template>
          </Timeline>
        </template>
      </Card>

      <!-- Alerta de stock -->
      <Message v-if="lowStockItems.length > 0" severity="warn">
        <i class="pi pi-exclamation-triangle mr-1"></i>
        {{ lowStockItems.length }} componente(s) con stock bajo
        <Button
          label="Ver inventario"
          link
          size="small"
          @click="$router.push('/technician/inventory')"
        />
      </Message>
    </div>

    <!-- Columna derecha: mapa de servicios del día -->
    <div class="lg:col-span-2 flex flex-col gap-4">
      <Card>
        <template #title>Mapa de Servicios del Día</template>
        <template #content>
          <ElectroMap
            :markers="serviceMarkers"
            :center="techLocation"
            :zoom="13"
            height="450px"
            @marker-click="openServiceDetail"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
```

### 6.3 Inventario de Componentes (DataTable)

```vue
<!-- views/technician/InventoryView.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Inventario de Componentes</h1>
      <Button
        label="Agregar Componente"
        icon="pi pi-plus"
        @click="openAddDialog"
      />
    </div>

    <DataTable
      :value="inventory"
      :loading="loading"
      paginator
      :rows="10"
      :globalFilterFields="['name', 'category']"
      dataKey="id"
      responsiveLayout="scroll"
      class="p-datatable-sm"
    >
      <template #header>
        <div class="flex justify-between">
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="globalFilter"
              placeholder="Buscar componente..."
            />
          </IconField>
          <Button
            icon="pi pi-download"
            label="Exportar"
            severity="secondary"
            @click="exportCSV"
          />
        </div>
      </template>

      <Column field="name" header="Componente" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-bolt text-blue-500"></i>
            <span class="font-medium">{{ data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="category" header="Categoría" sortable />
      <Column field="stock" header="Stock" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span
              :class="
                data.stock <= data.minStock ? 'text-red-500 font-bold' : ''
              "
            >
              {{ data.stock }} {{ data.unit }}
            </span>
            <Badge
              v-if="data.stock <= data.minStock"
              value="!"
              severity="danger"
            />
          </div>
        </template>
      </Column>
      <Column field="minStock" header="Stock Mínimo" />
      <Column field="unitCost" header="Costo Unitario">
        <template #body="{ data }">S/ {{ data.unitCost }}</template>
      </Column>
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-pencil"
              size="small"
              text
              @click="editItem(data)"
            />
            <Button
              icon="pi pi-trash"
              size="small"
              text
              severity="danger"
              @click="deleteItem(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
```

---

## 7. Router — Rutas por Rol

```typescript
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: "/", redirect: "/login" },
    { path: "/login", component: () => import("@/views/auth/LoginView.vue") },
    {
      path: "/register",
      component: () => import("@/views/auth/RegisterView.vue"),
    },

    // Owner
    {
      path: "/owner",
      component: () => import("@/components/layout/OwnerLayout.vue"),
      meta: { role: "owner" },
      children: [
        {
          path: "dashboard",
          component: () => import("@/views/owner/OwnerDashboard.vue"),
        },
        {
          path: "services/new",
          component: () => import("@/views/owner/ServiceRequestWizard.vue"),
        },
        {
          path: "services",
          component: () => import("@/views/owner/MyServices.vue"),
        },
        {
          path: "properties",
          component: () => import("@/views/owner/PropertiesView.vue"),
        },
        {
          path: "analytics",
          component: () => import("@/views/owner/OwnerAnalytics.vue"),
        },
        {
          path: "subscription",
          component: () => import("@/views/owner/SubscriptionView.vue"),
        },
      ],
    },

    // Technician
    {
      path: "/technician",
      component: () => import("@/components/layout/TechnicianLayout.vue"),
      meta: { role: "technician" },
      children: [
        {
          path: "dashboard",
          component: () => import("@/views/technician/TechnicianDashboard.vue"),
        },
        {
          path: "catalog",
          component: () => import("@/views/technician/ServiceCatalog.vue"),
        },
        {
          path: "inventory",
          component: () => import("@/views/technician/InventoryView.vue"),
        },
        {
          path: "profile",
          component: () => import("@/views/technician/TechnicianProfile.vue"),
        },
        {
          path: "analytics",
          component: () => import("@/views/technician/TechnicianAnalytics.vue"),
        },
        {
          path: "service/:id",
          component: () => import("@/views/technician/ActiveService.vue"),
        },
      ],
    },
  ],
});

// Guard de navegación
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    next("/login");
  } else {
    next();
  }
});

export default router;
```

---

## 8. Patrones de Notificaciones (Toast)

```typescript
// composables/useNotifications.ts
import { useToast } from "primevue/usetoast";

export function useNotifications() {
  const toast = useToast();

  return {
    success: (msg: string, title = "Éxito") =>
      toast.add({
        severity: "success",
        summary: title,
        detail: msg,
        life: 3000,
      }),

    error: (msg: string, title = "Error") =>
      toast.add({ severity: "error", summary: title, detail: msg, life: 5000 }),

    warn: (msg: string, title = "Atención") =>
      toast.add({ severity: "warn", summary: title, detail: msg, life: 4000 }),

    info: (msg: string, title = "Info") =>
      toast.add({ severity: "info", summary: title, detail: msg, life: 3000 }),

    serviceAssigned: (techName: string) =>
      toast.add({
        severity: "success",
        summary: "¡Técnico Asignado!",
        detail: `${techName} atenderá tu solicitud`,
        life: 5000,
      }),

    limitReached: () =>
      toast.add({
        severity: "warn",
        summary: "Límite Alcanzado",
        detail: "Actualiza a Premium para solicitudes ilimitadas",
        life: 6000,
      }),
  };
}
```

---

## 9. Datos Mock para Prototipado Rápido

```typescript
// mock/data.ts — Usar en stores durante prototipado con Stitch

export const MOCK_OWNER = {
  id: "owner-1",
  name: "Carlos Mendoza",
  role: "owner" as const,
  plan: "basic" as const,
  email: "carlos@email.com",
};

export const MOCK_TECHNICIAN = {
  id: "tech-1",
  name: "Luis García",
  role: "technician" as const,
  plan: "premium" as const,
  specialties: ["Instalaciones", "Mantenimiento", "Paneles Solares"],
  rating: 4.8,
  coverageRadius: 15000, // 15km en metros
  location: { lat: -12.046374, lng: -77.042793 }, // Lima
};

export const MOCK_PROPERTIES = [
  {
    id: "prop-1",
    name: "Casa Principal",
    address: "Av. Javier Prado 1234, San Isidro",
    lat: -12.089,
    lng: -77.033,
  },
  {
    id: "prop-2",
    name: "Oficina",
    address: "Jr. de la Unión 456, Lima Centro",
    lat: -12.046,
    lng: -77.031,
  },
];

export const MOCK_SERVICES = [
  {
    id: "svc-1",
    name: "Instalación de Tomacorrientes",
    basePrice: 80,
    estimatedTime: "2h",
    description: "Instalación de hasta 3 puntos",
  },
  {
    id: "svc-2",
    name: "Revisión de Tablero Eléctrico",
    basePrice: 120,
    estimatedTime: "3h",
    description: "Diagnóstico completo del tablero",
  },
  {
    id: "svc-3",
    name: "Instalación Panel Solar",
    basePrice: 850,
    estimatedTime: "1 día",
    description: "Kit 1.5kW con instalación",
  },
];

export const MOCK_INVENTORY = [
  {
    id: "inv-1",
    name: "Cable AWG 14",
    category: "Conductores",
    stock: 50,
    minStock: 20,
    unit: "m",
    unitCost: 2.5,
  },
  {
    id: "inv-2",
    name: "Interruptor Termomagnético 20A",
    category: "Protección",
    stock: 3,
    minStock: 5,
    unit: "und",
    unitCost: 35,
  },
  {
    id: "inv-3",
    name: "Tomacorriente Doble",
    category: "Accesorios",
    stock: 15,
    minStock: 10,
    unit: "und",
    unitCost: 12,
  },
];

export const MOCK_TODAY_SERVICES = [
  {
    id: "s1",
    clientName: "Ana Torres",
    address: "Miraflores",
    scheduledTime: "09:00",
    status: "completed",
    lat: -12.119,
    lng: -77.03,
  },
  {
    id: "s2",
    clientName: "Roberto Silva",
    address: "Surco",
    scheduledTime: "12:00",
    status: "in_progress",
    lat: -12.14,
    lng: -76.992,
  },
  {
    id: "s3",
    clientName: "María López",
    address: "San Borja",
    scheduledTime: "15:30",
    status: "scheduled",
    lat: -12.094,
    lng: -76.998,
  },
];
```

---

## 10. Checklist Antes de Generar Cada Vista

Antes de escribir el template de cualquier pantalla de ElectroLink:

- [ ] ¿El usuario es **Propietario** o **Técnico**? → Usar layout correcto
- [ ] ¿La vista accede al **estado de suscripción**? → Importar `useSubscriptionStore`
- [ ] ¿La vista usa mapa? → Importar `ElectroMap.vue`, siempre con `height` definida
- [ ] ¿La vista tiene acciones destructivas? → Usar `ConfirmDialog` de PrimeVue
- [ ] ¿La vista tiene formularios? → Usar `useToast` para feedback
- [ ] ¿La vista tiene datos cargando? → Agregar `<Skeleton>` en loading state
- [ ] ¿La vista es accesible desde mobile? → Grid responsive con `grid-cols-1 md:grid-cols-N`
- [ ] ¿La vista involucra el **límite de solicitudes**? → Verificar `hasReachedLimit` antes de permitir acción
- [ ] ¿El técnico requiere suscripción activa? → Guard en router o check en `onMounted`
- [ ] ¿Los colores siguen la paleta ElectroLink? → Usar variables `var(--el-*)` o clases Tailwind configuradas

---

## 11. Anti-Patrones — Nunca Hacer

❌ **No usar Options API** — siempre `<script setup>`  
❌ **No usar `document.getElementById`** — siempre `ref()` de Vue  
❌ **No inicializar Leaflet antes de `onMounted`** — el DOM no existe antes  
❌ **No hardcodear estilos inline para colores** — usar variables CSS o clases PrimeVue  
❌ **No mutar el estado directamente fuera del store** — siempre via actions Pinia  
❌ **No olvidar `onUnmounted` para destruir el mapa Leaflet** — causa memory leaks  
❌ **No mostrar el botón "Solicitud Prioritaria" a usuarios Básicos**  
❌ **No permitir continuar el wizard si `hasReachedLimit && !isPremium`**  
❌ **No importar Leaflet CSS dos veces** — solo en el componente base del mapa

---

_Skill generada para ElectroLink v1.0 — Stack: Vue 3 + Pinia + PrimeVue (Aura) + Leaflet_
