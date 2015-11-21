/**
 * Convert a generator function to a deferred function (promise-based), allowing the use of `yield` within the function
 * to reduce callback nesting. This has evolved to be a thin wrapper around
 * [Bluebird.coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html). It is set up with long-stack-traces
 * and has a simple custom yield-handler to allow it to yield to normal values - as well as promises.
 *
 * This library is similar to [co](https://www.npmjs.com/package/co) and
 * [Q.async](https://github.com/kriskowal/q/tree/v1/examples/async-generators).
 *
 * The original version of this was based on `Q.async` and standard promises. The Bluebird version
 * handles uncaught errors (rejections) better and also supports long stack traces.
 * The 'foo' library simply sets up the defaults a little differently than out-of-the-box Bluebird.
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

	/*
	 * Override the global Promise object.
	 */
	/*jshint -W020 */
	Promise = require( "bluebird" );

	Promise.longStackTraces();
	Promise.coroutine.addYieldHandler( function ( value ) {
		return Promise.resolve( value );
	} );

	/**
	 * Convert a generator function to a deferred function (promise-based), allowing the use of `yield` within the function
	 * to reduce callback nesting.
	 *
	 * @function foo
	 * @param generator The generator function to wrap.
	 * @returns {function.Promise} A function that returns a standard promise. The value of the promise is the return value from the wrapped generator function.
	 */
	module.exports = Promise.coroutine;
} )();