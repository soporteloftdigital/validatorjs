/**
 * [ld_validarFormulario Valida Formulario por su ID]
 * @param  {string} id ID de Formulario
 * @return {[type]}    Valida
 */
function ld_validarFormulario( id ){
	var id = id;
	var form = document.getElementById(id);
	if(form){
		form.addEventListener( "submit", function(event){
			event.preventDefault();
			for(a=0; a<this.length; a++){
				var class_names = this[a].getAttribute("class");
				var val = this[a].value;
				var required = this[a].required;
				if (class_names){

					if ( class_names.indexOf("validar_rut") > -1 ){
						var validate_rut = ld_validaRut(val);
						if (required){ console.log("Requerido"); }
						if ( !validate_rut ){
							console.log('noenvio rut');
							return false;
						}
					}

					if ( class_names.indexOf("validar_email") > -1 ){
						var validate_email = ld_validarEmail(val);				
						if ( !validate_email ){
							console.log('noenvio mail');
							return false;
						}

					}

					if ( class_names.indexOf("validar_telefono") > -1 ){
						if ( !val ){
							console.log('noenvio telefono');
							 return false;
						}
					}
				}else{

				}

			}
			this.submit();
		});
	}

}
//ld_validarFormulario("form1");


function ld_limpiarWarning(){
	var warnings = document.getElementsByClassName("ld_warning");
	for(x=0; x< warnings.length; x++ ){

		//warnings[x].parentNode.removeChild( warnings[x] );
		
	}
}


/**
 * Activa la ejecucion de formateo de formularios en tiempo real on keyup
 * @return {[type]} se ejecuta no retorna nada
 * USE type activarFormateoCamposFormularios();
 */
function ld_activarFormateoCamposFormularios(){
	/*Preformateo de Rut*/
	var el = document.getElementsByClassName("validar_rut");
	for(i=0; i<el.length;i++  ){
		el[i].addEventListener("keyup", function(evt) {
			var rut_f = ld_formateaRut(this.value);
			if (rut_f){
				this.value=ld_formateaRut(this.value);
				var val_rut = ld_validaRut(rut_f);
				if( val_rut ){
					this.classList.add('rut_true');
					this.classList.remove('rut_false');
				}else{
					this.classList.add('rut_false');
					this.classList.remove('rut_true');
				}
			}
		});
	}	

	/*Preformateo de email*/
	var el = document.getElementsByClassName("validar_email");
	for(i=0; i<el.length;i++  ){
		el[i].addEventListener("keyup", function(evt) {
			var email_f = ld_validarEmail(this.value);

			if ( email_f ){
				this.classList.add('email_true');
				this.classList.remove('email_false');
			}else{
				this.classList.add('email_false');
				this.classList.remove('email_true');
			}

		});
	}


	/*Preformateo de Telefono*/
	var el = document.getElementsByClassName("validar_telefono");
	for(i=0; i<el.length;i++  ){
		el[i].addEventListener("keyup", function(evt) {
			var telefono_f = this.value;
			var telefono_f = ld_validarTelefono( telefono_f );
			this.value = telefono_f;
		});
	}
}
ld_activarFormateoCamposFormularios();

/**
 * Valida RUT Chileno
 * @param  {string} rut Ingreso de string de rut
 * @return {boolean}     Returna true o false
 */
function ld_validaRut(rut) {
	if ( !rut ){ return false; }
	// Despejar Puntos
	var valor = rut.split(".").join("");

	// Despejar Guión
	var valor = valor.split("-").join("");

	// Aislar Cuerpo y Dígito Verificador
	cuerpo = valor.slice(0,-1);
	dv = valor.slice(-1).toUpperCase();

	// Formatear RUN
	rut = cuerpo + '-'+ dv

	// Si no cumple con el mínimo ej. (n.nnn.nnn)
	if(cuerpo.length < 7) {  return false;}

	// Calcular Dígito Verificador
	suma = 0;
	multiplo = 2;

	// Para cada dígito del Cuerpo
	for(i=1;i<=cuerpo.length;i++) {

		// Obtener su Producto con el Múltiplo Correspondiente
		index = multiplo * valor.charAt(cuerpo.length - i);

		// Sumar al Contador General
		suma = suma + index;

		// Consolidar Múltiplo dentro del rango [2,7]
		if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }

	}

	// Calcular Dígito Verificador en base al Módulo 11
	dvEsperado = 11 - (suma % 11);

	// Casos Especiales (0 y K)
	dv = (dv == 'K')?10:dv;
	dv = (dv == 0)?11:dv;

	// Validar que el Cuerpo coincide con su Dígito Verificador
	if(dvEsperado != dv) {  return false; }

	// Si todo sale bien, eliminar errores (decretar que es válido)
	return true;
}

/**
 * Formatea en puntos y guión Rut
 * @param  {string} rut Rut o String que contenga rut
 * @return {boolean}     Retorna True o False
 */
function ld_formateaRut(rut) {
	var actual = rut.replace(/^0+/, "");
	if (actual != '' && actual.length > 1) {
		var sinPuntos = actual.replace(/\./g, "");
		var actualLimpio = sinPuntos.replace(/-/g, "");
		var inicio = actualLimpio.substring(0, actualLimpio.length - 1);
		var rutPuntos = "";
		var i = 0;
		var j = 1;
		for (i = inicio.length - 1; i >= 0; i--) {
			var letra = inicio.charAt(i);
			rutPuntos = letra + rutPuntos;
			if (j % 3 == 0 && j <= inicio.length - 1) {
				rutPuntos = "." + rutPuntos;
			}
			j++;
		}
		var dv = actualLimpio.substring(actualLimpio.length - 1);
		rutPuntos = rutPuntos + "-" + dv;
	}
	return rutPuntos;
}

/**
 * Valida un email
 * @param  {string} email String contemple email
 * @return {bollean}       Regresa true o false
 */
function ld_validarEmail( email ){
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email) ? true : false;
}

/**
 * Valida Telefono
 * @param  {String} telefono Valida Telefono y formatea
 * @return {Strting}          Telefono Formateado
 */
function ld_validarTelefono( telefono ){
	telefono = telefono.split(" ").join("");
	telefono = telefono.split(".").join("");
	telefono = telefono.split("-").join("");
	if ( telefono.length>4 ){
		telefono = telefono.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
	}
	return telefono;
}