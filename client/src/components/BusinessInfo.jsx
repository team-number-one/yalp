import React from 'react';

const BusinessInfo = (props) => {
  let googleRating = [];
  let yalpStarRating = [];
  const starTotal = 5;
  const starPercentage = (props.business.rating / starTotal) * 100;
  const starPercentageRounded = (Math.round(starPercentage / 10) * 10);
  const fullStars = Math.floor(starPercentageRounded / 20);
  const halfStar = starPercentageRounded % 20 === 10 ? 1 : 0 
  const emptyStars = 5 - fullStars - halfStar;
  const yalpMessage = "Be the first to review!";
  console.log(props)
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
  const yalpStarPercentage = (props.yalpRating / starTotal) * 100;
  const yalpStarPercentageRounded = (Math.round(yalpStarPercentage / 10) * 10);
  const yalpFullStars = Math.floor(yalpStarPercentageRounded / 20);
  const yalpHalfStar = yalpStarPercentageRounded % 20 === 10 ? 1 : 0 
  const yalpEmptyStars = 5 - yalpFullStars - yalpHalfStar;
  for (let i = 0; i < yalpFullStars; i++) {
    yalpStarRating.push(
      (<i className="fa fa-star" aria-hidden="true"></i>)
    )
  }
  if (yalpHalfStar === 1) {
    yalpStarRating.push(
      (<i className="fa fa-star-half-o" aria-hidden="true"></i>)
    )
  }
  for(let i = 0; i < yalpEmptyStars; i++) {
    yalpStarRating.push(
      (<i className="fa fa-star-o" aria-hidden="true"></i>)
    )
  }

  

  return (
    <div className="businessInfo">
      <div className="businessTitle">{props.business.name}</div>
      <table>
        <thead>
          <tr>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr className="GoogleRating">
            <td>Google:</td>
            <td>{googleRating}</td>
          </tr>
          <tr className="YalpStarRating">
            <td>Yalp:</td>
            {
              props.reviewCount === 0 ?
              <td>{yalpMessage}</td> :
              <td>{yalpStarRating} ({props.reviewCount})</td>
            }
          </tr>
        </tbody>
      </table>
      <div>{props.business.formatted_address}</div>
      <div>{props.business.formatted_phone_number}</div>
      <a target="_blank" href={props.business.website} >{props.business.website}</a>
    </div>
  )
}

export default BusinessInfo;
