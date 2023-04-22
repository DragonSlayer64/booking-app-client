import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [date, setDate] = useState(location.state.date);
  const [allHotels, setAllHotels] = useState();

  const { data, loading, error, reFetch } = useFetch(
    //    `http://localhost:8800/api/hotels?city=${destination}`
    `http://localhost:8800/api/hotels`
  );

  const handleClick = () => {
    reFetch();
  };

  useEffect(() => {
    setAllHotels(data);
  }, [data]);

  console.log("allHotels", allHotels);

  function searchHotels() {
    const filteredHotels = allHotels.filter(
      (hotel) => hotel.cheapestPrice >= min && hotel.cheapestPrice <= max
    );
    setAllHotels(filteredHotels);
  }

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

  console.log(data, loading, error);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={searchHotels}>Search</button>
          </div>
          <div className="listResult">
            {allHotels &&
              allHotels.map((item) => (
                <SearchItem item={item} key={item._id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
