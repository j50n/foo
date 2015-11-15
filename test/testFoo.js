/**
 * `foo` is a wrapper around `Q.async` that adapts the promise type to standard promises.
 * This set of tests verifies all the common use cases, including:
 *
 * * Yielding values not wrapped in promises; synchronous
 * * Yielding values wrapped in promises; both synchronous and asynchronous
 * * Proper handling of thrown errors due to a rejected promise through a yield
 * * The result of calling a foo-wrapped function is a Bluebird promise, not a Q promise.
 *
 * I wanted to make sure that this version behaves *exactly* the way we expect it to.
 * No more surprises!
 *
 * @name testFoo.js
 * @author Jason Smith
 */
( function () {
	"use strict";

	const foo = require( "../foo" );
	const test = require( "duct-tape" );

	/*!
	 * Give back the value, asynchronously.
	 * @param value The value to return.
	 * @returns {Promise} The value.
	 */
	function belay( value ) {
		return new Promise(
			function ( resolve ) {
				process.nextTick( function () {
					resolve( value );
				} );
			}
		);
	}

	/*!
	 * Reject with the given error, asynchronously.
	 * @param error The error to reject with.
	 * @returns {Promise} The error.
	 */
	function belayError( error ) {
		return new Promise(
			function ( resolve, reject ) {
				process.nextTick( function () {
					reject( error );
				} );
			}
		);
	}

	test( "Verify that various non-promise types are passed back correctly.", foo( function* ( t ) {
		t.strictEqual( yield undefined, undefined, "If undefined, should return undefined." );
		t.strictEqual( yield null, null, "If null, should return null." );
		t.strictEqual( yield 3, 3, "If Integer, should return same Integer value." );
		t.strictEqual( yield "Hello", "Hello", "If String, should return back same String value." );
		t.deepEqual( yield {
			value: 1
		}, {
			value: 1
		}, "If Object, should return back same Object." );
		t.deepEqual( yield [ 1, 2, 3 ], [ 1, 2, 3 ], "If Array, should return back same Array." );
	} ) );

	test( "Verify that various immediate Promise types (synchronous) are passed back correctly.", foo( function* ( t ) {
		t.strictEqual( yield Promise.resolve( undefined ), undefined, "If undefined promise, should return undefined." );
		t.strictEqual( yield Promise.resolve( null ), null, "If null promise, should return null." );
		t.strictEqual( yield Promise.resolve( 3 ), 3, "If Integer promise, should return same Integer value." );
		t.strictEqual( yield Promise.resolve( "Hello" ), "Hello", "If String promise, should return back same String value." );
		t.deepEqual( yield Promise.resolve( {
			value: 1
		} ), {
			value: 1
		}, "If Object promise, should return back same Object." );
		t.deepEqual( yield Promise.resolve( [ 1, 2, 3 ] ), [ 1, 2, 3 ], "If Array promise, should return back same Array." );
	} ) );

	test( "Verify that various Promise types (asynchronous) are passed back correctly.", foo( function* ( t ) {
		t.strictEqual( yield belay( undefined ), undefined, "If undefined async promise, should return undefined." );
		t.strictEqual( yield belay( null ), null, "If null async promise, should return null." );
		t.strictEqual( yield belay( 3 ), 3, "If Integer async promise, should return same Integer value." );
		t.strictEqual( yield belay( "Hello" ), "Hello", "If String async promise, should return back same String value." );
		t.deepEqual( yield belay( {
			value: 1
		} ), {
			value: 1
		}, "If Object async promise, should return back same Object." );
		t.deepEqual( yield belay( [ 1, 2, 3 ] ), [ 1, 2, 3 ], "If Array async promise, should return back same Array." );
	} ) );

	test( "Verify that I can catch an error that is the result of a rejected promise.", foo( function* ( t ) {
		try {
			yield belayError( new Error( "Expected error." ) );
			t.fail( "Expected thrown exception." );
		}
		catch ( e ) {
			t.ok( e instanceof Error, "Caught expected error." );
		}
	} ) );

	test( "Verify that I can nest functions with normal values.", foo( function* ( t ) {
		const a = foo( function* a( value ) {
			/*! dummy yield, since at least one yield is required in a generator. */
			yield null;
			return value;
		} );

		t.strictEqual( yield a( 42 ), 42, "Using 'yield' turns this into a normal value." );
	} ) );
} )();