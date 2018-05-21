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
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

var {height, width} = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {

	constructor(props) {
		super(props);

		this.state = {
			addresses: [''],
			returnSameLocation: false,
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

	toggleSwitch = (i) => {
		this.setState({returnSameLocation: !this.state.returnSameLocation});
	}

	getReturnSameLocationValue = () => {
		let val = this.state.returnSameLocation ? 'True' : 'False';

		return (
			<Text>
				{val}
			</Text>
		);
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
					<View style = {styles.switchContainer}>
						<Switch
							style = {styles.switch}
							value = {this.state.returnSameLocation}
							onValueChange = {this.toggleSwitch}
						/>
						<Text style = {styles.switchText}>
							Return to the same location:
						</Text>
						{this.getReturnSameLocationValue()}
					</View>
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
		color: '#1e1e1e',
		fontSize: 30,
		fontWeight: '700',
		marginTop: 50,
		marginBottom: 20,
		marginLeft: 30
	},
	description: {
		color: '#1e1e1e',
		fontSize: 20,
		flex: 0.8,
		marginLeft: 30,
		marginRight: 30,
		marginBottom: 15
	},
	switchContainer: {
		flex: 1,
	},
	switch: {
		flex: 0.1
	},
	switchText: {
		flex: 0.8
	},
	switchVal: {
		flex: 0.1
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
		borderColor: '#1e1e1e',
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
