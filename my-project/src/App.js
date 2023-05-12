import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { startEncrpyer } from './encrypter';

function Link(props) {
	return (<a className='link link-hover link-primary' onClick={props.onClick}>{props.text}</a>);
}

function Input(props) {
	return (
		<div className="form-control Responsive-width">
			<label className="label">
				<b className="label-text">Key</b>
				<span className="label-text-alt">
					<Link text='Generate' />
				</span>
			</label>
			<input id='short-input' type="text" placeholder="Type here" className="input input-sm md:input-md input-bordered Responsive-width" />
		</div>
	);
}

function TextArea(props) {
	return (<div className='Responsive-width'>
		<div className="form-control">
			<label className="label">
				<b className="label-text">{props.title}</b>
				<span className="label-text-alt">
					<div>
						<Link text='Copy ' />
						<Link text='Paste' />
					</div>
				</span>
			</label>
			<textarea id={props.id} className="textarea textarea-bordered h-40 leading-normal" placeholder={"Enter your " + props.title.toLowerCase() + " here"}></textarea>
		</div>
	</div>);
}


function Modal() {
	return (
		<div>
			<input type="checkbox" id="my-modal-3" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
					<p id='specialModal' className="py-4"></p>
					<div className="modal-action">
						<button className="btn" id='modalPrev'>Previous</button>
						<button className="btn" id='modalNext'>Next</button>
					</div>
				</div>
			</div>
		</div>
	);

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
	useEffect(() => {
		startEncrpyer();
	}, []);
	return (
		<div className="App">
			<Navbar />
			<Modal />
			<label id='specialModalBtn' htmlFor="my-modal-3" className="btn hidden">open modal</label>
			<Card>
				<Input />
				<div className='h-1'></div>
				<TextArea id="textarea2" title='Plain Text' />
				<TextArea id="textarea1" title='Encrypted Text' />
			</Card>
		</div>
	);
}

export default App;
