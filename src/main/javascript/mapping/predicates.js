/**
 * @param {SFObject} object
 * @param {ObjectView} view
 * @return {boolean}
 */
export function hasView(object, view)
{
  return object.name === view.object.name;
}

/**
 * @param {SFObject} object
 * @param {ContextMapping} mapping
 * @return {boolean}
 */
export function hasMapping(object, mapping)
{
  return object.name === mapping.object.name;
}