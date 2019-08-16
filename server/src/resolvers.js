const resolvers = {
  Query: {
    items: (_, __, { dataSources }) => dataSources.itemsAPI.getItems(),
    item: (_, { id }, { dataSources }) => dataSources.itemsAPI.getItem({ id }),
    inventoryItems: (_, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItems(),
    inventoryItem: (_, { id }, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItem({ id }),
    dishes: (_, __, { dataSources }) => dataSources.dishesAPI.getDishes(),
    dish: (_, { id }, { dataSources }) => dataSources.dishesAPI.getDish({ id }),
  },

  Mutation: {
    addItem: (_, { name }, { dataSources }) =>
      dataSources.itemsAPI.addItem({ name }),
    deleteItem: (_, { id }, { dataSources }) =>
      dataSources.itemsAPI.deleteItem({ id }),
    addInventoryItem: (
      _,
      { name, addDate, amount, expiration, defaultShelflife },
      { dataSources }
    ) =>
      dataSources.inventoryItemsAPI.addInventoryItem({
        name,
        addDate,
        amount,
        expiration,
        defaultShelflife,
      }),
    updateInventoryItem: (_, { id, addDate, amount, expiration }, { dataSources }) =>
      dataSources.inventoryItemsAPI.updateInventoryItem({
        id,
        addDate,
        amount,
        expiration,
      }),
    deleteInventoryItem: (_, { id }, { dataSources }) =>
      dataSources.inventoryItemsAPI.deleteInventoryItem({ id }),
    addDish: (_, { name, ingredientSets }, { dataSources }) =>
      dataSources.dishesAPI.addDish({ name, ingredientSets }),
  },

  Item: {
    countsAs: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemCountsAs({ itemID: Item.id }),
  },

  InventoryItem: {
    item: (InventoryItem, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItemItem({
        inventoryItemID: InventoryItem.id,
      }),
  },
}

module.exports = resolvers
