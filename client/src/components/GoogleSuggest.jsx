import React, {Component} from "react";
import GoogleMapLoader from "react-google-maps-loader";
import GooglePlacesSuggest from "react-google-places-suggest";
 
const MY_API_KEY = "AIzaSyAMML28IbvEgj5ssCZ7SLoSmqMMS6_Kqbw";
 
export default class GoogleSuggest extends React.Component {
  constructor(props) {
    super(props)
	  this.state = {
	    search: "",
	    value: "",
	  }
  }

  userGrantedLocation() {
    let geo_success = position => {
    	let latLng = {lat: position.coords.latitude, lng: position.coords.longitude}
    	this.geocodeLatLng(latLng, (results) => {
    		this.setState({ value: results[0].formatted_address })
    		this.props.locChange(`(${position.coords.latitude}, ${position.coords.longitude})`)
    	});
    }

    let geo_error = position => {
      alert("Sorry, no position available.");
    }

    var geo_options = {
      enableHighAccuracy: true
    };

    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
  }
 
  handleInputChange(e) {
    this.setState({search: e.target.value, value: e.target.value})
  }
 
  handleSelectSuggest(suggest) {
    // console.log(suggest) // eslint-disable-line
    this.geocodeAddress(suggest.formatted_address);
    this.setState({search: "", value: suggest.formatted_address})
  }

  geocodeAddress(address, cb) {
  	var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, (results, status) => {
      if (status === 'OK') {
      	this.props.locChange(results[0].geometry.location.toString());
      	return results[0].geometry.location.toString();
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
        return undefined;
      }
    });
  }

  geocodeLatLng(latlng, cb) {
  	var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, (results, status) => {
      if (status === 'OK') {
      	// this.props.locChange(results[0].geometry.location.toString());
      	cb(results);
      	return results[0].geometry.location.toString();
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
        return undefined;
      }
    });
  }
 
  render() {
    let getLocation;
    const {search, value} = this.state

    if ("geolocation" in navigator) {
      /* geolocation is available */
      getLocation = <button onClick={this.userGrantedLocation.bind(this)}>Get your location</button>
    } else {
      /* geolocation IS NOT available */
      getLocation = undefined;
    }

    return (
      <GoogleMapLoader
        params={{
          key: MY_API_KEY,
          libraries: "places,geocode",
        }}
        render={googleMaps =>
          googleMaps && (
            <GooglePlacesSuggest
              googleMaps={googleMaps}
              autocompletionRequest={{
                input: search,
                // Optional options
                // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
              }}
              // Optional props
              onSelectSuggest={this.handleSelectSuggest.bind(this)}
              textNoResults="No results. Sorry!" // null or "" if you want to disable the no results item
              customRender={prediction => (
                <div className="customWrapper">
                  {prediction
                    ? prediction.description
                    : "No results. Sorry!"}
                </div>
              )}
            >
				      <h3 style={{color: 'white'}}>Location</h3>
				      {getLocation}
              <input
                type="text"
                value={value}
                placeholder="Search a location"
                onChange={this.handleInputChange.bind(this)}
              />
            </GooglePlacesSuggest>
          )
        }
      />
    )
  }
}