import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { encrypt, decrypt, getRandomKey } from './encrypter';

function Link(props) {
	return (<a className='link link-hover link-primary' onClick={props.onClick}>{props.text}</a>);
}

function Input(props) {

	function onChange(event) {
		props.setValue(event.target.value);
		localStorage.setItem('key', event.target.value);
	}

	function generateKey() {
		let randomKey = getRandomKey();
		props.setValue(randomKey);
		localStorage.setItem('key', randomKey);
	}

	return (
		<div className="form-control Responsive-width">
			<label className="label">
				<b className="label-text">Key</b>
				<span className="label-text-alt">
					<Link text='Generate' onClick={generateKey} />
				</span>
			</label>
			<input value={props.value} onChange={onChange} type="text" placeholder="Type here" className="input input-sm md:input-md input-bordered Responsive-width" />
		</div>
	);
}

function TextArea(props) {

	function onChangePlain(event) {
		props.setLastInput(0);
		props.setPlainText(event.target.value);
		props.setEncryptedText(encrypt(event.target.value, props.ekey));
	}
	function onChangeEncrypted(event) {
		props.setLastInput(1);
		props.setEncryptedText(event.target.value);
		props.setPlainText(decrypt(event.target.value, props.ekey));
	}

	return (<div className='Responsive-width'>
		<div className="form-control">
			<label className="label">
				<b className="label-text">{props.title}</b>
				<span className="label-text-alt">
					<div>
						<Link text='Copy ' onClick={() => {
							navigator.clipboard.writeText(props.title == "Plain Text" ? props.plainText : props.encryptedText);
						}} />
						<Link text='Paste' onClick={() => {
							navigator.clipboard.readText().then(text => {
								if (props.title == "Plain Text") {
									props.setPlainText(text);
									props.setEncryptedText(encrypt(text, props.ekey));
								} else {
									props.setEncryptedText(text);
									props.setPlainText(decrypt(text, props.ekey));
								}
							});
						}} />
					</div>
				</span>
			</label>
			<textarea onChange={props.title == "Plain Text" ? onChangePlain : onChangeEncrypted} className="textarea textarea-bordered h-40 leading-normal" placeholder={"Enter your " + props.title.toLowerCase() + " here"} value={props.title == "Plain Text" ? props.plainText : props.encryptedText}></textarea>
		</div>
	</div>);
}

function Navbar() {
	return (
		<div>
			<div className="navbar bg-base-100 flex justify-center">
				<div className='container '>
					<a className="btn btn-ghost normal-case text-xl">Web Encrypter</a>
				</div>
			</div>
			<div className='divider mt-0'></div>
		</div>
	);
}

function Card(props) {
	return (
		<div className='container mx-auto px-2 flex flex-col justify-center items-center'>
			<div className="card Responsive-width bg-base-100 shadow-xl flex items-center">
				<div className="card-body Responsive-width flex items-center">
					{props.children}
				</div>
			</div>
		</div>
	);
}

function App() {

	const [firstRender, setFirstRender] = useState(true);

	const [key, setKey] = useState(getRandomKey());
	const [lastInput, setLastInput] = useState(0);
	const [plainText, setPlainText] = useState("");
	const [encryptedText, setEncryptedText] = useState("");

	useEffect(() => {
		if (firstRender) {
			// Perform the action only on the first render
			let storedKey = localStorage.getItem('key');
			if (storedKey) {
				setKey(storedKey);
			}
			setFirstRender(false);
		}
	}, [firstRender, key, plainText, encryptedText, lastInput]);

	return (
		<div className="App">
			<Navbar />
			<Card>
				<Input value={key} setValue={setKey} />
				<div className='h-1'></div>
				<TextArea title='Plain Text' lastInput={lastInput} setLastInput={setLastInput} plainText={plainText} setPlainText={setPlainText} encryptedText={encryptedText} setEncryptedText={setEncryptedText} ekey={key} />
				<TextArea title='Encrypted Text' lastInput={lastInput} setLastInput={setLastInput} plainText={plainText} setPlainText={setPlainText} encryptedText={encryptedText} setEncryptedText={setEncryptedText} ekey={key} />
			</Card>
		</div>
	);
}

export default App;
