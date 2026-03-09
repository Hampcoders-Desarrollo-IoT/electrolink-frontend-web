import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import i18n from "./shared/infrastructure/config/i18n.js";
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import Material from '@primeuix/themes/material';
import PrimeVue from 'primevue/config';
import {
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox, Column,
    ConfirmationService,
    ConfirmDialog,
    DataTable, Dialog,
    DialogService, Divider, Drawer, FileUpload, FloatLabel, IconField, InputIcon, InputNumber, InputText, Menu,
    Message, MultiSelect, Password, ProgressBar, RadioButton,
    Rating, Row, Select, SelectButton, Tag, Textarea, Toast,
    ToastService, ToggleButton, Toolbar, Tooltip, DatePicker
} from "primevue";
import router from "./shared/presentation/router.js";
import pinia from "./shared/infrastructure/config/pinia.js";

// Shared ElectroLink components
import ElButton from "./shared/presentation/components/el-button.vue";
import ElCheckbox from "./shared/presentation/components/el-checkbox.vue";
import ElChip from "./shared/presentation/components/el-chip.vue";
import ElDatepicker from "./shared/presentation/components/el-datepicker.vue";
import ElInputText from "./shared/presentation/components/el-input-text.vue";
import ElMultiSelect from "./shared/presentation/components/el-multi-select.vue";
import ElSelect from "./shared/presentation/components/el-select.vue";
import ElSwitcher from "./shared/presentation/components/el-switcher.vue";
import ElTextarea from "./shared/presentation/components/el-textarea.vue";

createApp(App)
    .use(i18n)
    .use(PrimeVue, {theme: {preset: Material}, ripple: true})
    .use(ConfirmationService)
    .use(DialogService)
    .use(ToastService)
    .component('pv-avatar',          Avatar)
    .component('pv-badge',           Badge)
    .component('pv-button',          Button)
    .component('pv-card',            Card)
    .component('pv-column',          Column)
    .component('pv-confirm-dialog',  ConfirmDialog)
    .component('pv-checkbox',        Checkbox)
    .component('pv-data-table',      DataTable)
    .component('pv-dialog',          Dialog)
    .component('pv-divider',         Divider)
    .component('pv-datepicker',      DatePicker)
    .component('pv-select',          Select)
    .component('pv-select-button',   SelectButton)
    .component('pv-file-upload',     FileUpload)
    .component('pv-float-label',     FloatLabel)
    .component('pv-icon-field',      IconField)
    .component('pv-input-icon',      InputIcon)
    .component('pv-input-text',      InputText)
    .component('pv-input-number',    InputNumber)
    .component('pv-menu',            Menu)
    .component('pv-message',         Message)
    .component('pv-multi-select',    MultiSelect)
    .component('pv-password',        Password)
    .component('pv-progress-bar',    ProgressBar)
    .component('pv-radio-button',    RadioButton)
    .component('pv-rating',          Rating)
    .component('pv-row',             Row)
    .component('pv-drawer',          Drawer)
    .component('pv-tag',             Tag)
    .component('pv-textarea',        Textarea)
    .component('pv-toggle-button',   ToggleButton)
    .component('pv-toolbar',         Toolbar)
    .component('pv-toast',           Toast)
    .component('el-button',          ElButton)
    .component('el-checkbox',        ElCheckbox)
    .component('el-chip',            ElChip)
    .component('el-datepicker',      ElDatepicker)
    .component('el-input-text',      ElInputText)
    .component('el-multi-select',    ElMultiSelect)
    .component('el-select',          ElSelect)
    .component('el-switcher',        ElSwitcher)
    .component('el-textarea',        ElTextarea)
    .directive('tooltip',            Tooltip)
    .use(router)
    .use(pinia)
    .mount('#app')