import { useEffect, useState } from 'react';
 
const API_KEY = 'fc44c39f99d707ec51ede5ba9f122fc5';
 
export default function Home() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [selectedMeasureSystem, setSelectedMeasureSystem] = useState('C');
    const [measureSystems, setMeasureSystems] = useState(['C', 'F']);
 
 
    const fetchWeather = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await response.json();
            if (response.ok) {
                setWeather(data);
                setError(''); // Clear error on successful fetch
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setWeather(null); // Clear the weather data on error
            setError('City not found. Please try again.');
            setCity('');
        }
    };
 
    // Load stored city from localStorage on first load
    useEffect(() => {
        const fetchStoredCity = async () => {
            try {
                const storedCity = localStorage.getItem('selectedCity') || '';
                if (storedCity) {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${storedCity}&appid=${API_KEY}&units=metric`);
                    const data = await response.json();
                    setWeather(data);
                }
            } catch {
                setError('City not found');
            }
        };
        fetchStoredCity();
    }, []);
 
    // Save city to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('selectedCity', city);
    }, [city]);
 
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to Weather App</h1>
            <form onSubmit={fetchWeather}>
                <label htmlFor='city'>Input city</label>
                <input id='city'
                    type="text"
                    value={city} 
                    onChange={(e) => setCity(e.target.value.trimStart())}
                    placeholder="Enter city"
                />
                <button type="submit">Search</button>
            </form>
 
            {error && (
                <div style={{ color: 'red', marginTop: '20px', border: '1px solid red', padding: '10px', borderRadius: '5px', backgroundColor: '#ffe5e5' }}>
                    <p>{error}</p>
                </div>
            )}
 
            {weather && !error && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Weather in {weather.name}</h2>
                    <p>Temperature: {selectedMeasureSystem === 'C' ? 
                        <span>{weather.main.temp}</span> : 
                        <span>{Math.ceil(weather.main.temp*1.8 + 32)}</span>}
                        <select value={selectedMeasureSystem} onChange={(e) => setSelectedMeasureSystem(e.target.value)} style={{ marginRight: '10px' }}>
                            {measureSystems.map(ms => (
                                <option key={ms} value={ms}>{ms}</option>
                            ))}
                        </select>
                    </p>
                    <p>Description: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind Speed: {weather.wind.speed} m/s</p>
                    <img src={weather.weather.icon} alt="Weather icon" />
                </div>
            )}
        </div>
    );
}