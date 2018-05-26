import React, { Component } from 'react';
import {
	Alert,
	Button,
	Dimensions,
	ImageBackground,
	Keyboard,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import MapsDistance from './MapsDistance'

import GOOGLE_CREDENTIALS from './GoogleCredentials';

var {height, width} = Dimensions.get('window');

type Props = {};

export default class App extends Component<Props> {

	constructor(props) {
		super(props);

	    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

		this.state = {
			addresses: ['', '', ''],
			returnToStart: false,
			listDisplayed: -1,
			routeData: [],
			route: ""
		};

		this.addressInputs = [];
	}

	componentWillUnmount () {
		this.keyboardDidHideListener.remove();
	}

	keyboardDidHide = () => {
		if (this.state.listDisplayed === -1) {
			return;
		}

		// open up list view from the Google Autocomplete Input
		this.addressInputs[this.state.listDisplayed].state.listViewDisplayed = false;

		this.setState({listDisplayed: -1});
	}

	addressChosen = (index, data) => {
		let {addresses} = this.state;
		addresses[index] = data.description;

		// close the list, no results shown if selection is picked
		this.setState({addresses, listDisplayed: -1});
	}

	getAddressLineStyling = (index) => {
		return this.state.listDisplayed === index ?
			[styles.addressLine, styles.expandedAddressLine] :
			[styles.addressLine];
	}

	inputFocused = (index) => {
		// open up list view, trigger the state manually
		this.addressInputs[index].state.listViewDisplayed = true;

		this.setState({listDisplayed: index});
	}

	inputChanged = (text, index) => {
		let {addresses} = this.state;
		addresses[index] = text;
		
		this.setState({addresses, listDisplayed: index});
	}

	getAutoCompleteStyling = () => {
		return {
			textInputContainer: {
				flex: 1,
				marginRight: 15,
				backgroundColor: 'transparent',
			    borderTopWidth: 0,
			    borderBottomWidth: 0,
			    flexDirection: 'row',
			    height: 35,
			    maxHeight: 35,
			},
			textInput: {
				color: 'white',
			    backgroundColor: '#afafaf',
			    height: 35,
				maxHeight: 35,
			    borderRadius: 5,
			    paddingTop: 0,
			    paddingBottom: 0,
			    paddingLeft: 10,
			    paddingRight: 10,
			    marginTop: 0,
			    marginBottom: 0,
			    marginLeft: 0,
			    marginRight: 5,
			    fontSize: 18,
			}
		}
	}

	getAddressInputs = () => {
		return this.state.addresses.map( (text, index) => (
			<View style={this.getAddressLineStyling(index)} key={`input_${index}`}>
				<GooglePlacesAutocomplete
					ref={(el) => this.addressInputs[index] = el}
					placeholder='Search'
					placeholderTextColor='white'
					minLength={2}
					autoFocus={false}
					returnKeyType={'search'} 
					fetchDetails={true}
					renderDescription={row => row.description}
					onPress={(data) => {
						this.addressChosen(index, data);
					}}
					textInputProps={{
						onFocus: () => this.inputFocused(index),
						onChangeText: (txt) => this.inputChanged(txt, index)
					}}
					currentLocation={false}
					query={{
						key: GOOGLE_CREDENTIALS.key,
						language: 'en', 
						types: ''
					}}
					getDefaultValue={this.defaultValueFunc}
					styles={ this.getAutoCompleteStyling() }
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

		// move up addresses within the Google Autocomplete inputs, not controlled inputs
		for (let i = index; i < addresses.length - 1; ++i) {
			this.addressInputs[i].state.text = this.addressInputs[i+1].state.text
		}

		// delete specific address from the component state
		addresses.splice(index, 1);

		this.setState({addresses, listDisplayed: -1});
	}

	addAddress = () => {
		this.setState({addresses: [...this.state.addresses, ''], listDisplayed: -1});
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

	mapRoute = () => {
		// removing any empty string addresses
		let addresses = this.state.addresses.reduce( (addresses, address) => {
			return (address.length === 0 || !address.trim()) ? addresses : [...addresses, address];
		}, []);

		const addressLength = addresses.length;

		// do not allow for calculation if number of addresses < 3
		if (addressLength < 3) {
			let addressMsg = '';
			if (addressLength < 1) {
				addressMsg = 'No locations entered. Try Again';
			} else if (addressLength < 2) {
				addressMsg = 'Only one location entered, need two for a route. Try Again';
			} else {
				addressMsg = 'Two locations entered, shortest journey is from one to another. Try Again';
			}

			Alert.alert(
				'Invalid Number of Addresses',
				addressMsg,
				[ {text: 'OK', onPress: () => {}} ]
			);

			return;
		}

		MapsDistance.get({
			origins: addresses,
			destinations: addresses
		}, (err, data) => {
		 	if (err) {
				return;
			}

			// replace any incomplete addresses within inputs with official addresses used
			let foundAddresses = [];

			for (let i = 0; i < addresses.length; ++i) {
				foundAddresses.push(data[i*addresses.length].origin);
				this.addressInputs[i].state.text = data[i*addresses.length].origin;
			}

			// calculate the solution for the given locations
			this.setState({addresses: foundAddresses, routeData: data}, () => {
				let minRoute = this.calcTSPSoln();
				this.setState({route: minRoute.route, routeDistance: minRoute.distance});
			});
		});
	}

	getShortestRoute = () => {
		if (this.state.route) {
			let viewText = "The shortest route is:\n\t" + this.state.route;
			viewText += "\nwith a distance of " + this.state.routeDistance + "km";

			return viewText;
		}

	}

	calcTSPSoln = () => {
		let minCost = Number.MAX_SAFE_INTEGER;
		let minRoute = [];

		const allCities = [...Array(this.state.addresses.length).keys()];

		for (let i = 0; i < this.state.addresses.length; ++i) {
			let remainingCitiesArr = [...allCities];
			remainingCitiesArr.splice(remainingCitiesArr.indexOf(i), 1);

			let subProb = this.calcTSPSubSoln(i, i, remainingCitiesArr);
			
			if (subProb.cost < minCost) {
				minCost = subProb.cost;
				minRoute = [i, ...subProb.route];
			}
		}

		let route = (minRoute[0] + 1).toString();
		for (let j = 1; j < minRoute.length; ++j) {
			route += " -> " + (minRoute[j] + 1).toString();
		}

		return {
			route,
			distance: Math.round(minCost/1000)
		};
	}

	calcTSPSubSoln = (startCity, currentCity, remainingCities) => {
		const { addresses, routeData } = this.state;

		if (remainingCities.length === 1) {
			if (this.state.returnToStart) {
				return {
					cost: routeData[currentCity*addresses.length + remainingCities[0]].distanceValue +
						routeData[remainingCities[0]*addresses.length + startCity].distanceValue,
					route: [remainingCities[0], startCity]
				}
			} else {
				return {
					cost: routeData[currentCity*addresses.length + remainingCities[0]].distanceValue,
					route: [remainingCities[0]]
				}
			}
		}

		let minCost = Number.MAX_SAFE_INTEGER;
		let minRoute = [];

		remainingCities.forEach( (remainingCity) => {
			let cost = routeData[currentCity*addresses.length + remainingCity].distanceValue;

			let leftCities = [...remainingCities];
			leftCities.splice(leftCities.indexOf(remainingCity), 1);

			let subCalcuation = this.calcTSPSubSoln(startCity, remainingCity, leftCities);

			if (cost + subCalcuation.cost < minCost) {
				minCost = cost + subCalcuation.cost;
				minRoute = [remainingCity, ...subCalcuation.route];
			}
		});

		return {
			cost: minCost,
			route: minRoute
		};
	}

	render() {
		const backgroundImage = require('./img/appBackground.png');

		return (
			<ScrollView 
				keyboardShouldPersistTaps="always"
				contentContainerStyle={styles.container}>
				<ImageBackground
					source={backgroundImage} 
					style={styles.background}>
					<Text style={styles.header}>
						Tour Planner
					</Text>
					<Text style={styles.description}>
						Add locations you would like to visit, to find the shortest trip
					</Text>
					<View style={styles.switchContainer}>
						<Switch
							style={styles.switch}
							value={this.state.returnToStart}
							onValueChange={this.toggleSwitch}
						/>
						<Text style={styles.switchText}>
							Return to the same location: &nbsp;
						</Text>
						{this.getreturnToStartValue()}
					</View>
					{ this.getAddressInputs() }
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => this.addAddress()}
						style={styles.addressAddContainer}>
						<Text style={styles.addressAddButton}> ADD ADDRESS </Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.5}
						onPress={() => this.mapRoute()}
						style={styles.mapRouteButton}>
						<Text style={styles.mapRouteText}> MAP ROUTE </Text>
					</TouchableOpacity>
					<Text style={styles.shortestRouteText}>
						{ this.getShortestRoute() }
					</Text>
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
		marginRight: 30,
	},
	expandedAddressLine: {
		height: 250,
		maxHeight: 250
	},
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red',
		width: 35,
		height: 35,
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
		marginTop: -10,
		marginLeft: 30,
		marginRight: 45,
		marginBottom: 20,
		backgroundColor: '#2080DF',
		height: 35,
		borderRadius: 10,
		width: '60%'
	},
	addressAddButton: {
		color: 'white',
		fontSize: 16,
		fontWeight: '900',
	},
	mapRouteButton: {
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 30,
		marginRight: 45,
		marginBottom: 20,
		backgroundColor: '#0ba322',
		height: 50,
		borderRadius: 10,
		width: '60%'
	},
	mapRouteText: {
		color: 'white',
		fontSize: 20,
		fontWeight: '900'
	},
	shortestRouteText: {
		color: '#1e1e1e',
		fontSize: 18,
		marginLeft: 30,
		marginRight: 15,
		marginBottom: 15
	}
});
