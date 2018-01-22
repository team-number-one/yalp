import React from 'react';
import Search from './Search.jsx'
import BusinessInfo from './BusinessInfo.jsx';
import PhotoFeed from './PhotoFeed.jsx';
import Reviews from './Reviews.jsx';
import AddReview from './AddReview.jsx';
import FriendActivity from './FriendActivity.jsx';
import SwoopLocal from './SwoopLocal.jsx';
import axios from 'axios';


class BusinessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      business: {},
      friendReviews: [],
      nonFriendReviews: [],
      yalpRating: 0,
      yalpReviewCount: 0,
    }
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.photos = [];
  }

  componentDidMount() {
    this.getBusinessInfo(this.props.businessPlaceId);
    this.getYalpRatings(this.props.businessPlaceId);
  }

  getYalpRatings(businessId) {
    let reqInfo = {
      businessId: businessId
    }
    axios.get('/server/ratings', reqInfo)
      .then(resp => {
        this.setState({yalpRating: resp.data.weightedAverage, yalpReviewCount: resp.data.totalReviews});
      })
  }
  
  getBusinessInfo(businessId) {
    axios.get(`/server/business/${businessId}`)
    .then(resp => {
      this.photos = [];
      if (resp.data.photos) {
        resp.data.photos.map(photo => {
          this.getBusinessPhotos(photo.photo_reference, data => {
            this.setState({business: resp.data});
          });
        });
      } else {
        this.setState({business: resp.data, checkedIn: false});
        this.props.history.push(`/business/${resp.data.name}`);
      }
      this.setState({business: resp.data})
    })
    .catch(err => {
      console.error(err);
    });
  }

  getBusinessPhotos(photoRef, cb) {
    axios.get(`/server/business/photos/${photoRef}`)
    .then(resp => {
      this.photos.push(resp.data);
      cb();
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div className="businessPage">
        <div style={{cursor: 'pointer'}} onClick={e => this.props.history.goBack()} className="backBtn">{"<"} Search Results</div><br />
        <BusinessInfo business={this.state.business} yalpRating={this.state.yalpRating} reviewCount={this.state.yalpReviewCount}/>
        {/* <div className="business-page-btns">
          <span>
            {
              this.props.checkedIn ?
              <button onClick={e => {this.props.checkIn(this.props.business)}} className="checkIn disabled">Checked In!</button> :
              <button onClick={e => {this.props.checkIn(this.props.business)}} className="checkIn">Check In</button>
            }
          </span>
          <span>
            {
              this.props.getFavoriteInfo(this.state.business.id) ?
              <button className="favoriteIn" onClick={e => {this.props.favoriteIn(this.props.business)}}>Unfavorite</button> :
              <button className="favoriteIn" onClick={e => {this.props.favoriteIn(this.props.business)}}>Favorite</button>
            }
          </span>
        </div> */}
        {this.loggedUser && <div className="addReview">
          <AddReview business={this.state.business} username={this.loggedUser.username} userId={this.loggedUser.id} />
        </div>}
        {this.state.business.id && <div className="reviews">
          <Reviews business={this.state.business} username={this.loggedUser ? this.loggedUser.username : null} userId={this.loggedUser ? this.loggedUser.id : null} />
        </div>}
        {/* <div className="friend-activity">
          <FriendActivity business={this.props.business} username={this.props.username} userId={this.props.userId}/>
        </div> */}
        {this.state.business.photos && this.photos.length === this.state.business.photos.length &&
        <div className="photoFeed">
          <PhotoFeed photos={this.photos} />
        </div>
        }
        <SwoopLocal businessId={this.state.business.id}/>
      </div>
    )
  }
}

export default BusinessPage;
