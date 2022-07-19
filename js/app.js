const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () =>{
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e) {
    e.preventDefault();

    // Validar formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        // Hubo un error
        mostrarError('Ambos campos son obligatorios');

        return;
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        // Crear una alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md','mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>`;

            container.appendChild(alerta);

            // Se elimine la alerta despues de 5 seg.
            setTimeout(() => {
                alerta.remove();
            }, 5000);
    }
}

async function consultarAPI(ciudad, pais) {

    const appID = '02e572c83ee51b70a7e76e3ffdf1a3a5'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}&lang=sp`

    Spinner(); // Muestra Spinner de carga

    await fetch(url)
        .then( respuesta => respuesta.json())
        .then( datos => {

            limpiarHTML();  //Limpiar resultados previos

            if(datos.cod === "404") {
                mostrarError('Ciudad no encontrada')
                return;
            }
            // Imprime la respuesta en el HTML
            mostrarClima(datos);
            console.log(datos)
        })
        .catch( error => {
            console.log(error)
        })
        
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min, humidity }} = datos;
    const  km = datos.wind.speed
    
    
    let hora = new Date()
    
    const [hour, minutes] = [hora.getHours(), hora.getMinutes()];
    if(minutes >= 0 && minutes < 10){
        minutes = "0" + minutes 
    }
    const horaActual = `${hour}:${minutes}`
    
    const viento = vientoFormula(km)
    console.log(viento)
    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `${name} | ${horaActual}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const descripcion = document.createElement('p');
    descripcion.textContent = `${datos.weather[0].description.charAt(0).toUpperCase() + datos.weather[0].description.slice(1)}`
    descripcion.classList.add( 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`
    tempMinima.classList.add('text-xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad: ${humidity} %`
    humedad.classList.add('text-xl');

    const velocidadViento = document.createElement('p');
    velocidadViento.innerHTML = `Viento: ${viento} km/h`

    const divisor = document.createElement('div');
    divisor.innerHTML = '<hr/>';
    divisor.classList.add('mt-4');

    const iconoClima = document.createElement('div');
    iconoClima.innerHTML = `<div><img src="http://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png" alt=""></div>
                            <div><p>${centigrados} &#8451</p></div>
                            `;
    iconoClima.classList.add('font-bold', 'text-6xl', 'flex', 'justify-center')
    

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white', 'texto');

   

    
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(iconoClima);
    resultadoDiv.appendChild(descripcion);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(humedad);
    resultadoDiv.appendChild(velocidadViento);
    resultadoDiv.appendChild(divisor);
    

    resultado.appendChild(resultadoDiv);
}

const kelvinACentigrados = grados => parseInt(grados - 273.15);

const vientoFormula = velocidad => parseInt(velocidad * 3.6)


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {

    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-fading-circle');

    divSpinner.innerHTML = `
   
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    
    `;

    resultado.appendChild(divSpinner);
}