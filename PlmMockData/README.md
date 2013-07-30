PlmMockData
==========

This package can be used to generate large amounts of json entities representing Plm entities, for
example to mock a service before it is implemented in the back-end, or for generating mock data for
integration testing.

To run:

  $ npm install
  $ node index.js

This will generate an out.json file with Contact data, in a node format.  The package should be
enhanced so that it can generate other entities, and so that it can be provided a configuration file
with the parameters to be used to generate the mock data desired (type of entity, number of records,
fake data definition list, etc...)
