<?php 
require_once("./vendor/autoload.php");
require_once("../require.php");
$fb = new Facebook\Facebook([
  'app_id' => '1795529270684966', // Replace {app-id} with your app id
  'app_secret' => 'ab8c3d69ea65f94b84792a9f9cd78024',
  'default_graph_version' => 'v3.2',
  ]);
$accessToken = $_GET['accessToken'];
  try {
    // Returns a `Facebook\FacebookResponse` object
    $response = $fb->get('/me?fields=id,name,email', $accessToken);
    $user = $response->getGraphUser();
    if ($user){
        $insert['facebookId'] =  $user->getId();
        $insert['facebookName'] =  $user->getName();
        $insert['facebookEmail'] =  $user->getEmail();
        $insert['insertDate'] = date("Y-m-d H:i:s");
        $insert['userKey'] = md5($insert['facebookId']);
        $checker = $db->rawQueryOne("SELECT * FROM fff_user WHERE `userKey`='".$insert['userKey']."'");
        if (!$checker){
            $db->insert("fff_user",$insert);
            setcookie("userKey", $insert['userKey'], time()+30*24*3600, "/", ".fff.blue", 1);
        }else{
            setcookie("userKey", $checker['userKey'], time()+30*24*3600, "/", ".fff.blue", 1);
        }
    }
  } catch(Facebook\Exceptions\FacebookResponseException $e) {
   
  } catch(Facebook\Exceptions\FacebookSDKException $e) {
   
  }
  
  
  
  // OR
  // echo 'Name: ' . $user->getName();
      