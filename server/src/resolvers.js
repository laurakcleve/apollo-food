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
    categories: (_, __, { dataSources }) =>
      dataSources.categoriesAPI.getCategories(),
    itemLocations: (_, __, { dataSources }) =>
      dataSources.itemLocationsAPI.getLocations(),
  },

  Mutation: {
    addItem: (_, { name }, { dataSources }) =>
      dataSources.itemsAPI.addItem({ name }),
    deleteItem: (_, { id }, { dataSources }) =>
      dataSources.itemsAPI.deleteItem({ id }),
    addInventoryItem: (
      _,
      {
        name,
        addDate,
        amount,
        expiration,
        defaultShelflife,
        countsAs,
        category,
        location,
      },
      { dataSources }
    ) =>
      dataSources.inventoryItemsAPI.addInventoryItem({
        name,
        addDate,
        amount,
        expiration,
        defaultShelflife,
        countsAs,
        category,
        location,
      }),
    updateInventoryItem: (
      _,
      { id, addDate, amount, expiration, category },
      { dataSources }
    ) =>
      dataSources.inventoryItemsAPI.updateInventoryItem({
        id,
        addDate,
        amount,
        expiration,
        category,
      }),
    deleteInventoryItem: (_, { id }, { dataSources }) =>
      dataSources.inventoryItemsAPI.deleteInventoryItem({ id }),
    addDish: (_, { name, ingredientSets }, { dataSources }) =>
      dataSources.dishesAPI.addDish({ name, ingredientSets }),
    updateDish: (_, { id, name, ingredientSets }, { dataSources }) =>
      dataSources.dishesAPI.updateDish({ id, name, ingredientSets }),
    deleteDish: (_, { id }, { dataSources }) =>
      dataSources.dishesAPI.deleteDish({ id }),
    addDishDate: (_, { dishID, date }, { dataSources }) =>
      dataSources.dishesAPI.addDishDate({ dishID, date }),
    deleteDishDate: (_, { id }, { dataSources }) =>
      dataSources.dishesAPI.deleteDishDate({ id }),
  },

  Item: {
    countsAs: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemCountsAs({ itemID: Item.id }),
    dishes: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemDishes({ itemID: Item.id }),
    category: (Item, __, { dataSources }) =>
      dataSources.itemsAPI.getItemCategory({ itemID: Item.id }),
  },

  InventoryItem: {
    item: (InventoryItem, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getInventoryItemItem({
        inventoryItemID: InventoryItem.id,
      }),
    location: (InventoryItem, __, { dataSources }) =>
      dataSources.inventoryItemsAPI.getLocation({
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
