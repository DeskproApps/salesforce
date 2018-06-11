import { MappablePathProperty } from '../../../main/javascript/deskpro';


test('testValueReturnsExpectedValue', () => {

  const property = new MappablePathProperty({ label: "Ticket Owner Email", path: "person_email.email" });
  const context = {
    "person_email": {
      "id":203,
      "email":"mayer.jeramy@example.net"
    }
  };

  const actual = property.value(context, null);
  expect(actual).toEqual("mayer.jeramy@example.net");

});
