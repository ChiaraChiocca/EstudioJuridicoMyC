<?php
    require_once 'modelos.php'; // Requerimos la clase Modelos

    $valores = $_POST; // Guardamos en $valores los datos del formulario

    $usuario = "'".$valores['usuario']."'"; // Guardamos el usuario entre '
    $password = "'".$valores['password']."'"; // Guardamos el password entre '

    $usuarios = new ModeloABM(''); // Creamos el objeto $usuarios basado en la tabla ----
    $usuarios->set_criterio("usuario=$usuario AND password=$password"); // Establecemos el criterio con el usuario y el password

    $datos = $usuarios->seleccionar(); // Ejecutamos el método seleccionar

    echo $datos; // Devolvemos los datos
 
?>