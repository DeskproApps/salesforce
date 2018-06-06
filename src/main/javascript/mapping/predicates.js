/**
 * @param {SFObject} object
 * @param {ObjectView} view
 * @return {boolean}
 */
export function hasView(object, view)
{
  console.log('has hasView', object, view, view.object)
  return object.name === view.object.name;
}

/**
 * @param {SFObject} object
 * @param {ContextMapping} mapping
 * @return {boolean}
 */
export function hasMapping(object, mapping)
{
  console.log('has mapping', object, mapping, mapping.object)
  return object.name === mapping.object.name;
}