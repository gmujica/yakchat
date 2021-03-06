import { MetaComponent } from '@rebelstack-io/metaflux';
import './index.css';

class EditChannel extends MetaComponent {
	
	/**
	 * MetaComponent constructor needs storage.
	 */
	constructor () {
		super(global.storage);
	}

	get domain() {
		return this.querySelector('#domain').value;
	}

	get channelName() {
		return this.querySelector('#channel-name').value;
	}

	set domain (domain) {
		this.querySelector('#domain').value = domain;
	}

	set channelName(chnName) {
		this.querySelector('#channel-name').value = chnName;
	}

	set embendCode (code) {
		this.querySelector('#embend-code').value = code;
	}

	set embendTag (code) {
		this.querySelector('#embend-tag').value = code;
	}
	/**
	 * add DOM listener
	 */
	addListeners() {
		const embendInput = this.querySelector('#embend-code');
		const embendTag = this.querySelector('#embend-tag');
		this.querySelector('#update-channel')
		.addEventListener('click', () => {
			this.querySelector('#channel-popup-container').classList.add('loading');
			this.handleSend(this.channelName, this.domain);
		});
		this.querySelector('#close-channel')
		.addEventListener('click', () => {
			this.querySelector('#channel-popup-container').classList.add('hide');
		});
		embendInput.addEventListener('click', () => {
			embendInput.select();
			/* Copy the text inside the text field */
			document.execCommand("copy");
			const value = embendInput.value;
			embendInput.value = 'copied to the clipboard';
			setTimeout(() => {
				embendInput.value =  value;
			}, 400);
		});
		embendTag.addEventListener('click', () => {
			embendTag.select();
			/* Copy the text inside the text field */
			document.execCommand("copy");
			const value = embendTag.value;
			embendTag.value = 'copied to the clipboard';
			setTimeout(() => {
				embendTag.value =  value;
			}, 400);
		});
	}

	render () {
		return `
		<div id="channel-popup-container" class="profile-popup-container hide">
			<div id="channel-popup">
				<div class="profile-title">
					<div>Edit channel</div>
					<span id="close-channel">X</span>
				</div>
				<input type="text" placeholder="channel name" id="channel-name"/>
				<input type="text" placeholder="change domain" id="domain"/>
				<input type="text" placeholder="Embend code" id="embend-code" readonly/>
				<input type="text" id="embend-tag" readonly />
				<div class="btn primary" id="update-channel">Save</div>
			</div>
		</div>
		`;
	}

	handleSend (channel, domain) {
		const uid = localStorage.getItem('fb-hash');
		global.storage.dispatch({
			type: 'UPDATE-CHANNEL', 
			data : {
				channel, domain, uid
			}
		});
	}

	handleStoreEvents () {
		return {
			'CHANNEL-SELECT': (action) => {
				this.domain = action.data.domain;
				this.channelName = action.data.channel;
				this.embendCode = `<script src="https://www.gstatic.com/firebasejs/5.8.4/firebase.js"></script><script src="https://rebelstackio.github.io/yakchat/frontscript.js"></script>`;
				this.embendTag = `<div id="yak-chat-embended"><!-- the chat will be generated inside this --></div>`
			},
			'CHANNEL-CHANGED': () => {
				this.querySelector('#channel-popup-container').classList.remove('loading');
			}
		}
	}
}

window.customElements.define('yak-editchannel', EditChannel);
