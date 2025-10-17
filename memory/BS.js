
var totalSpaces = 90;
var battleship = new Array(totalSpaces);
var totalBorg = totalSpaces / 10;
var missiles = 0;
var sweeps = 0;
var difficulty = 1;
var hit = 0;
var lastGameStatus = null;
var wins = 0;
var losses = 0;
var dialogueInProgress = false;
var gameInProgress = false;


document.onclick = checkClick;

function Difficulty(level) {
	gameInProgress = true;
	document.getElementById("missile").innerHTML = missiles;
	document.getElementById("scan").innerHTML = sweeps;
	if (level == 1) {
		missiles = 75;
		sweeps = 8;
		difficulty = 1;
		initialize();
	}
	else if (level == 2) {
		missiles = 30;
		sweeps = 4;
		difficulty = 2;
		initialize();
	}
	else if (level == 3) {
		missiles = 20;
		sweeps = 2;
		difficulty = 3;
		initialize();
	}
	else if (level == 4) {
		missiles = 15;
		sweeps = 1;
		difficulty = 4;
		initialize();
	}
}

function initialize() {//sets borg and empty locations	
	var num = 0;
	//display numbers of winss/lossess and missile/sweeps status
	document.getElementById("missile").innerHTML = missiles;
	document.getElementById("scan").innerHTML = sweeps;
	//assign all to empty			
	for (num = 1; num <= totalSpaces; num++) {
		battleship[num] = "empty";
		document.getElementById(num).className = "";
	}

	var assignedBorg = 0;
	while (assignedBorg < totalBorg) {//assign 1/10th of the battle grid to borg
		num = Math.random();
		num = num * totalSpaces;
		num = Math.floor(num);
		if (battleship[num] === "empty") {
			battleship[num] = "borg";
			assignedBorg++;
		}
	}
	if (wins == 0 && losses == 0) {//use first intro only for first game
		dialogue(0);
	} else {
		dialogue(1);
	}
}
function checkClick(event) {
	event = event || winsdow.event;
	targ = (event.target) ? event.target : event.srcElement;
	if (targ.tagName === "TD" && gameInProgress == true) {//check if clicked on battle grid
		//checks if borg was hit or empty space and changes image accordingly
		if (missiles > 0 && hit < totalBorg) {
			if (battleship[targ.id] === "borg") {
				document.getElementById(targ.id).classList.add("hit");
				battleship[targ.id] = "sunk";
				hit++;
				missiles--;
				document.getElementById("missile").innerHTML = missiles;
				if (hit >= totalBorg) {
					victory();
				}
			}
			else if (battleship[targ.id] === "empty") {
				document.getElementById(targ.id).classList.add("miss");
				missiles--;
				document.getElementById("missile").innerHTML = missiles;
				if (missiles <= 0) {
					defeat();
				}
			}
		}
		else if (missiles == 0 && hit < totalBorg) {
			defeat();
		}
		else if (missiles == 0 && hit >= totalBorg) {
			victory();
		}
	} else if (targ.tagName === "TD" && gameInProgress == false && dialogueInProgress == false)
		showModal();
}
function sonarOn() {
	if (gameInProgress == true) {
		if (sweeps > 0) {
			showBorg();
			sweeps--;
			document.getElementById("scan").innerHTML = sweeps;
			setTimeout("sonarOff()", 600);
		} else {
			document.getElementById("dialogue").innerHTML = "We can't do that, sir!";
			document.getElementById("character").className = "";
			document.getElementById("character").classList.add("scotty-fear");
		}
	} else if (dialogueInProgress == false)
		showModal();
}
function showBorg() {
	for (i = 1; i <= totalSpaces; i++) {
		if (battleship[i] === "borg") {
			if (gameInProgress == true)
				document.getElementById(i).classList.add("borg");
			else
				document.getElementById(i).classList.add("borg-end");
		}
	}
}
function sonarOff() {
	for (i = 1; i <= totalSpaces; i++) {
		if (battleship[i] === "borg")
			document.getElementById(i).className = "";
	}
}
function fireAllTorpedoes() {
	if (gameInProgress == true) {
		dialogueInProgress = true;
		gameInProgress = false;
		document.getElementById("dialogue").innerHTML = "Fire all torpedoes!";
		document.getElementById("character").className = "";
		document.getElementById("character").classList.add("klingon");
		for (m = missiles; m > 0; m--) {
			num = Math.random();
			num = num * totalSpaces;
			num = Math.floor(num);
			num++;
			if (battleship[num] === "borg") {
				document.getElementById(num).classList.add("hit");
				battleship[num] = "sunk";
				hit++;
			}
			else if (battleship[num] === "empty") {
				document.getElementById(num).classList.add("miss");
				battleship[num] = "missed";
			}
			else if (battleship[num] === "sunk" || battleship[num] === "missed")
				m++;
		}
		document.getElementById("missile").innerHTML = m;
		if (hit >= totalBorg)
			setTimeout("Qapla()", 3000);
		else
			setTimeout("defeat()", 3000);
	} else if (dialogueInProgress == false)
		showModal();
}


function Qapla() {
	gameInProgress = false;
	wins++;
	lastGameStatus = "qapla";
	if (difficulty < 4) difficulty++;
	endDialogue("qapla");
	reset();
}
function victory() {
	gameInProgress = false;
	wins++;
	lastGameStatus = "win";
	if (difficulty < 4) difficulty++;
	endDialogue("win");
	reset();
}
function defeat() {
	gameInProgress = false;
	losses++;
	lastGameStatus = "loss";
	endDialogue("defeat");
	reset();
}

