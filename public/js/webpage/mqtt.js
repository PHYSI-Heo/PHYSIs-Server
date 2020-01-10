var mClient;
var isConnected = false;

jQuery(document).ready(function($) {

  $('#btn_mqtt_conn').on('click', function() {
    console.log("Connect..");
    connect();
  });

  $('#btn_mqtt_sub').on('click', function() {
    console.log("Sub MQTT..");
    subscribe();
  });

  $('#btn_mqtt_pub').on('click', function() {
    console.log("Pub MQTT..");
    publish();
  });
});

function showLogMessage(message) {
  var ta_msg = $("textarea");
  ta_msg.val(ta_msg.val() + message + "\n");
  if(ta_msg.length)
       ta_msg.scrollTop(ta_msg[0].scrollHeight - ta_msg.height());
}


function connect() {
  if(isConnected){
    showLogMessage("# 이미 연결된 상태입니다.");
    return;
  }

  var serialNum = $("#serialNum").val();
  if(serialNum.length <= 0){
    $('#lab_serial_num').text("PHYSIs Kit의 Serial Number를 입력하세요.");
    return;
  }
  $('#lab_serial_num').text("");

  client = new Paho.MQTT.Client('physicomtech.com', Number(1884), serialNum + $.now());
  client.connect({
    onSuccess: function() {
      isConnected = true;
      $('#serialNum').attr('disabled', true);
      showLogMessage("# MQTT Connect Successful.");
    },
    onFailure: function () {
      isConnected = false;
      showLogMessage("# MQTT Connect Fail.");
    }
  });
  client.onMessageArrived = function (message) {
    var data = message.payloadString;
    var topic = message.destinationName;
    var sep = topic.indexOf("/");
    topic = topic.substring(sep + 1, topic.length);
    showLogMessage("# Subscribe listen : " + topic + " -> " + data);
  }; //메세지
  client.onConnectionLost = function(res) {
    isConnected = false;
    showLogMessage("# MQTT Disconnect.");
  }; //연결종료
}


function subscribe() {
  if(!isConnected){
    showLogMessage("# MQTT not Connected.");
    return;
  }

  var topic = $("#subTopic").val();

  if(topic.length == 0){
      $('#lab_sub_topic').text("Subscribe Topic을 입력하세요.");
  }else{
      $('#lab_sub_topic').text("");
      client.subscribe($("#serialNum").val() + "/" + topic);
      showLogMessage("# Start Subscribe : " + topic);
  }
}

function publish() {
  if(!isConnected){
    showLogMessage("# MQTT not Connected.");
    return;
  }

  var topic = $("#pubTopic").val();
  var msg = $("#pubMsg").val();

  if(topic.length == 0 || msg.length == 0){
      $('#lab_pub_topic').text("Publish할 Topic/Message를 입력하세요.");
  }else{
      $('#lab_pub_topic').text("");
      var message = new Paho.MQTT.Message(msg);
      message.destinationName = $("#serialNum").val() + "/" + topic;
      client.send(message);
      showLogMessage("# Publish : " + topic + " -> " + msg);
  }
}
