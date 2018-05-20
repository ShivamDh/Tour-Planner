/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
	Button,
	Dimensions,
	ImageBackground,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

var {height, width} = Dimensions.get('window');

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
				<TouchableOpacity
					style = {styles.buttonContainer}
					activeOpacity = {0.9}>
					<Button
						onPress = {() => this.deleteAddress(index)}
						title = "X"
						style = {styles.addressDeleteButton}
						accessibilityLabel = "Delete this address"
						color = "red"
					/>
				</TouchableOpacity>
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
		const backgroundImage = require('./img/appBackground.png');

		return (
			<ScrollView contentContainerStyle = {styles.container}>
				<ImageBackground
					source = {backgroundImage} 
					style = {styles.background}>
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
				</ImageBackground>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
		minHeight: height - 25
	},
	background: {
		width: '100%',
		height: '100%',
		overflow: 'hidden'
	},
	header: {
		color: 'black',
		fontSize: 30,
		fontWeight: '700',
		marginTop: 50,
		marginBottom: 20,
		marginLeft: 30
	},
	description: {
		color: 'black',
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
		marginBottom: 20,
		marginLeft: 30
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
	buttonContainer: {
		marginTop: 7,
		width: 40,
	},
	addressDeleteButton: {
		flex: 1,
	},
	addressAddButton: {
		marginLeft: 100,
		marginRight: 100,
		flex: 1
	},

});
