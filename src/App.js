import React, { Fragment, useState } from "react";

function getWeatherIcon(wmoCode) {
    const icons = new Map([
        [[0], "☀️"],
        [[1], "🌤"],
        [[2], "⛅️"],
        [[3], "☁️"],
        [[45, 48], "🌫"],
        [[51, 56, 61, 66, 80], "🌦"],
        [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
        [[71, 73, 75, 77, 85, 86], "🌨"],
        [[95], "🌩"],
        [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
}

function convertToFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
        weekday: "short",
    }).format(new Date(dateStr));
}

async function getWeather(location) {}

export default function App() {
    const [location, setLocation] = useState("");
    const [isLoading,setIsLoading]=useState(false)
    const [displayLocation,setDisplayLocation]=useState("")
    const [weather,setWeather]=useState({})
    
    const changeHandle=(e)=>{
        setLocation(e.target.value)
    
    const fetchWetter = async () => {
        if(location.length<2)return;
        try {
          setIsLoading(true)
            // 1) Getting location (geocoding)
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
            );
            const geoData = await geoRes.json();

            if (!geoData.results) throw new Error("Location not found");

            const { latitude, longitude, timezone, name, country_code } =
                geoData.results.at(0);
            setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

            // 2) Getting actual weather
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await weatherRes.json();
           setWeather(weatherData.daily);
            setIsLoading(false)
        } catch (err) {
            console.error(err);
        }
    };
    fetchWetter();
}
    return (
        <div className="app">
            <h1>Wetter</h1>
            <input
                type="text"
                placeholder="Suche nach Standorten"
                // value={location}
                onChange={(e) => changeHandle(e) }
            />
            {/* <button onClick={fetchWetter}>Wetter</button> */}

            {isLoading && <p className="loader">Loading...</p>}

            {weather.time && <Weather weather={weather} location={location} />}
        </div>
    );
}

function Weather({weather,location}){
    console.log(weather)
    const {temperature_2m_max:max,temperature_2m_min:min,time:date,weathercode}=weather;
    return(
        <div>
            <h2>Wetter: {location}</h2>
            <ul className="weather">
                {date.map((date,i)=>(<Day key={date} max={max.at(i)} min={min.at(i)} weathercode={weathercode.at(i)} date={date} index={i}/>) )}
            </ul>
        </div>
    )

}

function Day({min,max,date,weathercode,index}){
    return(
        <li className="day" >
            <span>{getWeatherIcon(weathercode)}</span>
           <p>{index===0?"Heute":formatDay(date)}</p>
           <p>{Math.floor(min)}&deg; &mdash; <strong> {Math.ceil(max)}&deg; </strong> </p>

        </li>
    )
}























function Counter() {
    const [count, setCount] = useState(0);
    return (
        <Fragment>
            <button onClick={() => setCount((prev) => --prev)}>-</button>
            <span>{count}</span>
            <button onClick={() => setCount((prev) => ++prev)}>+</button>
        </Fragment>
    );
}
