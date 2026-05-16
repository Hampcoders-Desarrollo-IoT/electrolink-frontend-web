# Routing Examples (Based on Semantic URLs)

- `/customers` -> path: `'customers'`, component: `CustomersComponent`
- `/customers/10/appointments` -> path: `'customers/:id/appointments'`, component: `CustomerAppointmentsComponent`
- `/doctors` -> path: `'doctors'`, component: `DoctorProfilesComponent`
- `/doctors/8` -> path: `'doctors/:id'`, component: `DoctorProfilesComponent`
- `/doctors/8/customers` -> path: `'doctors/:id/customers'`, component: `DoctorCustomersComponent`
- `/doctors/8/appointments` -> path: `'doctors/:id/appointments'`, component: `DoctorAppointmentsComponent`
- `/doctors/8/appointments/new` -> path: `'doctors/:id/appointments/new'`, component: `DoctorAppointmentsCreateAndEditComponent`
- `/doctors/8/appointments/4/edit` -> path: `'doctors/:id/appointments/:appointmentId/edit'`, component: `DoctorAppointmentsCreateAndEditComponent`
- `/projects/5/resources` -> path: `'projects/:id/resources'`, component: `ProjectResourcesComponent`

---

## Folder Examples

(Based on Domain-Driven Design)

### CRM Bounded Context (`crm`)

- `/crm/pages/customers.component.vue`
- `/crm/components/customer-profile-summary.component.vue`

### Profile Management Bounded Context (`profiles`)

- `/profiles/pages/doctor-profiles.component.vue`
- `/profiles/pages/doctor-profile.component.vue`
- `/profiles/components/doctor-profile-summary.component.vue`

### Appointment Management Bounded Context (`appointments`)

- `/appointments/pages/customer-appointments.component.vue`
- `/appointments/pages/doctor-appointments.component.vue`
- `/appointments/pages/doctor-appointment-create-and-edit.component.vue`
- `/appointments/pages/customer-appointment-create-and-edit.component.vue`

### Project Planning Bounded Context (`planning`)

- `/planning/pages/project-resources.component.vue`

### Assets Bounded Context (`assets`)

- `/assets/homeowners/:homeownerId/properties` -> path: `'homeowners/:homeownerId/properties'`, component: `PropertiesComponent`
- `/assets/homeowners/:homeownerId/properties/:propertyId` -> path: `'homeowners/:homeownerId/properties/:propertyId'`, component: `PropertyDetailComponent`
- `/assets/homeowners/:homeownerId/portfolio` -> path: `'homeowners/:homeownerId/portfolio'`, component: `PropertyPortfolioComponent`
- `/assets/technicians/:technicianId/inventory` -> path: `'technicians/:technicianId/inventory'`, component: `TechnicianInventoryComponent`
- `/assets/technicians/:technicianId/components` -> path: `'technicians/:technicianId/components'`, component: `TechnicianComponentsComponent`
- `/assets/technicians/:technicianId/component-types` -> path: `'technicians/:technicianId/component-types'`, component: `TechnicianComponentTypesComponent`

## Technician (todas las rutas de técnico)

# Catálogo de tipos de componente (propio de cada técnico)

- `/assets/technicians/:technicianId/component-types` -> path: 'technicians/:technicianId/component-types' -> component: TechnicianComponentTypesComponent -> → GET /api/v1/assets/technicians/:technicianId/component-types -> → POST /api/v1/assets/technicians/:technicianId/component-types

- `/assets/technicians/:technicianId/component-types/:componentTypeId`
  path: 'technicians/:technicianId/component-types/:componentTypeId'
  component: TechnicianComponentTypeDetailComponent
  → GET /api/v1/assets/technicians/:technicianId/component-types/:componentTypeId
  → PUT /api/v1/assets/technicians/:technicianId/component-types/:componentTypeId
  → DELETE /api/v1/assets/technicians/:technicianId/component-types/:componentTypeId

# Catálogo de componentes (propio de cada técnico)

- `/assets/technicians/:technicianId/components`
  path: 'technicians/:technicianId/components'
  component: TechnicianComponentsComponent
  → GET /api/v1/assets/technicians/:technicianId/components
  → POST /api/v1/assets/technicians/:technicianId/components

- `/assets/technicians/:technicianId/components/:componentId`
  path: 'technicians/:technicianId/components/:componentId'
  component: TechnicianComponentDetailComponent
  → GET /api/v1/assets/technicians/:technicianId/components/:componentId
  → PUT /api/v1/assets/technicians/:technicianId/components/:componentId
  → DELETE /api/v1/assets/technicians/:technicianId/components/:componentId

# Inventario (stock de sus componentes)

- `/assets/technicians/:technicianId/inventory`
  path: 'technicians/:technicianId/inventory'
  component: TechnicianInventoryComponent
  → GET /api/v1/assets/technicians/:technicianId/inventory
  → POST /api/v1/assets/technicians/:technicianId/inventory/stock-items
  → PATCH /api/v1/assets/technicians/:technicianId/inventory/:componentId/increase
  → PATCH /api/v1/assets/technicians/:technicianId/inventory/:componentId/decrease
  → DELETE /api/v1/assets/technicians/:technicianId/inventory/:componentId
