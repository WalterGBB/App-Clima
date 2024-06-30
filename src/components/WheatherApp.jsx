import { useEffect, useState } from "react"

export const WheatherApp = () => {

    const [ciudad, setCiudad] = useState('')

    const [dataClima, setDataClima] = useState(null)

    const [traduccionDescripcion, setTraduccionDescripcion] = useState('');
    const [traduccionNombreCiudad, setTraduccionNombreCiudad] = useState('')

    const handleCambioCiudad = (e) => {
        setCiudad(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (ciudad.length > 0) fetchClima()
        setCiudad('') //Para setear el valor del input luego de dar click en el botón buscar (osea luego de ejecutar el onSubmit del form)
    }

    const url_API_Clima = 'https://api.openweathermap.org/data/2.5/weather'
    const apiKeyClima = 'be6db7e09bac5b69b60b0b939a368b4e'
    const difKelvin = 273.15
    const fetchClima = async () => {
        try {
            const response = await fetch(`${url_API_Clima}?q=${ciudad}&appid=${apiKeyClima}`)
            const data = await response.json()
            setDataClima(data)
        } catch (error) {
            console.log('ERROR, ', error)
        }
    }

    const url_API_Traductor = 'https://text-translator2.p.rapidapi.com/translate';
    const fetchTraduccion = async (texto) => {
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '48e86c4600msh2c0cffd19e54b2dp13291ajsn587e554908a5',
                'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
            },
            body: new URLSearchParams({
                source_language: 'en',
                target_language: 'es',
                text: texto
            })
        };

        try {
            const response = await fetch(url_API_Traductor, options);
            const result = await response.json();
            return result.data.translatedText
                .replace(/^\w/, match => match.toUpperCase());
        } catch (error) {
            console.error('Error:', error);
            return 'Error en la traducción';
        }
    }

    useEffect(() => {
        if (dataClima) {
            fetchTraduccion(dataClima.name)
                .then(setTraduccionNombreCiudad);
            fetchTraduccion(dataClima.weather[0].description)
                .then(setTraduccionDescripcion);
        }
    }, [dataClima])


    return (
        <>
            <div className="contenedor">
                <h2>Aplicación de Clima</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ingrese el nombre de una ciudad"
                        value={ciudad}
                        onChange={handleCambioCiudad}
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>
            { /*Si dataClima es null no pasa a ejecutar lo que sigue*/
                dataClima && (
                    <div className="contenedor">
                        <h3>{traduccionNombreCiudad}, {dataClima.sys.country}<img src={`https://flagcdn.com/32x24/${dataClima.sys.country.toLowerCase()}.png`} alt="ícono-de-bandera"></img></h3>
                        <p>Temperatura: {(dataClima.main.temp - difKelvin).toFixed(2)} °C</p>
                        <p>Humedad: {(dataClima.main.humidity)} %</p>
                        <p>Presión atmosférica: {(dataClima.main.pressure)} hPa</p>
                        <p>Velocidad del viento: {Math.round(dataClima.wind.speed)} Km/h</p>
                        <p>Descripción meteorológica: {traduccionDescripcion}</p>
                        <img src={`https://openweathermap.org/img/wn/${dataClima.weather[0].icon}.png`} alt="ícono-del-clima"></img>
                    </div>
                )
            }
        </>
    )
}
