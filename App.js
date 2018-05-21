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

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { GOOGLE_API_KEY } from '../GoogleCredentials.js'

var {height, width} = Dimensions.get('window');

type Props = {};
export default class App extends Component<Props> {

	constructor(props) {
		super(props);

		this.state = {
			addresses: [''],
			returnSameLocation: false,
		};
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
					onPress = {() => this.deleteAddress(index)}
					activeOpacity = {0.5} >
					<Text style={styles.addressDeleteButton}> X </Text>
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
			<Text style = {styles.switchVal}>
				{val}
			</Text>
		);
	}

	render() {
		console.log('rerender');
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
						Add locations you would like to visit, to find the shortest trip
					</Text>
					<View style = {styles.switchContainer}>
						<Switch
							style = {styles.switch}
							value = {this.state.returnSameLocation}
							onValueChange = {this.toggleSwitch}
						/>
						<Text style = {styles.switchText}>
							Return to the same location: &nbsp;
						</Text>
						{this.getReturnSameLocationValue()}
					</View>
					<View style = {styles.emptyBox} />
					{ this.getAddressInputs() }
					<TouchableOpacity
						activeOpacity = {0.5}
						onPress = {() => this.addAddress()}
						style = {styles.addressAddContainer}>
						<Text style = {styles.addressAddButton}> ADD ADDRESS </Text>
					</TouchableOpacity>
					
					

					<GooglePlacesAutocomplete
						placeholder='Search'
						minLength={2}
						autoFocus={false}
						returnKeyType={'search'} 
						listViewDisplayed='auto'    // true/false/undefined
						fetchDetails={true}
						renderDescription={row => row.description} // custom description render
						onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
							console.log(data, details);
						}}
						currentLocation={false}
						query={{
							// available options: https://developers.google.com/places/web-service/autocomplete
							key: GOOGLE_API_KEY,
							language: 'en', // language of the results
							types: '' // default: 'geocode'
						  }}
						styles={{
							textInputContainer: {
								width: '70%'
							}
						}}
						nearbyPlacesAPI='GoogleReverseGeocoding'
						filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
						debounce={250}
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
		marginLeft: 30,
		marginRight: 15,
		marginBottom: 15
	},
	switchContainer: {
		flexDirection: 'row',
		width: '100%',
		marginLeft: 30,
		marginRight: 15,
		marginBottom: 15,
		height: 40,
		alignItems: 'center',
	},
	switch: {
		marginRight: 10
	},
	switchText: {
		marginTop: -2,
		fontSize: 15,
		color: '#1e1e1e',
	},
	switchVal: {
		color: '#1e1e1e',
		marginTop: -2,
		fontSize: 15,
		fontWeight: 'bold'
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
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red',
		marginTop: 7,
		width: 37,
		height: 37,
		borderRadius: 5,
	},
	addressDeleteButton: {
		color: 'white',
		fontSize: 16,
		fontWeight: '900',
	},
	addressAddContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 30,
		marginRight: 45,
		marginBottom: 20,
		backgroundColor: '#2080DF',
		height: 35,
		borderRadius: 10
	},
	addressAddButton: {
		color: 'white',
		fontSize: 16,
		fontWeight: '900',
	},

});
