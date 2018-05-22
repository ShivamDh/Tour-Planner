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

import GOOGLE_CREDENTIALS from './GoogleCredentials';

var {height, width} = Dimensions.get('window');

type Props = {};

export default class App extends Component<Props> {

	constructor(props) {
		super(props);

		this.state = {
			addresses: [],
			returnToStart: false,
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
				<GooglePlacesAutocomplete
					placeholder='Search'
					minLength={2}
					autoFocus={false}
					returnKeyType={'search'} 
					listViewDisplayed='auto'
					fetchDetails={true}
					renderDescription={row => row.description}
					onPress={(data, details = null) => {
						console.log(data, details);
					}}
					currentLocation={false}
					query={{
						key: GOOGLE_CREDENTIALS.key,
						language: 'en', 
						types: ''
					  }}
					styles={{
						textInputContainer: {
							flex: 1,
							marginRight: 15
						}
					}}
					nearbyPlacesAPI='GoogleReverseGeocoding'
					filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
					debounce={250}
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
		this.setState({returnToStart: !this.state.returnToStart});
	}

	getreturnToStartValue = () => {
		let val = this.state.returnToStart ? 'True' : 'False';

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
							value = {this.state.returnToStart}
							onValueChange = {this.toggleSwitch}
						/>
						<Text style = {styles.switchText}>
							Return to the same location: &nbsp;
						</Text>
						{this.getreturnToStartValue()}
					</View>
					<View style = {styles.emptyBox} />
					{ this.getAddressInputs() }
					<TouchableOpacity
						activeOpacity = {0.5}
						onPress = {() => this.addAddress()}
						style = {styles.addressAddContainer}>
						<Text style = {styles.addressAddButton}> ADD ADDRESS </Text>
					</TouchableOpacity>
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
		marginLeft: 30,
		marginRight: 30
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
