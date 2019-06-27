import { MetaContainer } from '@rebelstack-io/metaflux';
import '../../css/general.css';
import '../../handlers';
import '../../components/input';
import '../../components/viewer';
import '../../components/header';
import '../../components/signup';
import { setPayments } from '../../controllers/firebase';
import { clearPending } from '../../utils';

class YakMainContainer extends MetaContainer {
	// eslint-disable-next-line class-method-use-this
	render () {
		this.content = document.createElement('div');
		this.content.id = 'container';
		this.content.className = 'simple-chatbox';
		this.input = document.createElement('yak-input');
		this.viewer = document.createElement('yak-viewer');
		const header = document.createElement('yak-header');
		this.handleStoreEvents();
		this.content.append(header, this.input, this.viewer);
		this.createSignUpForm();
		return this.content;
	}
	/**
	 * handle store events
	 */
	handleStoreEvents () {
		global.storage.on('TOGGLE-CHAT', this.handleMinEvent.bind(this));
		global.storage.on('SING-UP-REQ', this.handleSignEvent.bind(this));
		global.TPGstorage.on('SALES_APROVED', (action) => {
			setPayments(action.data);
			//clear the msg list
			global.storage.dispatch({
				type: 'FB-CONNECT',
				msgList: clearPending(
					global.storage.getState().Main.list
				)
			});
		})
	}
	/**
	 * @description create the sigup form by default has the class .hide
	 */
	createSignUpForm () {
		const signpup = document.createElement('yak-signup');
		signpup.classList.add('hide');
		global.storage.dispatch({ type: 'SING-ANONYMOUS' })
		this.content.appendChild(signpup);
	}
	/**
	 * @description hadle the toggle chat action
	 */
	handleMinEvent () {
		const isOpen = global.storage.getState().Main.isOpen;
		this.viewer.className = !isOpen ? 'hide' : 'show';
		this.input.className = !isOpen ? 'hide' : 'show';
		this.content.classList.toggle('no-border');
	}
	/**
	 * @description toggle between the sign-up and the message viewver
	 */
	handleSignEvent () {
		this.viewer.classList.toggle('hide');
		this.input.classList.toggle('hide');
		const signup = document.querySelector('yak-signup');
		signup.classList.toggle('hide');
		if (signup.classList.contains('hide')) {
			document.querySelector('.fa.fa-user-secret').className = 'fa fa-user';
		} else {
			document.querySelector('.fa.fa-user').className = 'fa fa-user-secret';
		}
	}
}

window.customElements.define('yak-main-container', YakMainContainer);
