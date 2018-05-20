/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	Button,
	Platform,
	ScrollView,
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
			<View style = {styles.addressLine} key = {`input_${index}`}>
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
			<ScrollView contentContainerStyle = {styles.container}>
				<Text style = {styles.header}>
					TourPlanner
				</Text>
				<Text style = {styles.description}>
					Add locations you would like to visit, and find the shortest trip
				</Text>
				<View style = {styles.emptyBox} />
				{ this.getAddressInputs() }
				<Button
					onPress = {() => this.addAddress()}
					title = "Add Address"
					style = {styles.addressAddButton}
					accessibilityLabel = "Add address"
				/>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	header: {
		fontSize: 30,
		fontWeight: '700',
		marginTop: 50,
		marginBottom: 20
	},
	description: {
		fontSize: 20,
		flex: 0.8,
		marginLeft: 30,
		marginRight: 30,
		marginBottom: 15
	},
	addressLine: {
		flex: 1,
		flexDirection: 'row',
		height: 50,
		maxHeight: 50,
		marginBottom: 20
	},
	addressInput: {
		height: 50,
		maxHeight: 50,
		flex: 0.8,
		borderColor: 'black',
		borderWidth: 2,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 20
	},
	addressDeleteButton: {
		width: 50,
		height: 50,
		maxHeight: 50,
		marginTop: 10,
		marginBottom: 10
	},
	addressAddButton: {
		flex: 1
	},

});
