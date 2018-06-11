


export class Contexts
{
  /**
   * @param {ContextDetails} context
   * @param {ContextPropertyList} propertyList
   * @return {boolean}
   */
  static hasContextPropertyList(context, propertyList)
  {
    return context.name === propertyList.context.name;
  }

    /**
     * @param {ContextDetails} context
     * @param {Array<ContextPropertyList>} propertyLists
     * @return {Array<MappableProperty>}
     */
  static findContextProperties(context, propertyLists)
  {
    /**
     * @type {ContextPropertyList | undefined}
     */
    const list = propertyLists.filter(list => Contexts.hasContextPropertyList(context, list)).pop();
    if (list) {
      return list.properties
    }
    return []
  }
}