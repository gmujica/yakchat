import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class Header extends MetaComponent {
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super(global.storage);
	}
	// eslint-disable-next-line class-method-use-this
	render () {
		this.headerContent = document.createElement('div');
		this.createHeaderContent();
		return this.headerContent;
	}
	/**
	 * create the header structure
	 */
	createHeaderContent () {
		this.headerContent.className = 'yak-header-items'
		const title = document.createElement('span');
		title.textContent = 'Yak Chat';
		this.headerContent.appendChild(title);
		this.createOptions(this.headerContent)
	}
	/**
	 * function that set the option type
	 * @param {HTMLAreaElement} box 
	 */
	createOptions (box) {
		try {
			switch (this.parentElement.className) {
				case 'simple-chatbox':
					box.appendChild(this.createUserActions(0));
					break;
				case 'register-chatbox':
					box.appendChild(this.createUserActions(1));
					break;
				default:
					break;
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * create the user icon for the users to sing-in/up or logout
	 * @param {Number} type 
	 */
	createUserActions (type) {
		const box = document.createElement('div');
		const icon = document.createElement('i');
		const shoppingIcon = document.createElement('i');
		const closeBtn = document.createElement('i');
		shoppingIcon.className = 'fa fa-shopping-cart'
		icon.className = 'fa fa-user';
		closeBtn.className = 'fa fa-times'
		if (type === 0) {
			box.className = 'user-actions-an'
		} else {
			box.className = 'user-actions-re';
			this.createRegisteredActions();
		}
		icon.addEventListener('click', () => {
			this.toggleSing();
		});
		shoppingIcon.addEventListener('click', () => {
			this.openShoppingCart();
		})
		closeBtn.addEventListener('click', () => {
			this.toggleChat();
		})
		box.append(icon, shoppingIcon, closeBtn);
		return box;
	}
	/**
	 * toggle chat in popup mode
	 */
	toggleChat() {
		document.querySelector('div#yak-chat-embended')
		.classList.toggle('hidden');
	}

	/**
	 * create the options for loged in users
	 */
	createRegisteredActions () {
		let actions;
		if (document.querySelector('.user-options')) {
			actions = document.querySelector('.user-options');
		} else {
			actions = document.createElement('div');
			actions.classList.add('hide', 'user-options', 'green');
			document.querySelector('#container').append(actions);
		}
		const logOut = document.createElement('span');
		logOut.innerHTML = 'Logout';
		actions.append(logOut);
	}
	/**
	 * toggle the options box
	 */
	toggleUserAction (box) {
		const actions = document.querySelector('.user-options')
		actions.style.top = box.offsetHeight + 'px';
		actions.style.left = (box.offsetLeft / 2) + 'px';
		if (actions.classList.contains('hide')) {
			actions.classList.remove('hide')
		} else {
			actions.classList.add('hide');
		}
	}
	/**
	 * toggle the sign in view
	 */
	toggleSing () {
		this.storage.dispatch({ type: 'SING-UP-REQ'});
	}
	/**
	 * open shopping cart view
	 */
	openShoppingCart () {
		try {
			const shoppingCart = document.querySelector('#tepago-area');
			shoppingCart.classList.toggle('hide')
		} catch (err) {
			alert('Bad shoppig cart configuaration');
		}
	}
	/**
	 * Handle Events in a organized way.
	 */
	handleStoreEvents () {
		return {
		};
	}
}

window.customElements.define('yak-header', Header);
