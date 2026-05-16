<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon paths when bundled with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl:       new URL('leaflet/dist/images/marker-icon.png',    import.meta.url).href,
    shadowUrl:     new URL('leaflet/dist/images/marker-shadow.png',  import.meta.url).href,
});

const props = defineProps({
    /** Array of { lat, lng, popup, type } objects */
    markers: {
        type: Array,
        default: () => []
    },
    /** [lat, lng] pair to center the map */
    center: {
        type: Array,
        default: () => [-12.0464, -77.0428] // Lima, Perú
    },
    zoom: {
        type: Number,
        default: 13
    },
    /** When true, clicking the map emits map-click with { lat, lng } */
    clickable: {
        type: Boolean,
        default: false
    },
    height: {
        type: String,
        default: '100%'
    },
    /** Circle to draw on the map { center: [lat, lng], radiusKm: Number } */
    circle: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['map-click']);


const mapEl = ref(null);
let mapInstance = null;
let markerLayer = null;
let clickMarker = null;
let circleInstance = null;


// Custom icons
const propertyIcon = L.divIcon({
    html: `<span class="el-map-pin el-map-pin--property"><i class="pi pi-home"></i></span>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
});

const selectedIcon = L.divIcon({
    html: `<span class="el-map-pin el-map-pin--selected"><i class="pi pi-home"></i></span>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 36]
});

const clickIcon = L.divIcon({
    html: `<span class="el-map-pin el-map-pin--click"><i class="pi pi-map-marker"></i></span>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

function getIcon(type) {
    if (type === 'selected') return selectedIcon;
    return propertyIcon;
}

function renderMarkers() {
    if (!mapInstance) return;
    if (markerLayer) {
        markerLayer.clearLayers();
    } else {
        markerLayer = L.layerGroup().addTo(mapInstance);
    }
    props.markers.forEach(m => {
        if (m.lat == null || m.lng == null) return;
        const marker = L.marker([m.lat, m.lng], { icon: getIcon(m.type) });
        if (m.popup) marker.bindPopup(m.popup);
        markerLayer.addLayer(marker);
    });
}

function renderCircle() {
    if (!mapInstance) return;
    if (circleInstance) {
        mapInstance.removeLayer(circleInstance);
        circleInstance = null;
    }
    if (props.circle && props.circle.center && props.circle.radiusKm) {
        circleInstance = L.circle(props.circle.center, {
            radius: props.circle.radiusKm * 1000,
            color: '#7C3AED',
            fillColor: '#7C3AED',
            fillOpacity: 0.2
        }).addTo(mapInstance);
    }
}


onMounted(() => {
    if (!mapEl.value) return;

    mapInstance = L.map(mapEl.value, {
        center: props.center,
        zoom: props.zoom,
        zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(mapInstance);

    // Custom zoom control — bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    renderMarkers();
    renderCircle();

    if (props.clickable) {

        mapInstance.getContainer().style.cursor = 'crosshair';
        mapInstance.on('click', (e) => {
            const { lat, lng } = e.latlng;
            // Move/place a single click-pin
            if (clickMarker) {
                clickMarker.setLatLng([lat, lng]);
            } else {
                clickMarker = L.marker([lat, lng], { icon: clickIcon }).addTo(mapInstance);
            }
            emit('map-click', { lat, lng });
        });
    }
});

onUnmounted(() => {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
        markerLayer = null;
        clickMarker = null;
    }
});

// Reactively update markers when prop changes
watch(() => props.markers, renderMarkers, { deep: true });

// Pan to center when it changes
watch(() => props.center, (val) => {
    if (mapInstance && val?.length === 2) {
        mapInstance.setView(val, props.zoom);
    }
});

// Reactively update circle when prop changes
watch(() => props.circle, renderCircle, { deep: true });

</script>

<template>
  <div ref="mapEl" class="el-map" :style="{ height }"></div>
</template>

<style>
/* Leaflet must use global CSS (not scoped) for map tiles to render correctly */
.el-map {
  width: 100%;
  border-radius: inherit;
  z-index: 0;
}

/* Custom pin styles */
.el-map-pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
}

.el-map-pin i {
  transform: rotate(45deg);
  font-size: 0.9rem;
  color: white;
}

.el-map-pin--property {
  background: #2E3A59;
}

.el-map-pin--selected {
  background: #F97316;
}

.el-map-pin--click {
  width: 32px;
  height: 32px;
  border-radius: 50% 50% 50% 0;
  background: #7C3AED;
}

.el-map-pin--click i {
  transform: rotate(45deg);
  font-size: 0.85rem;
  color: white;
}
</style>
