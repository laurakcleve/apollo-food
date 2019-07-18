const resolvers = {
  Query: {
    items: (_, __, { dataSources }) => dataSources.itemsAPI.getItems(),
    item: (_, { id }, { dataSources }) => dataSources.itemsAPI.getItem({ id }),
    inventoryItems: (_, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItems(),
    inventoryItem: (_, { id }, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItem({ id }),
  },

  Mutation: {
    addItem: (_, { name }, { dataSources }) =>
      dataSources.itemsAPI.addItem({ name }),
    deleteItem: (_, { id }, { dataSources }) =>
      dataSources.itemsAPI.deleteItem({ id }),
    addInventoryItem: (_, { name }, { dataSources }) =>
      dataSources.inventoryItemsAPI.addInventoryItem({ name }),
    deleteInventoryItem: (_, { id }, { dataSources }) =>
      dataSources.inventoryItemsAPI.deleteInventoryItem({ id }),
  },

  InventoryItem: {
    item: (InventoryItem, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItemItem({
        inventoryItemID: InventoryItem.id,
      }),
  },
}

module.exports = resolvers
