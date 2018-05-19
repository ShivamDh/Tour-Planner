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

		addressCount = 1;
		this.addresses = [];
	}

	getAddressInput = (index) => {
		return (
			<View styles = {styles.addressLine}>
				<TextInput
					style = {styles.addressInput}
					ref = {(element) => this.addresses[index] = element}
				/>
				<Button
					onPress = {() => this.deleteAddress(index)}
					title = "X"
					style = {styles.addressDeleteButton}
					accessibilityLabel = "Delete this address"
				/>
			</View>
		);
	}

	deleteAddress = (index) => {
		console.log('delete index: ' + index);
	}

	addAddress = () => {
		
	}

	render() {
		return (
			<View style={styles.container}>
				{ this.getAddressInput(0) }
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
	}

});
