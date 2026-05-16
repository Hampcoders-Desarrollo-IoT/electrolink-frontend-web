import { TechnicianInventory } from '../../domain/entities/technician-inventory.entity.js';
import { InventoryItem } from '../../domain/entities/inventory-item.entity.js';
import { TechnicianInventoryResource } from '../resources/technician-inventory.resource.js';
import { ComponentStockResource } from '../resources/component-stock.resource.js';

export class TechnicianInventoryAssembler {
    /**
     * Maps a TechnicianInventoryResource (from GET /inventory) to a TechnicianInventory entity.
     */
    static toEntityFromResource(resource) {
        if (!resource) return null;
        const stockItems = resource.stockItems ? resource.stockItems.map(item => new InventoryItem({
            id: item.componentStockId,
            technicianInventoryId: '',
            componentId: item.componentId,
            componentName: item.componentName || '',
            quantityAvailable: item.quantityAvailable,
            reservedQuantity: 0,
            alertThreshold: item.alertThreshold,
            lastUpdated: item.lastUpdated
        })) : [];

        return new TechnicianInventory({
            id: '',
            technicianId: resource.technicianId,
            stockItems: stockItems
        });
    }

    /**
     * Maps a flat array of ComponentStockResource (from GET /inventory/stock-items)
     * directly to an array of InventoryItem entities.
     */
    static toEntityListFromStockItems(stockItemsArray) {
        if (!stockItemsArray || !Array.isArray(stockItemsArray)) return [];
        return stockItemsArray.map(item => new InventoryItem({
            id: item.componentStockId,
            technicianInventoryId: '',
            componentId: item.componentId,
            componentName: item.componentName || '',
            quantityAvailable: item.quantityAvailable,
            reservedQuantity: 0,
            alertThreshold: item.alertThreshold,
            lastUpdated: item.lastUpdated
        }));
    }

    static toResourceFromEntity(inventory, componentNames = {}) {
        if (!inventory) return null;
        const stockItems = inventory.stockItems ? inventory.stockItems.map(item => {
            const name = componentNames[item.componentId] || item.componentName || 'Unknown Component';
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
}
