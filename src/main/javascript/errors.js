import ErrorSubclass from 'error-subclass';

class GenericError extends ErrorSubclass
{
  static displayName = 'GenericError'; // optional. survives minification

  constructor(data, ...rest)
  {
    super(...rest);
    this.data = data
  }
}

export { GenericError }

