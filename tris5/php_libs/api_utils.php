<?php 
function call_game_api($uri, $method, $data = false)
{

	$url = PLATFORM_URL . $uri;
	$curl = curl_init();

	switch ($method)
	{
		case "POST":
			curl_setopt($curl, CURLOPT_POST, 1);

			if ($data)
				curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
			break;
		case "PUT":
			curl_setopt($curl, CURLOPT_PUT, 1);
			break;
		default:
			if ($data)
				$url = sprintf("%s?%s", $url, http_build_query($data));
	}

	// Optional Authentication:
	curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
		
	$x_game_id = PLATFORM_GAME_ID;
	$x_secret_key = PLATFORM_GAME_SECRET_KEY;
	$header_params = array("x-game-id:$x_game_id","x-secret-key:$x_secret_key");
		
	curl_setopt($curl, CURLOPT_HTTPHEADER, $header_params);
	
	curl_setopt($curl, CURLOPT_URL, $url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

	return curl_exec($curl);
}
?>
