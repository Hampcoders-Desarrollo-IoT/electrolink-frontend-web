import { TechnicianInventory } from '../../domain/entities/technician-inventory.entity.js';
import { InventoryItem } from '../../domain/entities/inventory-item.entity.js';
import { TechnicianInventoryResource } from '../resources/technician-inventory.resource.js';
import { ComponentStockResource } from '../resources/component-stock.resource.js';

export class InventoryAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        const stockItems = resource.stockItems ? resource.stockItems.map(item => new InventoryItem({
            id: item.componentStockId,
            technicianInventoryId: '', // Usually filled by the parent resource if needed
            componentId: item.componentId,
            quantityAvailable: item.quantityAvailable,
            reservedQuantity: 0, // Not provided in the simple stock resource
            alertThreshold: item.alertThreshold,
            lastUpdated: item.lastUpdated
        })) : [];

        return new TechnicianInventory({
            id: '', // TechnicianInventory ID might not be in the flat resource
            technicianId: resource.technicianId,
            stockItems: stockItems
        });
    }

    static toResourceFromEntity(inventory, componentNames = {}) {
        if (!inventory) return null;
        const stockItems = inventory.stockItems ? inventory.stockItems.map(item => {
            const name = componentNames[item.componentId] || "Unknown Component";
            return new ComponentStockResource({
                componentStockId: item.id,
                componentId: item.componentId,
                componentName: name,
                quantityAvailable: item.quantityAvailable,
                alertThreshold: item.alertThreshold,
                lastUpdated: item.lastUpdated
            });
        }) : [];

        return new TechnicianInventoryResource({
            technicianId: inventory.technicianId,
            stockItems: stockItems
        });
    }

    static toAddStockCommandFromResource(resource, technicianId) {
        if (!resource) return null;
        return {
            technicianId: technicianId,
            componentId: resource.componentId,
            quantity: resource.quantity,
            alertThreshold: resource.alertThreshold
        };
    }
}
