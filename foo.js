/**
 * Convert a generator function to a deferred function (promise-based), allowing the use of `yield` within the function
 * to reduce callback nesting.
 *
 * This library is similar to [co](https://www.npmjs.com/package/co) and
 * [Q.async](https://github.com/kriskowal/q/tree/v1/examples/async-generators).
 *
 * #### Example
 *
 * This example dumps all the customer documents from the `test.customers` collection.
 *
 *     const listCustomers = foo(function*(){
 *     		const db = yield MongoClient.connect("mongodb://localhost:27017/test");
 *     		try{
 *     			const customers = db.collection("customers");
 *     			const cursor = customers.find();
 *     			try {
 *     				while (yield cursor.hasNext()) {
 *     					const customer = yield cursor.next();
 *     					console.log(customer);
 *     				}
 *     			} finally{
 *     				yield cursor.close();
 *     			}
 *     		}finally{
 *     			yield db.close();
 *     		}
 *     	});
 *
 * You can create a foo-based IFFE to call the function, like this:
 *
 *     (foo(function*(){
 *         "use strict";
 *
 *         yield listCustomers();
 *     })();
 *
 * Inside the generator function, `yield` lets us convert promises to first-class values (with proper error handling).
 * Note that the result of calling a `foo`-wrapped generator function is always a standard promise. That is
 * why we need the `foo` wrapper for our IFFE.
 *
 * @name foo.js
 * @author Jason Smith
 */
( function () {
	"use strict";

	const Q = require( "q" );

	/**
	 * Convert a generator function to a deferred function (promise-based), allowing the use of `yield` within the function
	 * to reduce callback nesting.
	 *
	 * @function foo
	 * @param generator The generator function to wrap.
	 * @returns {function.Promise} A function that returns a standard promise. The value of the promise is the return value from the wrapped generator function.
	 */
	module.exports = function foo( generator ) {
		return function () {
			const fn = Q.async( generator );
			const promise = fn.apply( this, Array.prototype.slice.call( arguments ) );
			return new Promise( function ( resolve, reject ) {
				return promise.then( resolve, reject );
			} );
		};
	};
} )();