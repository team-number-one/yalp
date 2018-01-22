import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';


class BusinessEntry extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let googleRating = [];
    const starTotal = 5;
    const starPercentage = (this.props.business.rating / starTotal) * 100;
    const starPercentageRounded = (Math.round(starPercentage / 10) * 10);
    const fullStars = Math.floor(starPercentageRounded / 20);
    const halfStar = starPercentageRounded % 20 === 10 ? 1 : 0 
    const emptyStars = 5 - fullStars - halfStar;
  
    for (let i = 0; i < fullStars; i++) {
      googleRating.push(
        (<i className="fa fa-star" aria-hidden="true"></i>)
      )
    }
    if (halfStar === 1) {
      googleRating.push(
        (<i className="fa fa-star-half-o" aria-hidden="true"></i>)
      )
    }
    for(let i = 0; i < emptyStars; i++) {
      googleRating.push(
        (<i className="fa fa-star-o" aria-hidden="true"></i>)
      )
    }
    return (
        <div className="businessEntry">
          <div className="rating">{googleRating}</div>
          <Link style={{textDecoration: 'none'}} to={`/business/${this.props.business.place_id}`}><h5 className="title">{this.props.business.name}</h5></Link><br/>
          <div className="address">
            <span>{this.props.business.formatted_address}</span>
          </div>
          {/* <div className="favorite">{this.props.favorite ? 'Favorite' : 'Not Favorite'}</div> */}
        </div>
    )
  }
}

export default BusinessEntry;
