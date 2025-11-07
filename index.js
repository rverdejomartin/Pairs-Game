//variables para ayudar
let divGeneral;
let divTiempo;
let tiempoTimeout = 120; //segundos, en minutoss = 2
let interval;
let barajeo;
let cartasSacadas = []; // Array para guardar las 2 cartas 
let parejasEncontradas = 0;
let pareja = false;
let bloq = false; // Controla si se pueden hacer más clics
let btnReiniciar;

window.onload = ()=>{
    divGeneral = document.getElementById("cartas");
    divTiempo = document.getElementById("timeout");
    btnReiniciar = document.getElementById("reiniciar");
    jugar();
    botonReiniciar();
}

//funcion que va a inicializar el intervalo del cronometro
function timeoutStart(){
    timeoutActualizar();
    interval = setInterval(timeoutActualizar,1000);
}

//funcion que regula si sigue restando tiempo, o si debe parar
function timeoutActualizar(){
    if(tiempoTimeout > 0){
         //calculo de minutos segundos
        let minutos = Math.floor(tiempoTimeout/60);
        let segundos = tiempoTimeout%60;

        //formateo
        let formatMinutos = String(minutos).padStart(2, '0');
        let formatSegundos = String(segundos).padStart(2, '0');

        divTiempo.innerHTML = `${formatMinutos}:${formatSegundos}`;
        tiempoTimeout--;
    }
    else if(tiempoTimeout <=0){
        clearInterval(interval);
        interval = null;
        divTiempo.innerHTML = "¡Se acabó el tiempo!";
        
        let reseteoIndex = divGeneral.querySelectorAll(".cartasDiv");
        reseteoIndex.forEach(carta => {
            carta.style.backgroundImage = "url('./fondo.jpg')"; 
            carta.classList.remove("encontrada");
        });
    }
}

//funcion donde vamos a randomizar las cartas
function randomizarCartas(){
    let cartasTemporal = [
        "dialga.png", "gyarados.png", "lycan.png", "pika.png", "volcanion.png", 
        "dialga.png", "gyarados.png", "lycan.png", "pika.png", "volcanion.png"
    ];
    let final = [];

    //obligamos al bucle que siga mientras no tengsa el array relleno
    while(final.length<10){
        let aleat = Math.floor(Math.random()*cartasTemporal.length);
        final.push(cartasTemporal[aleat]);//guardamos en la posicion 1 el primer aleatorio
        cartasTemporal.splice(aleat, 1); //borra la posicion que he generado aleatoriamente
    }
    
    return final;
}

function prepararCartas(){
    let cartasPreparar = divGeneral.querySelectorAll(".cartasDiv");
    cartasPreparar.forEach((carta, indice) => {
        carta.dataset.index = indice;
        carta.classList.remove("encontrada");
        carta.style.backgroundImage = "url('./fondo.jpg')"; 
    });
}

function jugar(){
    barajeo = randomizarCartas(); //agregamos ya las cartas barajadas
    prepararCartas();
    timeoutStart(); //empezamos la cuenta atras del cronometro

    divGeneral.removeEventListener("click", manejarClick);
    divGeneral.addEventListener("click", manejarClick);
}

function manejarClick(e){
    let divCarta = null;
    let elemento = e.target;
    let voltea = true;

    if(elemento.classList.contains("cartasDiv")){
        divCarta = elemento;
    } else if (elemento.parentElement && elemento.parentElement.classList.contains("cartasDiv")){
        divCarta = elemento.parentElement;
    }

    if(!divCarta){
        voltea = false;
    }

    if(voltea){
        // 1. Bloqueado (mientras se comparan) o ya encontrada
        if (bloq || divCarta.classList.contains("encontrada")){
            voltea = false;
        // 2. Evitar doble clic en la misma carta
        } else if(cartasSacadas.length === 1 && cartasSacadas[0] === divCarta){
            voltea = false;
        }
    }

    //si voltea es true, funciona el programa
    if(voltea){
        let indiceCarta = parseInt(divCarta.dataset.index);
        let nombreImg = barajeo[indiceCarta];
        
        // Voltea la carta
        divCarta.style.backgroundImage = `url('./img-cartas/${nombreImg}')`;
        divCarta.style.backgroundSize = "cover";

        // Aquí la sintaxis es correcta: .push
        cartasSacadas.push(divCarta);

        //Solo se ejecuta después del segundo clic
        if(cartasSacadas.length === 2){
            // Bloqueamos clics hasta que se complete la comparación
            bloq = true; 
            
            let c1 = cartasSacadas[0];
            let c2 = cartasSacadas[1];

            //sacamos los nombres de la imagen para comparar
            let nombre1 = barajeo[parseInt(c1.dataset.index)];
            let nombre2 = barajeo[parseInt(c2.dataset.index)];
            
            // Comparamos
            if(nombre1 === nombre2){
                // ¡Son pareja!

                c1.classList.add("encontrada");
                c2.classList.add("encontrada");
                parejasEncontradas++;

                // Desbloqueamos de inmediato, las cartas se quedan volteadas
                bloq = false; 
                
                if(parejasEncontradas === 5){
                    clearInterval(interval);
                    interval = null;
                    divTiempo.innerHTML = "¡Ganaste!";
                }

                cartasSacadas = []; 

            } else {
                // No son pareja, se vuelven a voltear
                setTimeout(()=>{
                    c1.style.backgroundImage = "url('./fondo.jpg')"; 
                    c2.style.backgroundImage = "url('./fondo.jpg')";
                    bloq = false; // Desbloqueamos después de que las cartas se ocultan
                    cartasSacadas = []; 
                },1000)
            }
        } 
    }
}

function reiniciarJuego(){
    if(interval == null){
        jugar();
    }
}

function reiniciarStats(){
    tiempoTimeout = 120; 
    cartasSacadas = [];
    parejasEncontradas = 0;
    bloq = false;
    interval = null;
    divTiempo.innerHTML = "02:00";
}

function botonReiniciar(){
    btnReiniciar.addEventListener("click", (e)=>{
        if(interval){
            clearInterval(interval);
            interval = null;
        }
        if(e.target){
            reiniciarStats();
            reiniciarJuego();
        }
    });
}