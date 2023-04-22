import React from "react";
import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("http://localhost:8800/api/hotels");

  const parseData = (data) => {
    if (!data) {
      return [];
    }

    const parsedData = data.map((item) => {
      return {
        name: item.name,
        type: item.type,
        city: item.city,
        address: item.address,
        distance: item.distance,
        photos: item.photos,
        title: item.title,
        cheapestPrice: item.cheapestPrice,
      };
    });

    return parsedData;
  };

  return (
    <div className="fp">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        parseData(data).map((item, index) => (
          <div className="fpItem" key={index}>
            <img src={item.photos[0]} alt="" className="fpImg" />
            <span className="fpName">{item.name}</span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
            <div className="fpRating">
              <button>{item.rating}</button>
              <span>{item.ratingLabel}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeaturedProperties;
