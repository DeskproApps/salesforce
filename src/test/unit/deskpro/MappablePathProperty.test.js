import { MappablePathProperty } from '../../../main/javascript/deskpro';


test('testValueReturnsExpectedPathProperty', () => {

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

test('testValueReturnsExpectedDefault', () => {

  const property = new MappablePathProperty({ label: "Ticket Owner Email", path: "person_email.email" });
  const context = {
    "id":203,
    "email":"mayer.jeramy@example.net"
  };

  const actual = property.value(context, "mormont");
  expect(actual).toEqual("mormont");
});


