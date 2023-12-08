const message = document.querySelector('#message');
const resultDisplay = document.querySelector("#result-display");

const Gameboard = (() => {
	let gameboard = Array(9).fill("");

	const render = () => {
		let boardHTML = '';
		gameboard.forEach((square, index) => {
			boardHTML += `<div class="square" id=square-${index}>${square}</div>`;
		});
		document.querySelector("#gameboard").innerHTML = boardHTML;

		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => {
			square.addEventListener('click', displayController.handleClick);
		});
	};

	const update = (index, value) => {
		gameboard[index] = value;
		render();
	};

	const getGameboard = () => gameboard;

	return { 
		render,
		update,
		getGameboard
	};
})();

const createPlayer = (name, mark) => {
	return {
		name,
		mark
	};
};

const displayController = (() => {
	let players = [];
	let currentPlayerIndex;
	let gameOver;

	const start = () => {
		players = [
			createPlayer(document.querySelector("#player1").value, "X"),
			createPlayer(document.querySelector("#player2").value, "O")
		];
		currentPlayerIndex = 0;
		gameOver = false;
		Gameboard.render();
		const squares = document.querySelectorAll(".square");
		squares.forEach((square) => {
			square.addEventListener('click', handleClick);
		});
		message.innerHTML = `${players[currentPlayerIndex].name}'s turn!`;
	};

	const handleClick = (event) => {
		let index = parseInt(event.target.id.split("-")[1]);

		if(gameOver) {
			return;
		}

		if(Gameboard.getGameboard()[index] !== "") {
			return;  
		}

		Gameboard.update(index, players[currentPlayerIndex].mark);

		if(checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
			gameOver = true;
			resultDisplay.style.display = "flex";
			resultDisplay.innerHTML = `${players[currentPlayerIndex].name} won! <button id="restart" onclick="displayController.restart()">Restart</button>`; 
		} else if(checkForTie(Gameboard.getGameboard())) {
			gameOver = true;
			resultDisplay.style.display = "flex";
			resultDisplay.innerHTML = `It's a tie! <button id="restart" onclick="displayController.restart()">Restart</button>`;
		}

		currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
		message.innerHTML = `${players[currentPlayerIndex].name}'s turn!`;
	};

	const restart = () => {
		for(let i = 0; i < 9; i++) {
			Gameboard.update(i, "");
		}
		Gameboard.render();
		displayController.start();
		resultDisplay.style.display = 'none';
	};

	return {
		start,
		restart,
		handleClick
	};
})();

function checkForWin(board) {
	const winCombos = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for(let i = 0; i < winCombos.length; i++) {
		const [a, b, c] = winCombos[i];

		if(board[a] && board[a] === board[b] && board[a] === board[c]) {
			return true;
		}
	};
	return false;
};

function checkForTie(board) {
	return board.every(cell => cell !== "");
};

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
	displayController.start();
	document.querySelector("#controls").style.display="none";
});

const restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", () => {
	resultDisplay.style.display = "none";
	resultDisplay.innerHTML = `<button id="restart" onclick="displayController.restart()">Restart</button>`;
	displayController.restart();
	displayController.start();
});