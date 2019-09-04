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
      { name, addDate, amount, expiration, defaultShelflife, countsAs },
      { dataSources }
    ) =>
      dataSources.inventoryItemsAPI.addInventoryItem({
        name,
        addDate,
        amount,
        expiration,
        defaultShelflife,
        countsAs,
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
    addDishDate: (_, { dishID, date }, { dataSources }) =>
      dataSources.dishesAPI.addDishDate({ dishID, date }),
  },

  Item: {
    countsAs: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemCountsAs({ itemID: Item.id }),
    dishes: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemDishes({ itemID: Item.id }),
  },

  InventoryItem: {
    item: (InventoryItem, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItemItem({
        inventoryItemID: InventoryItem.id,
      }),
  },

  Dish: {
    ingredientSets: (Dish, __, { dataSources }) =>
      dataSources.dishesAPI.getDishIngredientSets({ dishID: Dish.id }),
    dates: (Dish, __, { dataSources }) =>
      dataSources.dishesAPI.getDishDates({ dishID: Dish.id }),
  },

  IngredientSet: {
    ingredients: (IngredientSet, __, { dataSources }) =>
      dataSources.dishesAPI.getIngredientSetIngredients({
        ingredientSetID: IngredientSet.id,
      }),
  },

  Ingredient: {
    item: (Ingredient, __, { dataSources }) =>
      dataSources.dishesAPI.getIngredientItem({ ingredientID: Ingredient.id }),
  },
}

module.exports = resolvers