function reset() {
	hit = 0;
	missiles = 0;
	sweeps = 0;
	if (difficulty < 4 && lastGameStatus == "qapla") {
		setTimeout("endDialogue('klingon')", 3000);
	} else if (difficulty < 4 && lastGameStatus == "win") {
		setTimeout("endDialogue('won-easy')", 3000);
	} else if (difficulty < 4 && lastGameStatus == "loss") {
		setTimeout("endDialogue('lost-easy')", 3000);
	} else if (difficulty == 4 && lastGameStatus == "win") {
		setTimeout("endDialogue('won-hard')", 3000);
	} else if (difficulty == 4 && lastGameStatus == "loss") {
		setTimeout("endDialogue('lost-hard')", 3000);
	}
	setTimeout("showModal()", 6000);
}
function showModal() {
	dialogueInProgress = false;
	document.getElementById("win-output").innerHTML = wins;
	document.getElementById("loss-output").innerHTML = losses;
	document.getElementById("open-modal").className = "modal-window";
	document.getElementById("open-modal").classList.add("show");
}
function hideModal() {
	document.getElementById("open-modal").className = "modal-window";
	document.getElementById("open-modal").classList.add("hide");
}
function playAgain(status) {
	if (status == "yes") {
		hideModal();
		sonarOff();
		Difficulty(difficulty);
	}
	else
		hideModal();
}
function dialogue(dialoguePart) {
	if (gameInProgress == true) {
		document.getElementById("character").className = "";
		switch (dialoguePart) {
			case 0:
				document.getElementById("dialogue").innerHTML = "Let's play a little game.";
				document.getElementById("character").className = "q";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 3000);
				break;
			case 1:
				document.getElementById("dialogue").innerHTML = "We are the Borg. You will be assimilated. Resistance is futile.";
				document.getElementById("character").className = "lacutus";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 4500);
				break;

			case 2:
				document.getElementById("dialogue").innerHTML = "What have you got for me, Scotty?";
				document.getElementById("character").className = "kirk";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 2400);
				break;
			case 3:
				document.getElementById("dialogue").innerHTML = "Targeting system offline. We're flying blind out here, sir!";
				document.getElementById("character").className = "scotty-fear";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 3200);
				break;
			case 4:
				document.getElementById("dialogue").innerHTML = "We may be able to use a modified ecolocation system to target the Borg.";
				document.getElementById("character").className = "spock";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 3400);
				break;

			case 5:
				document.getElementById("dialogue").innerHTML = "Sonar?";
				document.getElementById("character").className = "kirk";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 1200);
				break;
			case 6:
				document.getElementById("dialogue").innerHTML = "Essentially.";
				document.getElementById("character").className = "spock";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 1200);
				break;
			case 7:
				sweepsResponse = "";
				if (sweeps > 1) {
					sweepsResponse = "I can try it, sir, but we're taking heavy damage. We may only have " + sweeps + " sonar sweeps.";
				}
				else if (sweeps == 1) {
					sweepsResponse = "I can try it, sir, but we're taking heavy damage. I can only give you " + sweeps + " sweep.";
				} else {
					sweepsResponse = "I can try it, sir, but we're taking heavy damage.";
				}
				document.getElementById("dialogue").innerHTML = sweepsResponse;
				document.getElementById("character").className = "scotty";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 3800);
				break;
			case 8:
				document.getElementById("dialogue").innerHTML = "Amunitions?";
				document.getElementById("character").className = "kirk";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 1200);
				break;
			case 9:
				document.getElementById("dialogue").innerHTML = missiles + " missiles, sir.";
				document.getElementById("character").className = "chekov";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 1800);
				break;
			case 10://Kirk
				document.getElementById("dialogue").innerHTML = "Call battle stations, Mister Sulu.";
				document.getElementById("character").className = "kirk";
				dialoguePart++;
				setTimeout("dialogue(" + dialoguePart + ")", 3000);
				break;
			case 11:
				document.getElementById("dialogue").innerHTML = "Use Sonar to see approaching enemy. Select enemy vessel on battle grid to fire.";
				document.getElementById("character").className = "default";
				dialoguePart++;
				break;
			default: alert("system malfunction");
		}
	}
}

function endDialogue(endScenario) {
	if (gameInProgress == false) {
		document.getElementById("character").className = "";
		switch (endScenario) {
			case "qapla":
				document.getElementById("dialogue").innerHTML = "Qapla!";
				document.getElementById("character").classList.add("happy-klingon");
				break;
			case "win":
				document.getElementById("dialogue").innerHTML = "We will meet again. You will be assimilated. Resistance is futile.";
				document.getElementById("character").classList.add("lacutus");
				break;
			case "defeat":
				document.getElementById("dialogue").innerHTML = "You are out of missiles and out of time. Resistance is futile.";
				document.getElementById("character").classList.add("lacutus");
				break;


			case "lost-easy":
				showBorg();
				document.getElementById("dialogue").innerHTML = "Come now, it's no fun if you don't try.";
				document.getElementById("character").classList.add("q");
				break;
			case "lost-hard":
				showBorg();
				document.getElementById("dialogue").innerHTML = "You're dead, human... Let's play again.";
				document.getElementById("character").classList.add("q-smile");
				break;
			case "won-easy":
				document.getElementById("dialogue").innerHTML = "Let's make this a little more interesting, shall we?";
				document.getElementById("character").classList.add("q");
				break;
			case "won-hard":
				document.getElementById("dialogue").innerHTML = "I suppose you think you've won our little game.";
				document.getElementById("character").classList.add("q");
				break;
			case "klingon":
				document.getElementById("dialogue").innerHTML = "Oh, very good Klingon. Eat any good books lately?";
				document.getElementById("character").classList.add("q-smile");
				break;
			default:
				console.log("end-scenario malfunction");
		}
	}
}