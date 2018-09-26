import {MappableProperties, MappablePathProperty, MappableProperty} from '../../../src/deskpro';

class UnknownProperty extends MappableProperty
{}

test('test MappableProperties.toJSON serializes MappablePathProperty', () => {

  const props = { label: "Ticket Owner Email", path: "person_email.email" }
  const expected = {
      type: MappableProperties.TYPE_PATH_PROPERTY,
      property: new MappablePathProperty(props).toJSON()
  };

  const actual = MappableProperties.toJSON(new MappablePathProperty(props));
  expect(actual).toEqual(expected);
});

test('test MappableProperties.parse returns MappablePathProperty', () => {

  const props = { label: "Ticket Owner Email", path: "person_email.email" }
  const actual = MappableProperties.parse({
    type: MappableProperties.TYPE_PATH_PROPERTY,
    property: new MappablePathProperty(props).toJSON()
  });

  const expected = new MappablePathProperty(props);
  expect(actual.toJSON()).toEqual(expected.toJSON());
});

test('test MappableProperties.parse throws `unknown property type` error', () => {

  const props = { label: "Ticket Owner Email", path: "person_email.email" }
  const input = {
    type: 'unknown property',
    property: new MappablePathProperty(props).toJSON()
  };

  expect(() => {
    MappableProperties.parse(input)
  }).toThrow();

  expect(() => {
    MappableProperties.parse(JSON.stringify(input))
  }).toThrow();

});

test('test MappableProperties.toJSON throws `unknown property type` error', () => {

  const props = { label: "Ticket Owner Email", path: "person_email.email" };

  expect(() => {
    MappableProperties.toJSON(new UnknownProperty(props))
  }).toThrow();
});
