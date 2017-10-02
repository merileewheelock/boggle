$(document).ready(function(){

	// This is the original dice array, unaltered
	var diceArray = [
		"aaafrs",
		"aaeeee",
		"aafirs",
		"adennn",
		"aeeeem",
		"aeegmu",
		"aegmnn",
		"afirsy",
		"bjkqxz",
		"ccenst",
		"ceiilt",
		"ceilpt",
		"ceipst",
		"ddhnot",
		"dhhlor",
		"dhlnor",
		"dhlnor",
		"eiiitt",
		"emottt",
		"ensssu",
		"fiprsy",
		"gorrvw",
		"iprrry",
		"nootuw",
		"ooottu"
	]

	// Making a copy of the dice array
	var copyDice = diceArray.slice();
	// console.log(copyDice);

	var randomDice = [];
	shuffleDice()
	// console.log(randomDice);

	var rolledDice = [];
	rollTheDice()
	// console.log(rolledDice)

	// This is to shuffle the 25 dice on the baord (not roll)
	function shuffleDice(){
		for (let i = 0; i < diceArray.length; i++){
			var randNum = Math.floor(Math.random() * copyDice.length);
			randomDice.push(copyDice.splice(randNum,1)[0])
		}
	}

	// This is to actually roll each individual die
	function rollTheDice(){
		for (let i = 0; i < diceArray.length; i++){
			var randNum = Math.floor(Math.random() * 6);
			rolledDice.push(randomDice[i].toUpperCase().split('').slice(randNum, randNum+1).toString())
		}
	}

	// Build the board/HTML
	var gridSize = 25;
	var boardHTML = '';

	for (let i = 0; i < gridSize; i++){
		if (rolledDice[i] == "Q"){
			rolledDice[i] = "Qu"
		}
		var dice = rolledDice[i]

		boardHTML += `<div class="dice">${dice}</div>`;
	}

	$('.board').html(boardHTML); 


	// Build the word

	var currentWordArray = [];
	$('.current-word').html('<span class="current-heading">Current Word: </span>')
	$('.submit-word').html('<button type="button">Submit Word</button>')

	// Had to create lettersList to access each div with classes
	var lettersList = $('.dice')
	// console.log(lettersList)

	var selectedIndexArray = [];

	// THIS IS THE MAIN GAME RUN FUNCTION
	$('.dice').click(function(event){

		if ($(this).hasClass('current')){
			$(this).removeClass('selected')
			$(this).removeClass('current')

			currentWordArray.pop()
			selectedIndexArray.pop()
			previousLetterIndex = selectedIndexArray[selectedIndexArray.length-1]
			checkAdjacentLetters(previousLetterIndex)
			$(lettersList[previousLetterIndex]).addClass('current')
			
			currentWord = currentWordArray.join("")
			$('.current-word').html(`<span class="current-heading">Current Word: </span>${currentWord}`);

			// Allows user to keep playing after deleting word
			if (currentWordArray.length == 0){
				$('.dice').removeClass('letterOff')
				// console.log("empty")
			}

			return
		}if ($(this).hasClass('letterOff')){
			console.log("letter is not adjacent, cannot click")
			return
		}if ($(this).hasClass('selected')){
			console.log("letter has already been selected, cannot click")
			return
		}
		buildWord()
		$('.current').removeClass('current') // Updates the current letter

		var indexOfCurrent = ($(this).index())
		selectedIndexArray.push(indexOfCurrent)
		// console.log(selectedIndexArray)
		checkAdjacentLetters(indexOfCurrent);
		$(lettersList[indexOfCurrent]).addClass('selected')
		$(lettersList[indexOfCurrent]).addClass('current')
	})

	// Only want to run this if the clicked square is adjacent to previous square
	function buildWord(){
		// currentWord += event.target.innerText
		currentWordArray.push(event.target.innerText)
		// console.log(currentWordArray)
		currentWord = currentWordArray.join("")
		// console.log(currentWord)
		$('.current-word').html(`<span class="current-heading">Current Word: </span>${currentWord}`);
	}

	function checkAdjacentLetters(index){
		// console.log("current index: " + index)

		var tempLetterOnArray = [];

		for (let i = 0; i < lettersList.length; i++){
			$(lettersList[i]).addClass('letterOff')
			$(lettersList[index]).removeClass('letterOff')
		}

		// Y Axis
		if (index <= 4){
			$(lettersList[index + 5]).removeClass('letterOff')
		}if ((index >= 5) && (index <= 19)){
			$(lettersList[index + 5]).removeClass('letterOff')
			$(lettersList[index - 5]).removeClass('letterOff')
		}if (index >= 20){
			$(lettersList[index - 5]).removeClass('letterOff')
		}

		// X Axis
		if ((index == 0) || (index == 5) || (index == 10) || (index == 15) || (index == 20)){
			$(lettersList[index + 1]).removeClass('letterOff')
		}if ((index == 1) || (index == 6) || (index == 11) || (index == 16) || (index == 21)){
			$(lettersList[index + 1]).removeClass('letterOff')
			$(lettersList[index - 1]).removeClass('letterOff')
		}if ((index == 2) || (index == 7) || (index == 12) || (index == 17) || (index == 22)){
			$(lettersList[index + 1]).removeClass('letterOff')
			$(lettersList[index - 1]).removeClass('letterOff')
		}if ((index == 3) || (index == 8) || (index == 13) || (index == 18) || (index == 23)){
			$(lettersList[index + 1]).removeClass('letterOff')
			$(lettersList[index - 1]).removeClass('letterOff')
		}if ((index == 4) || (index == 9) || (index == 14) || (index == 19) || (index == 24)){
			$(lettersList[index - 1]).removeClass('letterOff')
		}

		// Diagonals
		if ((index != 4) && (index != 9) && (index != 14) && (index <= 19)){
			$(lettersList[index + 6]).removeClass('letterOff')
		}if ((index != 0) && (index != 5) && (index != 10) && (index != 15) && (index < 20)){
			$(lettersList[index + 4]).removeClass('letterOff')
		}if ((index > 5) && (index != 10) && (index != 15) && (index != 20)){
			$(lettersList[index - 6]).removeClass('letterOff')
		}if ((index > 4) && (index != 9) && (index != 14) && (index != 19) && (index != 24)){
			$(lettersList[index - 4]).removeClass('letterOff')
		}

		// $(lettersList[index]).addClass('selected')
		// $(lettersList[index]).addClass('current')

	}

	
	// Score Table Section

	var scoreHTML = '';
	var submittedWordsArray = [];
	var scoreArray = [];

	// This is the HTML for the initial scoreboard
	scoreHTML += '<table>'
		scoreHTML += '<tr>'
			scoreHTML += '<th>Word</th>'
			scoreHTML += '<th>Score</th>'
		scoreHTML += '</tr>'
	scoreHTML += '</table>'

	$('.score-table').html(scoreHTML); 

	// WHEN USER CLICKS SUBMIT
	$('.submit-word').click(function(){
		// console.log(currentWord)
		// console.log(submittedWordsArray)

		// This will prevent duplicate words from being submitted
		for (let i = 0; i < submittedWordsArray.length; i++){
			if (currentWord == submittedWordsArray[i]){
				return
			}
		}

		submittedWordsArray.push(currentWord)
		
		scoreArray = []
		for (let i = 0; i < submittedWordsArray.length; i++){
			if (submittedWordsArray[i].length <= 2){
				scoreArray.push(0)
			}else if (submittedWordsArray[i].length <= 4){
				scoreArray.push(1)
			}else if (submittedWordsArray[i].length == 5){
				scoreArray.push(2)
			}else if (submittedWordsArray[i].length == 6){
				scoreArray.push(3)
			}else if (submittedWordsArray[i].length == 7){
				scoreArray.push(5)
			}else{
				scoreArray.push(11)
			}
		}

		// console.log(submittedWordsArray)
		// console.log(scoreArray)

		// This adds a row for each new submitted word
		var addWordsHTML = ''
		for (let i = 0; i < submittedWordsArray.length; i++){
			addWordsHTML += '<tr>'
				addWordsHTML += `<td>${submittedWordsArray[i]}</td>`
				addWordsHTML += `<td>${scoreArray[i]}</td>`
			addWordsHTML += '</tr>'
		}

		// To sum the values in an array: reduce method
		// array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
		var totalSum = scoreArray.reduce((a, b) => a + b, 0);
		// console.log(totalSum)

		// New table with updated rows
		var scoreHTML = '';
		scoreHTML += '<table>'
			scoreHTML += '<tr>'
				scoreHTML += '<th>Word</th>'
				scoreHTML += '<th>Score</th>'
			scoreHTML += '</tr>'
			scoreHTML += addWordsHTML
			scoreHTML += '<tr>'
				scoreHTML += '<th class="total">Total</th>'
				scoreHTML += `<th class="total">${totalSum}</th>`
			scoreHTML += '</tr>'
		scoreHTML += '</table>'

		// Puts updated table on the screen
		$('.score-table').html(scoreHTML);

		// Resets board
		$('.dice').removeClass('selected')
		$('.dice').removeClass('current')
		$('.dice').removeClass('letterOff')
		currentWordArray = [];
		$('.current-word').html(`<span class="current-heading">Current Word: </span>`);
	})

})
