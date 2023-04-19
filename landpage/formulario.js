        //Limpiar Form contacto
        document.addEventListener('DOMContentLoaded', function() {
        const limpiarButton = document.getElementById('limpiarButton');
        const formContacto = document.querySelector('.contacto');
        limpiarButton.addEventListener("click", async function(event) {
            formContacto.reset();
        });  
        
        //Validar form contacto
        const nombreContacto = document.querySelector('#nombreContacto');
        const emailContacto = document.querySelector('#emailContacto');
        const asuntoContacto = document.querySelector('#asuntoContacto');
        const mensajeContacto = document.querySelector('#mensajeContacto');

        const camposContacto = [
        { input: nombreContacto, message: 'El nombre es requerido', validator: (value) => validator.isLength(value, { min: 2 }) },
        { input: emailContacto, message: 'El email es requerido', validator: (value) => validator.isEmail(value) },
        { input: asuntoContacto, message: 'El asunto es requerido', validator: (value) => validator.isLength(value, { min: 2 }) },
        { input: mensajeContacto, message: 'El mensaje es requerido', validator: (value) => validator.isLength(value, { min: 2 }) },
        ];

        mostrarErrorContacto = (input, message) => {
        const error = input.nextElementSibling;
        error.innerHTML = message;
        };

        limpiarErroresContacto = () => {
        const errores = formContacto.querySelectorAll('.error');
        errores.forEach((error) => error.innerHTML = '');
        };

        const enviarContacto = document.getElementById('enviarButtonContacto');
        enviarContacto.addEventListener("click", async function(event) {
            event.preventDefault();
        
            limpiarErroresContacto();
        
            let hayErrores = false; 
        
            camposContacto.forEach((campo) => {
                if (!campo.validator(campo.input.value)) {
                    mostrarErrorContacto(campo.input, campo.message);
                    hayErrores = true; 
                }
            });
        
            if (!hayErrores) {
                alert("La consulta fue enviada correctamente, en breves estaremos en contacto con vos"); // Alerta de éxito
            }
        });
            
        //Validar form cotización
        const nombreCotizacion = document.querySelector('#nombreCotizacion');
        const apellidoCotizacion = document.querySelector('#apellidoCotizacion');
        const emailCotizacion = document.querySelector('#emailCotizacion');
        const telefonoCotizacion = document.querySelector('#telefonoCotizacion');      
                                
        const formCotizacion = document.querySelector('.cotizacion');
        const camposCotizacion = [
            { input: nombreCotizacion, message: 'El nombre es requerido', validator: (value) => validator.isLength(value, { min: 2 }) },
            { input: apellidoCotizacion, message: 'El apellido es requerido', validator: (value) => validator.isLength(value, { min: 2 }) },
            { input: emailCotizacion, message: 'El email es requerido', validator: (value) => validator.isEmail(value) },
            { 
                input: telefonoCotizacion, 
                message: 'El teléfono es requerido', 
                validator: (value) => !validator.isEmpty(value)
            },      
        ];

            mostrarErrorCotizacion = (input, message) => {
            const error = input.nextElementSibling;
            error.innerHTML = message;
            };
    
            limpiarErroresCotizacion = () => {
            const errores = formCotizacion.querySelectorAll('.error');
            errores.forEach((error) => error.innerHTML = '');
            };        
          
          const enviarCotizacion = document.getElementById('enviarButtonCotizacion');
          enviarCotizacion.addEventListener("click", async function(event) {
           event.preventDefault();
        
            limpiarErroresCotizacion();
        
            let hayErrores = false; 
        
            camposCotizacion.forEach((campo) => {
                if (!campo.validator(campo.input.value)) {
                    mostrarErrorCotizacion(campo.input, campo.message);
                    hayErrores = true; 
                }
            });        
        
            if (!hayErrores) {

                try {  
                    //Crear usuario
                    const userData = {
                        nombre : document.querySelector('#nombreCotizacion').value,
                        apellido : document.querySelector('#apellidoCotizacion').value,
                        email : document.querySelector('#emailCotizacion').value,
                        telefono : document.querySelector('#telefonoCotizacion').value,
                    }
                    // Paso 1: Enviar los datos del usuario
                    const usuario = guardarDatosUsuario(userData);             
                    // Paso 2: Obtener la información del producto
                    const tipoServicio = document.querySelector('#servicios').value;
                    const producto = await obtenerProducto(tipoServicio);                    
                    // Paso 3: Crear el PDF con la información del usuario y el producto
                    const pdf = crearPDF(producto);  

                  } catch (error) {
                    console.error(error);
                    alert('Ocurrió un error al generar la cotización. Por favor, intente más tarde. Lamentamos las molestias');
                  }       
            }          
            
        });            
               

          async function guardarDatosUsuario(userData) {          

          const urlGuardarDatosUsuario = 'http://localhost:8080/user';

          //Enviar datos del usuario a la db
          const response = await fetch(urlGuardarDatosUsuario, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (response.ok) {
            console.log('Datos del usuario guardados correctamente'); 
          } else {
            alert('Ocurrió un error al generar la cotización. Por favor, intente más tarde. Lamentamos las molestias'); 
          }
        }
          // Función para obtener el producto con todos los valores
          async function obtenerProducto(tipoServicio) {
            const urlObtenerProducto = 'http://localhost:8080/product/' + tipoServicio;

            const response = await fetch(urlObtenerProducto);
        
            if (!response.ok) {
              throw new Error('No se pudo obtener la información del producto');
            }
        
            const jsonResponse = await response.json();
            return jsonResponse;
          }
        
          function crearPDF(datosProducto) {
          // Obtener los valores de los campos del formulario
          const nombre = document.querySelector('#nombreCotizacion').value;
          const apellido = document.querySelector('#apellidoCotizacion').value;
          const email = document.querySelector('#emailCotizacion').value;
          const telefono = document.querySelector('#telefonoCotizacion').value;
          const nombreServicio = datosProducto.nombreServicio;
          const descripcionServicio = datosProducto.description;
          const precioEstimado = datosProducto.precio;

          const doc = new jsPDF();

          const fechaActual = new Date().toLocaleDateString();
          
          const margenIzquierdo = 25;
          const margenDerecho = 185;
          const anchoTexto = margenDerecho - margenIzquierdo;

          doc.text(`Fecha: ${fechaActual}`, margenIzquierdo, 10);
          doc.text(`Nombre: ${nombre} ${apellido}`, margenIzquierdo, 20);
          doc.text(`Email: ${email}`, margenIzquierdo, 30);
          doc.text(`Teléfono: ${telefono}`, margenIzquierdo, 40);
          doc.text(`Nombre del Servicio: ${nombreServicio}`, margenIzquierdo, 50);

          const descripcionServicioLines = doc.splitTextToSize(`Descripción del Servicio: ${descripcionServicio}`, anchoTexto);
          doc.text(descripcionServicioLines, margenIzquierdo, 60);

          doc.text(`Precio Estimado: ${precioEstimado}`, margenIzquierdo, 90);
          const aclaracionServicios = doc.splitTextToSize(`Aclaración: El precio está sujeto a variaciones por lo que es sólo válido por el día de la fecha, este documento no es válido como comprobante`, anchoTexto);
          doc.text(aclaracionServicios, margenIzquierdo, 100);

          doc.save("Cotización.pdf");

          }  

          function validarCampos(campos) {
            let esValido = true;
          
            campos.forEach((campo) => {
              if (!campo.validator(campo.input.value)) {
                const error = document.querySelector(`#error-${campo.input.id}`);
                error.textContent = campo.message;
                esValido = false;
              }
            });
          
            return esValido;
          }

          //Agregar links a botones del footer
          const facebook = document.getElementById("facebook");
          facebook.addEventListener("click", function() {
            window.location.href = "https://www.facebook.com";
          });

          const twitter = document.getElementById("twitter");
          twitter.addEventListener("click", function() {
            window.location.href = "https://www.twitter.com";
          });

          const instagram = document.getElementById("instagram");
          instagram.addEventListener("click", function() {
            window.location.href = "https://www.instagram.com";
          });

        });       