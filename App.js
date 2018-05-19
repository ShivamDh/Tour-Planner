/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	Button,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' +
		'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' +
		'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

	constructor(props) {
		super(props);

		this.state = {
			addresses: ['']
		}
	}

	inputTextChanged = (text, index) => {
		let {addresses} = this.state;
	    addresses[index] = text;

	    this.setState({addresses});
	}

	getAddressInputs = () => {
		return this.state.addresses.map( (text, index) => (
			<View styles = {styles.addressLine} key = {`input_${index}`}>
				<TextInput
					style = {styles.addressInput}
					onChangeText = {(text) => this.inputTextChanged(text, index)}
					value = {text}
				/>
				<Button
					onPress = {() => this.deleteAddress(index)}
					title = "X"
					style = {styles.addressDeleteButton}
					accessibilityLabel = "Delete this address"
				/>
			</View>
		));
	}

	deleteAddress = (index) => {
		let {addresses} = this.state;
		addresses.splice(index, 1);

		this.setState({addresses});
	}

	addAddress = () => {
		this.setState({addresses: [...this.state.addresses, '']});
	}

	render() {
		return (
			<View style={styles.container}>
				{ this.getAddressInputs() }
				<Button
					onPress = {() => this.addAddress()}
					title = "Add Address"
					style = {styles.addressAddButton}
					accessibilityLabel = "Add address"
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	addressLine: {
		flex: 1,
		width: '100%',
		height: 60,
		flexDirection: 'row',
	},
	addressInput: {
		textAlign: 'left',
		maxHeight: 50,
		flex: 0.8,
		borderColor: 'black',
		borderWidth: 2,
		paddingLeft: 10,
		paddingRight: 10,
	},
	addressDeleteButton: {
		flex: 0.2
	},
	addressAddButton: {
		flex: 1
	},

});
