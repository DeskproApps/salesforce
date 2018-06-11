/**
 * @param {ContextDetails} context
 * @param {ContextPropertyList} propertyList
 * @return {boolean}
 */
export function hasPropertyList(context, propertyList)
{
  return context.name === propertyList.context.name;
}