import {MappableProperty} from './MappableProperty'

function hashCode (s) {
  let h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
}

export class MappablePathProperty extends  MappableProperty
{
  /**
   * @param {String | Object} js
   * @returns {MappablePathProperty}
   */
  static instance(js)
  {
    const data = typeof js === 'string' ? JSON.parse(js) : JSON.parse(JSON.stringify(js));
    return new MappablePathProperty(data)
  }

  /**
   * @param {string} label
   * @param {string} path
   * @param {...*} [props]
   */
  constructor({label, path, ...props}) {
    super({label, path, ...props});
  }

  /**
   * @type {string}
   */
  get path() { return this.props.path; }

  /**
   * @param {{}} object
   * @param {*} defaults
   * @return {*}
   */
  valueOrDefault(object, defaults = null)
  {
    try {
      return this.value(object);
    } catch (e) {
      return defaults
    }
  }

  /**
   * @param {{}} object
   * @return {*}
   */
  value(object)
  {
    const segments = this.path.split('.');
    const reducer = (accumulator, segment) => {

      if (typeof accumulator.value !== 'object' || !accumulator.value) {
        if (accumulator.segments.length) {
          throw new Error('path was not resolved at: ' + accumulator.segments.concat([segment]).join('.'));
        }
        throw new Error('Missing initial value ');
      }

      accumulator.value = accumulator.value[segment];
      accumulator.segments.push(segment);
      return accumulator;
    };

    const { value } = segments.reduce(reducer, { value: object, segments: [] });
    return value;
  }

  equals(other)
  {
    if (other instanceof MappablePathProperty) {
      return other.path === this.path;
    }

    return false;
  }

  /**
   * @return {number}
   */
  hashCode()
  {
    return hashCode(this.path);
  }
}