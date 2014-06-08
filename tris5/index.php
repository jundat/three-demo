<?php
//ini_set('error_log','my_file.txt');
ini_set('display_errors',1);
error_reporting(E_ALL);


include 'php_libs/global_include.php';

if(!isset($_GET['token'])){
	echo "empty authorization code";	
}
$auth_code = $_GET['token'];

echo "<br/>STEP 1. auth_code [$auth_code]<br/>";

//step 2.
$api_params = array("token" => $auth_code);
$result = call_game_api("/oauth/get_access_token", "GET", $api_params);

$json_data = json_decode($result);

if (!isset($json_data->returnCode ) || $json_data->returnCode != 200)
{
	echo $result;
	echo "ket qua ".json_encode($json_data);
	exit;
}
$access_token = $json_data->response->access_token;

//echo "done ". $access_token;
echo "<br/>STEP 2. access_token [$access_token]";

//step 3.
$api_params = array("access_token" => $access_token);
$result = call_game_api("/user/get_info", "GET", $api_params);

$json_data = json_decode($result);


if (!isset($json_data->returnCode ) || $json_data->returnCode != 200)
{
	echo $result;
	echo "ket qua ".json_encode($json_data);
	exit;
}
$user_id = $json_data->response->user_id;
$user = array(
		"user_id" => $user_id,
		"displayname" => $json_data->response->displayname,
		"avatar" => $json_data->response->avatar,
		);

echo "<br/>STEP 3. user info ". json_encode($user);

//redirect qua trang game vo'i ID va password.
//auto connect with username is user_id.
//password = token.

$env = $_GET['env'];

$redirect_game = sprintf("game.php?env=%s&user_id=%s&access_token=%s", $env, $user_id, $access_token);
echo $redirect_game;
header( "Location: ". $redirect_game);


