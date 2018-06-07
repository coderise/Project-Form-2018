//--> linea 2 a 4 se ocultan los componentes que no queremos ver en la pagina principal
$('#campos_formulario').hide();
$('#div_FS').hide();
$('#guardar').hide();
$('#container').hide();
$('#login').hide();
//le decimos al programa que al hacer click nos muestre los campos que habiamos ocultado y que oculte los de la pagina principal
$('#Formulario').click(function(){
    $('#Formulario').hide(),
    $('#text-otro').hide(),
    $('#login').hide(),
    $('#campos_formulario').show(),
    $('#div_FS').show(),
    $('#guardar').show(),
    $('#container').show(),
    $('header').css('margin-top','1rem');

});

function validar(){
 /*creo una variable de tipo booleano que en principio tendrá un valor true(verdadero),
 y que se convertirá en false(falso) cuando la condición no se cumpla
*/
    var correcto = true;
    var mensaje = "Debes de corregir los siguientes errores: \n"; 
    /*
    ahora revisaremos que los parametros pedidos al usuario se cumplan y de no ser asi la variable
    creada anteriormente cambiara su valor a "false"(falso), en este caso decimos que si el nombre
    contiene menos de 5 caracteres no es un nombre valido
    */
    if ($('#txt-name').val().length < 5){
        correcto = false;
        mensaje += "--> El nombre insertado no es valido \n";
    }
    //Ahora repetimos lo mismo pero con la direccion
    if ($('#text-direccion').val().length < 8){
        correcto = false;
        mensaje += "--> La direccion insertada no es valida \n";
    }
    /*Ahora validaremos que los siguiente solo sea una respuesta
    numerica, para eso usaremos la funcion isNaN()
    */ 
    if(isNaN($('#text-pregunta2').val())){
        correcto = false;
        mensaje += "--> La respuesta insertada en la pregunta 'ingresos mensuales' no es valida \n";
    }
    if(isNaN($('#text-telefono').val())){
        correcto = false;
        mensaje += "--> El numero telefonico insertado no es valido \n";
    }
    if(isNaN($('#text-pregunta3').val())){
        correcto = false;
        mensaje += "--> La respuesta insertada en la pregunta 'cuanto dispones para tu mascota' no es valida \n";
    }
    if(isNaN($('#text-pregunta4').val())){
        correcto = false;
        mensaje += "--> La respuesta insertada en la pregunta 'cuanto tiempo dispones para tu mascota' no es valida \n";
    }
    /*Para comprobar el email haremos uso de una expresión regular. Esto es una secuencia
    de caracteres que nos dirá si el valor ingresado por el usuario tiene estructura de
    correo electrónico. Lo que hacemos es obtener el value del campo de texto destinado
    al email, y le aplicamos el método test() del objeto global RegExp(que nos permite
    trabajar con expresiones regulares).*/
    var expresion = /^[a-z][\w.-]+@\w[\w.-]+\.[\w.-]*[a-z][a-z]$/i;
    var email = $('#email-correo').val();
    if (!expresion.test(email)){
        correcto = false;
        mensaje += "--> La direccion de correo no es valida \n";
    }
    /*Para validar el departamento y la ciudad debemos añadir un value distinto a cada "option". En el
    código, he asignado un "value" con  valor "seleccion-d" para el primer option de Departamentos y un 
    "value" con valor "seleccion-c" para el primer option de Ciudades. Los siguientes,
    al no estar definidos toman el valor por defecto. Por tanto, si todos tienen value,
    lo único que tenemos que comprobar es que estos no sean "seleccion-d" o "seleccion-c". Si es uno de estos,
    correcto será false.*/
    if($('#departamentos').val() == 'seleccion-d'){
        correcto = false;
        mensaje += "--> Debes de seleccionar un departamento \n";
    }
    if($('#ciudades').val() == 'seleccion-c'){
        correcto = false;
        mensaje += "--> Debes seleccionar una ciudad \n";
    }
    /*aqui mandaremos un aviso para el usuario, si no está todo bién, osea, si la variable
    "correcto" ha devuelto "false" al menos una vez, generaremos una alerta advirtiendo
    al usuario de que algunos datos ingresados no son los esperados.*/
    if(!correcto){
    alert(mensaje);
    }

    
    /*creamos un condicional en el cual si el valor de "correcto" es true nos permita 
    guardar la informacion que luego mandaremos a la base de datos*/
    if (correcto == true){    
    var datos_form= {
        nombre:$('#txt-name').val(),
        fecha_nacimiento:$('#date-nacimiento').val(),
        
        email:$('#email-correo').val(),
        telefono:$('#text-telefono').val(),
        departamento:$('#departamentos').val(),
        ciudad:$('#ciudades').val(),
        
        direccion:$('#text-direccion').val(), 
        ingresos:$('#text-pregunta2').val(),
        ingresos_mascota:$('#text-pregunta3').val(),
        experiencia:$('#inlineRadio-experiencia').val(),
        tiempo_mascota:$('#text-pregunta4').val(),  
        };
        console.log(datos_form);
        firebase.database().ref('datos_usuario')
        .push(datos_form);
    }

    return correcto;
};
//le indicamos al codigo que cuando se oprima el boton "guardar" ejecute la funcion "validar"
$('#guardar').click(function(){
    validar();
    var recomendacion = 0;
    if ($('#text-pregunta2').val()>=500000){
        recomendacion+=1;
    }
    if ($('#text-pregunta3').val()>=200000){
        recomendacion+=1;
    }
    if ($('#text-pregunta4').val()>=6){
        recomendacion+=1;
    }

    if (recomendacion >= 3){
        alert("Te recomendamos un perro");
    }
    else if(recomendacion ==2){
        alert("Te recomendamos un gato");
    }
    else if(recomendacion == 1){
        alert("Te recomendamos un peluche");
    }

});



 




