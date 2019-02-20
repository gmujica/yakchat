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
		this.createCloseButton();
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
		icon.className = 'fa fa-user-secret';
		if (type === 0) {
			box.className = 'user-actions-an'
		} else {
			box.className = 'user-actions-re';
			this.createRegisteredActions();
		}
		box.addEventListener('click',() => { 
			this.toggleSing();
		})
		box.append(icon);
		return box;
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
	 * TODO: create an display in the viewer and input areas to sign in
	 * NOTE: there's no need to login, only sign-up because it's would store in
	 * the localstorage and if the user lost his session he has to get a recovery email
	 */
	toggleSing () {
		this.storage.dispatch({ type: 'SING-UP-REQ'});
	}
	
	/**
	 * create the toggle chat
	 */
	createCloseButton () {
		this.closeButton = document.createElement('div')
		this.closeButton.className = 'yak-min-open';
		this.closeButton.addEventListener('click', () => {
			this.closeButton.classList.toggle('yak-min-close');
			this.storage.dispatch({ type: 'TOGGLE-CHAT' })
		})
		this.headerContent.appendChild(this.closeButton);
	}
	/**
	 * Handle Events in a organized way.
	 */
	handleStoreEvents () {
		return {
			'TOGGLE-CHAT': () => {
				this.className = this.storage.getState().Main.isOpen
					? 'header-up'
					: 'header-down';
			}
		};
	}
}

window.customElements.define('yak-header', Header);
