const listaPaisesSel = document.querySelectorAll("form select"),
deMoneda = document.querySelector(".from select"),
aMoneda = document.querySelector(".to select"),
botonConvertir = document.querySelector("form button");

for (let i = 0; i < listaPaisesSel.length; i++) {
    for(let codigoMoneda in listaPaises){
        let selected = i == 0 ? codigoMoneda == "USD" ? "selected" : "" : codigoMoneda == "EUR" ? "selected" : "";
        let optionTag = `<option value="${codigoMoneda}" ${selected}>${codigoMoneda}</option>`;
        listaPaisesSel[i].insertAdjacentHTML("beforeend", optionTag);
    }
    listaPaisesSel[i].addEventListener("change", e =>{
        cargarBanderita(e.target);
    });
}


seleccionarDefecto();
function seleccionarDefecto(){
    //Variables de sesión
    let monOrigen = sessionStorage.getItem("listB");
    let monDestino = sessionStorage.getItem("listD");
    let imgOrigenSes =  sessionStorage.getItem("imgB");
    let imgDestinoSes =  sessionStorage.getItem("imgD");

    //Elementos HTML
    let selectOrigen = document.getElementById("selOrigen");
    let selectDestino = document.getElementById("selDestino");
    let imgOrigen = document.getElementById("imgOrigen");
    let imgDestino = document.getElementById("imgDestino");

    if(monOrigen !=null){
        monOrigen = monOrigen.replace(/['"]+/g,'');
        monDestino = monDestino.replace(/['"]+/g,'');
        imgOrigenSes = imgOrigenSes.replace(/['"]+/g,'');
        imgDestinoSes = imgDestinoSes.replace(/['"]+/g,'');

        selectOrigen.value = monOrigen;
        selectDestino.value = monDestino;
        imgOrigen.src = imgOrigenSes;
        imgDestino.src = imgDestinoSes;
    }else{ //Cuando no exista sesión
        selectOrigen.value="USD";
        selectDestino.value="EUR";
        imgOrigen.src = "https://countryflagsapi.com/png/US";
        imgDestino.src = "https://countryflagsapi.com/png/EUR";
    }
}


function cargarBanderita(element){
    for(let code in listaPaises){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = '';
            imgTag.src = `https://countryflagsapi.com/png/${listaPaises[code]}`;
        }
    }
}

window.addEventListener("load", ()=>{
    obtenerTasa();
});

botonConvertir.addEventListener("click", e =>{
    e.preventDefault();
    obtenerTasa();
});

const icono = document.querySelector("form .icon");
icono.addEventListener("click", ()=>{
    let tempCode = deMoneda.value;
    deMoneda.value = aMoneda.value;
    aMoneda.value = tempCode;
    cargarBanderita(deMoneda);
    cargarBanderita(aMoneda);
    obtenerTasa();
})

function obtenerTasa(){

    var selO = document.getElementById("selOrigen").value;
    var selD = document.getElementById("selDestino").value;

    if (selO == selD) 
    {
        alert('¡No puede hacer conversión con la misma moneda!');
        return;
    }
    
    const monto = document.querySelector("input[type='number']");
    const tasaIntercambioTxt = document.querySelector("form .exchange-rate");
    let montoValue = monto.value;
    if(montoValue == "" || montoValue == "0"){
        monto.value = "1";
        montoValue = 1;
    }

    tasaIntercambioTxt.innerText = "Obteniendo tasa de cambio...";
    let url = `https://v6.exchangerate-api.com/v6/310bb4298f6820040653aec0/latest/${deMoneda.value}`;
    fetch(url).then(response => response.json()).then(result =>{
        let tasaInter = result.conversion_rates[aMoneda.value];
        let valorCambio = (montoValue * tasaInter).toFixed(2);
        tasaIntercambioTxt.innerText = `${montoValue} ${deMoneda.value} = ${valorCambio} ${aMoneda.value}`;
    }).catch(() =>{
        tasaIntercambioTxt.innerText = "No se pudo obtener la tasa desde el API";
    });

}
