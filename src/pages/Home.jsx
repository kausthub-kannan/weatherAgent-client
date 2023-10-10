import { Button, Card, Col, Form, Input, InputNumber, Row } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactLoading from 'react-loading';
import sun from '../assets/sun.png'
import moon from '../assets/moon.png'

const Home = () => {

    const [weather, setWeather] = useState({})
    const [dayTime, setDayTime] = useState(false)
    const [cardClass, setCardClass] = useState('cards')
    const [color, setColor] = useState('black')

    const [min, setMin] = useState(15)
    const [max, setMax] = useState(35)

    const [tempStatus, setTempStatus] = useState("Lovely Weather!")

    const alertTemp = () =>{
        if(weather.current.temp_c < min){
            console.log('low temp')
            setTempStatus("Alert! Low Temperature")
        }
        else if(weather.current.temp_c > max){
            setTempStatus("Alert! High Temperature")
        }else{
           setTempStatus("Lovely Weather!")
        }
    }

    useEffect(() => {

        console.log(min, max)

        const hours = new Date().getHours()
        const dayTime = hours > 6 && hours < 18
        setDayTime(dayTime)

        // Real time Night Mode
        if (!dayTime) {
            console.log('night')
            document.body.style.backgroundColor = '#0c051d'
            document.body.style.color = 'white'
            setCardClass('cards-night')
            setColor('white')

            document.getElementById("favicon").setAttribute("href", "/moon.png");
        }

        // Fetching Weather Data
        const getWeather = async () => {
            const ip_address = await axios.get("https://api.ipify.org/?format=json")

            const forecast_weather = await axios({
                method: 'get',
                url: 'https://api.weatherapi.com/v1/forecast.json',
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    key: import.meta.env.VITE_API_KEY,
                    q: ip_address.data.ip,
                    days: 4
                }
            })
            setWeather(forecast_weather.data)
        }

        getWeather()
    }, [])  

  return (
    <div>
        <div className='head-section'>
            {dayTime? <img className='logo' src={sun} alt="logo" />: <img className='logo' src={moon} alt="logo" />}
            <h1>ThermoGuardian</h1>
            <h5>Get Quick temperature alerts</h5>
            {tempStatus!="Lovely Weather!"? <Button size="large" danger type="primary">{tempStatus}</Button>: 
            <Button size="large" type="primary">{tempStatus}</Button>}
        </div>

        <Row justify="space-evenly">    

            {/* Forecast Status Card */}
            <Col span={7}>
                <Card className={cardClass} title="Forecast Status" headStyle={{ color: color }}>
                {weather.forecast ? (
                    weather.forecast.forecastday.map((day, index) => (
                        <Row key={index} justify="space-evenly">
                        <Col><h3>{day.date}</h3></Col>
                        <Col><img className='forecast-icon' src={day.day.condition.icon} alt="weather-status" /></Col>
                        <Col><h2>{day.day.avgtemp_c} °C</h2></Col>
                        </Row>
                    ))
                    ) : (
                        <Row justify="center">
                            <ReactLoading className='loading' color={color} type="spin" height={'50%'} width={'30%'} />
                        </Row>
                    )}

                </Card>
            </Col>

            {/* Weather Status Card */}
            <Col span={7}>
                <Card className={cardClass} title="Weather Status" headStyle={{ color: color }}>
                    {weather.current ? (
                    <>
                        <img className='icon' src={weather.current.condition.icon} alt="weather-status" />
                        <div className='card-section-temperature'>
                        <h2>{weather.current.temp_c} °C</h2>
                        <h4>{weather.current.condition.text}</h4>
                        </div>
                        <h5>
                        {weather.location.country}, {weather.location.tz_id} <br />
                        Humidity: {weather.current.humidity}
                        </h5>
                    </>
                    ) : (
                        <Row justify="center">
                            <ReactLoading className='loading' color={color} type="spin" height={'50%'} width={'30%'} />
                        </Row>
                    )}
                </Card>
            </Col>
            
            {/* Alert System Card */}
            <Col span={7}>
                <Card className={cardClass} title="Alert System" headStyle={{ color: color}}>
                    <p>Set Temperature range to get alerts</p>
                    <Form name="basic">
                        <Form.Item>
                            <Button size="medium" type="primary" style={{backgroundColor: "orange", color: "black"}}>Min</Button>
                            <input value={min} type='number' onChange={(e) => setMin(e.target.value)}/>
                        </Form.Item>
                        <Form.Item>
                            <Button size="medium" type="primary" style={{backgroundColor: "orange", color: "black"}}>Max</Button>
                            <input value={max} type="number" onChange={(e) => setMax(e.target.value)}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" onClick={() => alertTemp()} >Set</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>  

        
        <div className='footer'>
            &copy; {new Date().getFullYear()} ThermoGuardian. All Rights Reserved.
        </div>
    </div>
  )
}

export default Home
