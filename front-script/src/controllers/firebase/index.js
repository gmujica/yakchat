import * as firebase from 'firebase';
import { getClientInfo } from '../../utils';

/**
 * for testing and string size comparations
 */
String.prototype.lengthInUtf8Bytes = function() {
	// Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
	var m = encodeURIComponent(this).match(/%[89ABab]/g);
	return this.length + (m ? m.length : 0);
}

const app = firebase.initializeApp({ 
	apiKey: process.env.FB_APIKEY,
	authDomain: process.env.FB_AUTHDOMAIN,
	databaseURL: process.env.FB_DATABASEURL,
	projectId: process.env.FB_PROJECTID,
	storageBucket: process.env.FB_STORAGEBUCKET,
	messagingSenderId: process.env.FB_PROJECTID
});

const channel = 'testing';
var functions = app.functions();
/**
 * the reason of this is to map the message into an object,
 * to avoid repeat the keys of the object in each child,
 * SEE: objectCompress(), objectDecompress()
 */
const msgPreset = ['type', {from: ['name']}, 'msg', 'date'];
const newPreset = ['date', 'message', 'by'];
let threadRoute = '';

app.auth().onAuthStateChanged(function(user) {
	try {
		console.log('Connected',user.uid);
	} catch (er) {
		// ...
	}
});
/**
 * @description function for sing up with your email address, then stablish connection
 * @param {String} email
 * @param {String} iniMsg
 * @param {String} name
 */
export function singUpWithEmail (email, name, iniMsg) {
	const hash = email.md5Encode();
	const createThread = functions.httpsCallable('crateThread');
	createThread({
		id: hash, 
		type: name,
		iniMsg: iniMsg,
		email: email,
		channel: channel
	}).then(v => {
		if (v.data) {
			localStorage.setItem('yak-hash', hash);
			getMessages(hash);
			global.storage.dispatch({ type: 'SING-UP-REQ' })
		}
	})
}
/**
 * TODO: stablish an user email connection
 * @description function that stablish an user email connection with firebase
 * @param {String} email
 */
export function signInWithEmail (email) {
	throw 'NOT-IMPLEMENTED';
}
/**
 * @description function that stablish an anonymous connection with firebase
 */
export async function signInAnonymous () {
	try {
		await app.auth().signInAnonymously();
		let hash = '';
		if (lsTest() && localStorage.getItem('yak-hash')) {
			hash = localStorage.getItem('yak-hash');
		} else {
			hash = await getClientInfo();
			localStorage.setItem('yak-hash', hash);
		}
		getMessages(hash);
	} catch {
		//
	}
}
/**
 * TODO: make this function to be compatible with singin users
 * @description get the messages and dispatch it
 * @param {String} route the firebase message route
 * @param {String} hash MD5 hash 
 */
function getMessages (hash) {
	try {
		app.database().ref('/messages/').once('value').then(res => {
			let b = true;
			res.forEach(child => {
				const keys = atob(child.key).split(':');
				if (keys[0] === channel && keys[1] === hash) {
					threadRoute = '/messages/' + child.key;
					listenRow(threadRoute);
					getMsgArray(threadRoute).then(res => {
						global.storage.dispatch({
							type: 'FB-CONNECT',
							msgList: res
						})
					})
					b = false;
				}
			});
			if (b) {
				const createThread = functions.httpsCallable('crateThread');
				createThread({
					id: hash, type:'anonymous',
					iniMsg:undefined,
					email: undefined,
					channel: channel
				}).then(v => {
					console.log(v);
				})
			}
		})
	} catch {
		///
	}
}
/**
 * @description listen to changes in database with the current thread
 * @param {String} route 
 */
function listenRow (route) {
	app.database().ref(route).limitToLast(1).on('child_added', function(snapshot) {
		global.storage.dispatch({
			type: 'MSG-ARRIVE',
			msg: objectDecompress(snapshot.val(), newPreset)
		})
	 });
}
/**
 * function util to transform the object into an array
 * @param {String} msg route to the messages
 */
async function getMsgArray (msg) {
	const response = [];
	try {
		const resp = await app.database()
		.ref(msg)
		.once('value');
		resp.forEach(message => {
			const val = objectDecompress(message.val(), newPreset);
			response.push(val);
		});
	return response;
	} catch {
		//
	}
}
/**
 * TODO: public send message function
 */
export function send (msg) {
	if (threadRoute !== '') {
		const t = objectCompress(msg);
		app.database().ref(threadRoute)
		.push()
		.set(t)
		.catch(err => {
			console.log(err);
		});
	}
}
/**
 * turn Object into an formated plain text, Only support one child
 * @returns String
 * @param {Object} t 
 */
function objectCompress (t) {
	const resp = []
	Object.keys(t).forEach(key => {
		let pairs = "";
		if (typeof t[key] === 'object') {
			pairs = objectCompress(t[key]).split(',').join(':');
		} else {
			pairs = t[key];
		}
		resp.push(pairs);
	})
	return resp.join(',');
}
/**
 * turn plain formated text into an object, Only support one child
 * @returns Object
 * @param {String} s
 * @param {Array} preset the keys for the object 
 */
function objectDecompress (s, preset) {
	let resp = {};
	s.split(',').forEach((value, i) => {
		if (typeof preset[i] === 'object') {
			Object.keys(preset[i]).forEach(key => {
				resp[key] = {};
				value.split(':').forEach((properties, j) => {
					resp[key][preset[i][key][j]] = properties;
				})
			})
		} else {
			resp[preset[i]] = value;
		}
	})
	return resp;
}
/**
 * @description util function to make a localStorage test
 */
function lsTest() {
	var test = 'test';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}
}