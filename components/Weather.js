import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios'
import { API_KEY } from '../utils/WeatherAPIKey'
import { API_SECRET } from '../utils/WeatherAPIKey'
import { weatherConditions } from '../data/data'

const Weather = () => {
  const [country, setcountry] = useState('')
  const [city, setcity] = useState('')
  const [dataFeed, setdataFeed] = useState({})
  const [weather, setweather] = useState('')
  const [userDisplay, setuserDisplay] = useState({})
  const [quote, setquote] = useState('')
  const [coordinate, setcoordinate] = useState({})
  const [collect, setcollect] = useState({
    country: 'Ghana',
    city: 'Accra',
  })
  const [ceountryDetails, setceountryDetails] = useState({})

  const seachLocation = () => {
    setcollect({
      country,
      city,
    })
  }

  useEffect(() => {
    const { country } = collect
    axios.get(`https://countryflagsapi.com/png/${country}`).then((response) => {
      setceountryDetails({
        url: response.config.url,
        date: response.headers.date,
      })
    })
  }, [collect])

  useEffect(() => {
    const { country } = collect
    const { city } = collect
    axios
      .get(
        `http://api.positionstack.com/v1/forward?access_key=${API_SECRET}& query=1600${country},${city} `,
      )
      .then((res) => {
        const phad = res.data.data
        phad.map((item) =>
          setcoordinate({
            lat: item.latitude,
            lon: item.longitude,
            continent: item.continent,
          }),
        )
      })
  }, [collect])

  const lat = coordinate.lat
  const lon = coordinate.lon

  useEffect(() => {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`,
      )
      .then((res) => {
        const phad = res.data
        phad.weather.map((item) => setweather(item.main))
        setdataFeed({
          name: phad.name,
          temperature: phad.main.temp,
          country: phad.sys.country,
        })
      })
  }, [collect])

  useEffect(() => {
    const realInfo = () => {
      if (weather === 'Rain') {
        return setuserDisplay(weatherConditions.Rain)
      } else if (weather === 'Clear') {
        return setuserDisplay(weatherConditions.Clear)
      } else if (weather === 'Thunderstorm') {
        return setuserDisplay(weatherConditions.Thunderstorm)
      } else if (weather === 'Snow') {
        return setuserDisplay(weatherConditions.Snow)
      } else if (weather === 'Drizzle') {
        return setuserDisplay(weatherConditions.Drizzle)
      } else if (weather === 'Haze') {
        return setuserDisplay(weatherConditions.Haze)
      } else if (weather === 'Mist') {
        return setuserDisplay(weatherConditions.Mist)
      } else if (weather === 'Clouds') {
        return setuserDisplay(weatherConditions.Clouds)
      }
    }
    realInfo()
  }, [collect])

  useEffect(() => {
    axios.get('https://zenquotes.io/api/random').then((res) => {
      const phad = res.data
      phad.map((item) => setquote(item))
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          Search for Place
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.input}>
          <TextInput
            placeholder="Enter country"
            value={country}
            onChangeText={(text) => setcountry(text)}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder="Enter city"
            value={city}
            onChangeText={(text) => setcity(text)}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={seachLocation}>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>
            {' '}
            Search{' '}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.displayContainer,
          { backgroundColor: userDisplay.color },
        ]}
      >
        <View style={styles.weatherContainer}>
          <View style={styles.headerContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <MaterialCommunityIcons
                size={48}
                name={userDisplay.icon}
                color={'white'}
              />
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {' '}
                  {dataFeed.country},{' '}
                </Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {' '}
                  {dataFeed.name}{' '}
                </Text>
              </View>
            </View>
            <View style={{ marginTop: -20, marginBottom: 10 }}>
              <Text
                style={{ color: 'white', fontWeight: 'bold', marginLeft: 200 }}
              >
                {' '}
                {coordinate.continent}{' '}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.tempText}> {dataFeed.temperature}˚</Text>
            </View>
          </View>
          {quote && dataFeed ? (
            <View>
              <View
                style={{
                  margin: 20,
                  borderColor: 'white',
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                >
                  {' '}
                  {quote.a}:{' '}
                </Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  {' '}
                  {quote.q}{' '}
                </Text>
              </View>

              <View>
                <View>
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}
                  >
                    Date: {ceountryDetails?.date}{' '}
                  </Text>
                </View>
                <View>
                  <Image
                    style={{ height: 200, width: '100%' }}
                    source={{ uri: ceountryDetails.url }}
                  />
                </View>
              </View>

              <View style={styles.bodyContainer}>
                <Text style={styles.title}>{userDisplay.title}</Text>
                <Text style={styles.subtitle}> {userDisplay.subtitle} </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default Weather

const styles = StyleSheet.create({
  input: {
    padding: 10,
    width: '30%',
    backgroundColor: '#e6e8e6',
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 18,
  },
  container: {
    marginTop: 50,
  },
  text: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayContainer: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderColor: 'silver',
    borderWidth: 1,
    borderRadius: 5,
    height: 600,
  },
  btn: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 8,
  },

  tempText: {
    fontSize: 30,
    color: 'white',
  },
  title: {
    fontSize: 35,
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
  },
  bodyContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 25,
    marginTop: 20,
    backgroundColor: 'silver',
    opacity: 0.6,
    margin: 10,
    borderRadius: 10,
    padding: 5,
  },
})
