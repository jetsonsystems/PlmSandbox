'use strict';
var 
	 _     = require('underscore')
	,Faker = require('Faker')
	,fmt   = require('sprintf-js').sprintf
	,fs    = require('fs')
	,uuid  = require('node-uuid')
;
_.str = require('underscore.string');

var 
	out = {}
	, numRecords = 10
	, outFile = 'out.json'
	, email_types = ['Personal', 'Personal 2', 'Work', 'Work 2', 'Family', 'Email1', 'Email2']
	, phone_types = ['Home', 'Office', 'Work', 'Mobile', 'Mobile 2', 'Fax', 'Pager']
	, address_types = ['Home', 'Office', 'Billing']
	, domain_suffix = ['com','net','org','nl','us']
	, work_title = ['Consultant', 'Software Engineer', 'Designer', 'Manager', 'CEO', 'CFO', 'COO', 'Artist', 'Trainer', 'Plumber', 'Contractor', 'Electrician', 'Spiritual Guide']
	, groups = ['Personal', 'Business']
;

function createJetsonUser() {
	var areaCode = 100 + Math.floor(Math.random() * 899);

	var numEmails  = 1 + Faker.random.number(3);
	var numPhone   = 1 + Faker.random.number(2);
	var numAddress = 1 + Faker.random.number(2);
	var numGroups  = Faker.random.number(3);

	// console.log("numEmails is:'%s'", numEmails);
	var i = 0;

	var user = {
		uid: "User:" + uuid.v4()
		,name: {
			givenName:	 Faker.Name.firstName()
			,familyName: Faker.Name.lastName()
		}
		,emails: []
		,phoneNumbers: []
		,addresses: []
		,organizations: []
		,groups: []
	};

	// map to keep track of (email/phone/address types used)
	var types_used = {Work: 1};

	for (i = 0; i < numEmails; i++) {
		var email = {};
		var domain = fmt("%s.%s", Faker.Lorem.words(1), Faker.random.array_element(domain_suffix));

		if (i === 0)  {
			email.value = fmt("%s%s@%s", user.name.givenName.substring(0,1), user.name.familyName, domain).toLowerCase();
			email.primary = true;
			email.type    = "Work";
		}

		if (i > 0) {
			email.value = fmt("%s.%s@%s", Faker.Lorem.words(1), Faker.Lorem.words(1), domain);
			email.type = Faker.random.array_element(email_types);

			// check that the type is not already in use, and retry until we find an unused one
			while (types_used[email.type]) {
				email.type = Faker.random.array_element(email_types);
			}
		}

		types_used[email.type] = 1;

		user.emails.push(email);
	}

	types_used = {};
	for (i = 0; i < numPhone; i++) {
		var phone = {
			value: areaCode + Faker.Helpers.replaceSymbolWithNumber("-###-####")
			,type: Faker.random.array_element(phone_types)
		};

		// check that the type is not already in use, and retry until we find an unused one
		while (types_used[phone.type]) {
			phone.type = Faker.random.array_element(phone_types);
		}

		types_used[phone.type] = 1;
		user.phoneNumbers.push(phone);
	}

	types_used = {};
	for (i = 0; i < numAddress; i++) {
		var address = {
			type: Faker.random.array_element(address_types)
			,streetAddress: Faker.Address.streetAddress()
			,locality: Faker.Address.city()
			,region: Faker.Address.usState()
			,postalCode: Faker.Address.zipCode()
			,country: "United States"
		};

		if (i === 0)  {
			address.primary = true;
		}

		// check that the type is not already in use, and retry until we find an unused one
		while(types_used[address.type]) {
			address.type = Faker.random.array_element(address_types);
		}

		types_used[address.type] = 1;

		user.addresses.push(address);
	}

	user.organizations[0] = {
		name:	_.str.capitalize(Faker.Lorem.words(1)) + ", Inc."
		,title: Faker.random.array_element(work_title)
	};

	for (i=0; i < numGroups; i++) {
		var group = Faker.random.array_element(groups);
		// console.log('proposed group', group)
		while( user.groups.length < 2 && _.contains(user.groups, group)) {
			// console.log('group exists, retrying', group);
			group = Faker.random.array_element(groups);
		}
		// console.log('adding to group', group);
		user.groups.push(group);
	}


	return user;
}

for (var i=0; i < numRecords; i++) {
	var user = createJetsonUser();
	var uid = user.uid;
	delete user.uid;
	out[uid] = user;
}

fs.writeFile(outFile, "'use strict';\n\nmodule.exports = " + JSON.stringify(out, null, '\t') + ";", function() {
	console.log("done!");
});

// vim: set noexpandtab ts=2 sw=2 :
