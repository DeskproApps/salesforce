/**
 * @param {ContextDetails} context
 * @return {function(ContextPropertyList): boolean}
 */
export function contextHasPropertyList(context)
{
  /**
   * @param {ContextPropertyList}  propertyList
   * @return {boolean}
   */
  function hasPropertyList(propertyList)
  {
    return context.name === propertyList.context.name;
  }

  return hasPropertyList
}