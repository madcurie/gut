import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import magellan from 'magellan-coords';
import config from '../config.js';

//Components
import Map from './Map';
import UberInfo from './UberInfo';

class RestaurantPref extends React.Component {
  constructor(){
    super();
    this.selectNext = this.selectNext.bind(this);
    this.displayLoadingSpinner = this.displayLoadingSpinner.bind(this);
    this.displayTopRestaurant = this.displayTopRestaurant.bind(this);
    this.getUber = this.getUber.bind(this);
    this.openUberModal = this.openUberModal.bind(this);
    this.closeUberModal = this.closeUberModal.bind(this);
    this.state = {
      showSignInModal: false,
      showRegisterModal: false
    }
  }

  componentWillMount(){
    const { fetchSnapPeaData } = this.props.dinerActions;
    const { diners } = this.props;

    fetchSnapPeaData(diners);
  }

  openUberModal(){
    this.setState({
      showUberModal: true
    })
  }

  closeUberModal(){
    this.setState({
      showUberModal: false
    })
  }

  selectNext(e){
    e.preventDefault();
    const { updateTopRestaurant } = this.props.dinerActions;
    const { recommendations } = this.props;

    updateTopRestaurant();
  }

  getUber(e){ 
    e.preventDefault();
    const { fetchUberData } = this.props.dinerActions;
    const { uberData } = this.props; //{}
    console.log('in getUber restaurant prefs:', uberData);
    fetchUberData(this.props.topRestaurant.location.coordinate.latitude, this.props.topRestaurant.location.coordinate.longitude);
  }

  displayLoadingSpinner(){
    if(this.props.isLoadingResults){
      return (
        <div>
          <h1>Our algorithm is crunching numbers. Your recommendation will be ready in a snap!</h1>
          <image src='./../static/assets/spinner.gif' />
        </div>
      )
    } else {
      return null;
    }
  }

  displayTopRestaurant(){
    if (this.props.topRestaurant.name) {

    // format start location for direction url
    let destination = '';
    this.props.topRestaurant.location.display_address.forEach(function (line, index, array) {
      destination = destination.concat(line)
      if (array[++index]) {
        destination = destination.concat(' ')
      }
    })
    destination = destination.replace(/\s/g, '+');

    // convert coords
    // TODO: remove hard-coded lat, lng
    let startLat = '34.019383',
        startLng = '-118.494491';

    if (startLat.charAt(0) === '-') {
      startLat = '-' + magellan(startLat.slice(1)).toDMS()
    } else {
      startLat = magellan(startLat).toDMS()
    }

    if (startLng.charAt(0) === '-') {
      startLng = '-' + magellan(startLng.slice(1)).toDMS()
    } else {
      startLng = magellan(startLng).toDMS()
    }

    let startLoc = startLat + ',' + startLng;

    let directionsUrl = 'https://www.google.com/maps/dir/' + startLoc + '/' + destination;

    // Format Uber URL

    let pickupLat = '34.019383',
        pickupLng = '-118.494491';

    var dropoffDisplay = destination.replace(/'+'/g, ' ')

    // deep link to m.uber.com

    // client_id is public
    // let uberUrl = 'https://m.uber.com/sign-up?client_id=EKD_tcp67WQOa3TsUj0ZmTnjohbVQW5n' + 
    //   '&pickup_latitude=' + pickupLat +
    //   '&pickup_longitude' + pickupLng + 
    //   '&dropoff_latitude=' + this.props.topRestaurant.location.coordinate.latitude + 
    //   '&dropoff_longtitude=' + this.props.topRestaurant.location.coordinate.longitude + 
    //   '&dropoff_address=' + dropoffDisplay;

    // console.log(uberUrl)

      return (
        <div>
          <h2>This is the best restaurant for you!</h2>
          <h3>{this.props.topRestaurant.name}</h3>
          <p>{this.props.topRestaurant.location.display_address[0]}</p>
          <p>{this.props.topRestaurant.location.display_address[1]}</p>
          <p>{this.props.topRestaurant.location.display_address[2]}</p>
          <a href={directionsUrl} target='_blank'>
            Peas get directions!
          </a>
          <p>{this.props.topRestaurant.display_phone}</p>
          <div style={{width:300, height:300}}>
            <Map lat={this.props.topRestaurant.location.coordinate.latitude} lng={this.props.topRestaurant.location.coordinate.longitude}/>
          </div>
          <Button onClick={this.openUberModal}>
            Get Uber Info 
            <UberInfo 
              {...this.props}
              showUberModal={this.state.showUberModal}
              closeUber={this.closeUberModal}/>
          </Button>
          <Button onClick={this.selectNext}>Next restaurant</Button>
        </div>
      )
    } else {
      return null;
    }
  }

  render(){
  	return (
  	 	<div>
        <h1>Results</h1>
        {this.displayLoadingSpinner()}
        {this.displayTopRestaurant()}
  	 	</div>
 	  )
  }
}

export default RestaurantPref;
