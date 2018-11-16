var voteA = 0;
var voteB = 0;
var voteC = 0;
var voteD = 0;
var chatSocket;

var connectToSocket = function (roomName) {
    chatSocket = new WebSocket(
        'ws://' + window.location.host +
        '/ws/quizapp/' + roomName + '/');

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
                   
            if (data['msg_type']=='0') {
                var message = data['message'];
                document.querySelector('#chat-log').value += ('sent: ' + message + '\n');
            }
            if (data['msg_type']=='1') {
                var message = data['message'];
                if (message == 'A') {
                    voteA +=1;
                    document.getElementById("dispVoteA").innerHTML = "Votes for A: " + voteA;
                }
                if (message == 'B') {
                    voteB +=1;
                    document.getElementById("dispVoteB").innerHTML = "Votes for B: " + voteB;
                }
                if (message == 'C') {
                    voteC +=1;
                    document.getElementById("dispVoteC").innerHTML = "Votes for C: " + voteC;
                }
                if (message == 'D') {
                    voteD +=1;
                    document.getElementById("dispVoteD").innerHTML = "Votes for D: " + voteD;
                }
            }
        
            if (data['msg_type']=='2') {
                var altMessage = data['message'];
                document.querySelector('#chat-log').value += (altMessage + '\n');
            };
        };
        
        chatSocket.onclose = function(e) {
                console.error('Chat socket closed unexpectedly');
        };
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
	if (e.keyCode === 13) {  // enter, return
		document.querySelector('#chat-message-submit').click();
	}
};

document.querySelector('#chat-message-submit').onclick = function(e) {
   	var messageInputDom = document.querySelector('#chat-message-input');
	var message = messageInputDom.value;
	chatSocket.send(JSON.stringify({
		'message': message,
			'msg_type': '0'
	}));

	messageInputDom.value = '';
};