let stateDropdown = $('#departamentos');
let cityDropdown = $('#ciudades');

stateDropdown.prop('selectedIndex', 0);
let jsonData = {};

const url = '/js/data.json';
$.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
        stateDropdown.append($('<option></option>').attr('value', entry.id).text(entry.departamento));
    });
    jsonData = data;
});

stateDropdown.on('change', function(){
    let stateValue = this.value;

    $.each(jsonData, function (key, entry) {
        if ( entry.id == stateValue ) {
            cityDropdown.empty();
            cityDropdown.append($('<option></option>').attr('value', '').text('Selecciona una Ciudad'));
            cityDropdown.prop('selectedIndex', 0);
            if ( !entry.ciudades == false ) {
                $.each(entry.ciudades, function (key, entry) {
                    cityDropdown.append($('<option></option>').attr('value', key).text(entry));
                });
            }
        }
    });
});

/*
1 - 2   =>  Creamos variables para los selectores
    4   =>  Seleccionamos el primer option en departamentos
    6   =>  Creamos un objeto vacio
    7   =>  Definimos donde esta la data
8 - 13  =>  Peticion "AJAX" con jQuery
9 - 11  =>  Por cada elemento en la data creamos un objeto option con el valor de ID y el texto de departamento (en data)
    12  =>  Guardar la data en la variable de la linea 5
15 - 30 =>  Si hay un cambio en el select de departamentos populamos/llenamos las ciudades respecticas
    16  =>  Guardando en variable el valor del select de departamentos
18 - 29 =>  Recorremos cada elemento de la variable en la linea 5
    19  =>  Buscamos el objeto que tengo el ID igual al seleccionado en el selector de departamentos
    20  =>  Limpiamos el selector de ciudades
    21  =>  Agregamos el elemento por default al selector
    22  =>  Seleccionamos el primer option en ciudades
    23  =>  Revisamos si ciudades existe dentro del objeto seleccionado
24 - 26 =>  Por cada elemento en la data de ciudades creamos un objeto option con el valor de key y el texto de la ciudad (en data)
*/