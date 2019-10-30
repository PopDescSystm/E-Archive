<?php

$username = "root"; 
$password = "password_123";   
$host = "health-data.cdk6vzio2lap.us-east-2.rds.amazonaws.com";
$database="health_data";
$port = 3306;
/* We first connect to our database */
$connection = mysqli_connect($host,$username,$password,$database,$port);

/* Capture connection error if any */
if (mysqli_connect_errno($connection)) {
        echo "Failed to connect to DataBase: " . mysqli_connect_error();
    }
else {

  /* Declare an array containing our data points */
   $data_points = array();

  /* Usual SQL Queries */
     $query = "SELECT first_name,bp FROM health_data.health_param;";
     $result = mysqli_query($connection, $query);


    $data = array();
    foreach ($result as $row) {
        $data[] = $row;
    }
    /* Encode this array in JSON form */
    echo json_encode($data);
}
    mysqli_close($connection);
?>