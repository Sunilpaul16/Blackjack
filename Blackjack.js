$(document).ready(function() {
/*
Convert the JS file to jQuery - Replaced all the document.getElementById with jQuery

Implement Ace logic correctly - Reviewed the corrected the mistake. it was due to 
newly drawn card not being added to ace count value before it was calculated.
moved the ace counter to appropriate position

App breaks after hitting replay many times - Addressed this issued which was caused by
having insufficient cards in the deck due to new cards not been added new game 

Additionally while was reviewing the code I realized that i did not consider the logic of ace
when first two cards were ace.I have implemented the twoAce function for it. 

Made some other minor adjustments
*/

const hitBtn = $("#hitBtn");
const standBtn = $("#standBtn");
const newGameBtn = $("#newGameBtn");

let dealerSum = 0 ;
let playerSum = 0 ;
let dealerAceCount = 0 ;
let playerAceCount = 0 ;
let card =[] ;

////////////////////////

function createDeck(){
    let cardNum = ["A","2", "3", "4","5", "6","7","8","9","10","J","Q","K"];
    let cardType = ["C", "D","H", "S"];

    for(let i = 0; i< cardType.length; i++){
        for(let j =0; j< cardNum.length; j++){
            card.push(cardNum[j]+ "_" +cardType[i]);
        }
    }
    return card;
    
}
 

card = createDeck();

////////////////////////

function shuffle(){
    for(let i = 0 ;i<card.length;i++ ) {
       let j =  Math.floor(Math.random()*card.length);
       [card[i], card[j]] = [card[j], card[i]];
    }
    
    // console.log(card);
}

////////////////////////

function dealerCard1(){
    let dCard1 = card.pop();
    $("#dealer-card1").attr(`src`,`Cards/${dCard1}.png`);
   
    // console.log(dCard1) ;
    
    dealerSum += cardValue(dCard1);
    dealerAceCount += checkAce(dCard1);
  
    // console.log(dealerSum);
   
    $("#dSum").text(dealerSum);
}

////////////////////////

function dealerCards2(){
    let dCard2 = card.pop();
    $("#dealer-card2").attr(`src`, `Cards/${dCard2}.png`) ;
   
    // console.log(dCard2);

    dealerSum += cardValue(dCard2);
    dealerAceCount += checkAce(dCard2) ;
   
    // console.log(dealerSum);
   
    $("#dSum").text(dealerSum);

}

////////////////////////

function playerCard1(){
    let pCard = card.pop();
    $("#player-card1").attr(`src` ,`Cards/${pCard}.png`);
   
    // console.log(pCard);

    playerSum += cardValue(pCard);
    playerAceCount += checkAce(pCard);
 
    // console.log(playerSum);
}

/////////////////////////

function playerCards2() {
    let pCard2 = card.pop() ;
    $("#player-card2").attr(`src` , `Cards/${pCard2}.png`);
    // console.log(pCard2);

    playerSum += cardValue(pCard2);
    playerAceCount += checkAce(pCard2);
   
    // console.log(playerSum);
   
    $("#pSum").text(playerSum) ;

}

///////////////////

function startGame(){
    createDeck();
    shuffle(card);
    dealerCard1();
    playerCard1();
    playerCards2(); 
  
    // dealerCards2();
   
    $("#dealer-card2").attr(`src` ,`Cards/Card-Back.png`);
    twoAcePlayer();
    twoAceDealer();
    $("#pSum").text(playerSum);
    $("#dSum").text(dealerSum); 
}

//////////////////////////

function cardValue(card){
    let data = card.split("_");
    let value = data[0] ;
    if(isNaN(value)){
        if (value == "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

//////////////////////////

function checkAce(card){
    if (card[0]=== "A"){
        return 1;
    }
    return 0;
}

////////////////

function twoAcePlayer(){
    if (playerSum  > 21  && playerAceCount === 2){
        playerSum -= 10;
        playerAceCount--;
    }
}
function twoAceDealer(){
    if (dealerSum  > 21  && dealerAceCount === 2){
        dealerSum -= 10;
        dealerAceCount--;
    }
}

//////////////////////////

function playerDrawCard(){
    if (playerSum  >= 21){
        return;
    }
    let newCard = card.pop();
    let img = $("<img>").attr(`src`, `Cards/${newCard}.png`).css("height", "200px");
    
    playerSum += cardValue(newCard);
    playerAceCount += checkAce(newCard);
    checkAce(newCard);
    let value = cardValue(newCard);
    if (playerSum + value > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount--;
    }

    $("#playerHand").append(img);
   
    // console.log(playerAceCount);
}

//////////////////

function dealerDrawCard(){
    if (dealerSum >= 21){
        return;
    }
    let newCard = card.pop();
    let img = $("<img>").attr(`src`, `Cards/${newCard}.png`).css("height", "200px");
    let value = cardValue(newCard);
    if (dealerSum + value > 21 && dealerAceCount >0){
        dealerSum -=  10;
        dealerAceCount -- ;
    }
    $("#dealerHand").append(img);

    dealerSum += cardValue(newCard);
    dealerAceCount += checkAce(newCard);
}

////////////////////////////

function stand(){
    hitBtn.prop("disabled", true);
    standBtn.prop("disabled", true);

    dealerCards2();
    twoAceDealer();
    while (dealerSum <17){
        dealerDrawCard();
    }
    results();
    $("#dSum").text(dealerSum);
}

/////////////////////////

function results(){
    let results;
    if (playerSum >21 ){
        results = "Dealer Win";
    }
    else if (dealerSum >  21){
        results = "Player Win" ;
    }
    else if (playerSum > dealerSum){
        results = "Player Win";
    }   
    else if (playerSum === dealerSum){
        results = "Tie";
    }
    else if (playerSum < dealerSum){
        results = "Dealer Win";
    }
    
    $("#Result").text(results);
    
}

///////////////////////////

function hit(){
    playerDrawCard();
    $("#pSum").text( playerSum) ;
}

////////////////////////

function playAgain(){
    dealerSum = 0 ;
    playerSum = 0 ;
    dealerAceCount = 0;
    playerAceCount = 0;
   
    let dealerHand = $("#dealerHand");
    dealerHand.children().slice(2).remove();
   
    let playerHand = $("#playerHand");
    playerHand.children().slice(2).remove();
       
    $("#pSum").text(playerSum) ;
    $("#Result").text ("");
   
    hitBtn.prop("disabled", false);
    standBtn.prop("disabled", false);
    startGame();

}

//////////////////////

hitBtn.click(hit);
standBtn.click(stand);
newGameBtn.click(playAgain);

startGame() ;

});