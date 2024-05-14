// Create Pixi Application
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb
});
document.body.appendChild(app.view);
// Constants
const ROWS = 3;
const COLS = 5;
const reels = [];
const SYMBOL_WIDTH = 200;
const SYMBOL_HEIGHT = 200;
const reelLayout=[9,1,2,3,10,3,4,8,2,6,5,1,6,9,5];
let reelsContainer;
let winTextContainer; 
const button = new PIXI.Container();
const bg = new PIXI.Graphics();

// Balance text will be visible due to below code
const balanceContainer = new PIXI.Container();
let balanceLabel=new PIXI.Text("BALANCE:", { fontSize: 40, fill: 0x00000 });
balanceLabel.anchor.set(0.5);
balanceLabel.position.set(1160, 630);
balanceContainer.addChild(balanceLabel);
let balanceValue=new PIXI.Text(1000, { fontSize: 40, fill: 0x00000 });
balanceValue.anchor.set(0);
balanceValue.position.set(1270, 607);
balanceContainer.addChild(balanceValue);
app.stage.addChild(balanceContainer);
const keys=[
    {reelId:0,rowId:0},
    {reelId:1,rowId:0},
    {reelId:2,rowId:0},
    {reelId:3,rowId:0},
    {reelId:4,rowId:0},
    {reelId:0,rowId:1},
    {reelId:1,rowId:1},
    {reelId:2,rowId:1},
    {reelId:3,rowId:1},
    {reelId:4,rowId:1},
    {reelId:0,rowId:2},
    {reelId:1,rowId:2},
    {reelId:2,rowId:2},
    {reelId:3,rowId:2},
    {reelId:4,rowId:2},
] 
// Symbols
const symbols = [];
const symbolsTextures = [
    PIXI.Texture.from('assets/H1.png'),
    PIXI.Texture.from('assets/H2.png'),
    PIXI.Texture.from('assets/H3.png'),
    PIXI.Texture.from('assets/H4.png'),
    PIXI.Texture.from('assets/H5.png'),
    PIXI.Texture.from('assets/H6.png'),
    PIXI.Texture.from('assets/A.png'),
    PIXI.Texture.from('assets/K.png'),
    PIXI.Texture.from('assets/Q.png'),
    PIXI.Texture.from('assets/J.png'),
    PIXI.Texture.from('assets/10.png'),
    PIXI.Texture.from('assets/9.png'),
    PIXI.Texture.from('assets/M1.png'),
    PIXI.Texture.from('assets/M2.png'),
];
//highlighted symbols
const symbolsHighlightedTextures = [
    PIXI.Texture.from('assets/H1_connect.png'),
    PIXI.Texture.from('assets/H2_connect.png'),
    PIXI.Texture.from('assets/H3_connect.png'),
    PIXI.Texture.from('assets/H4_connect.png'),
    PIXI.Texture.from('assets/H5_connect.png'),
    PIXI.Texture.from('assets/H6_connect.png'),
    PIXI.Texture.from('assets/A_connect.png'),
    PIXI.Texture.from('assets/K_connect.png'),
    PIXI.Texture.from('assets/Q_connect.png'),
    PIXI.Texture.from('assets/J_connect.png'),
    PIXI.Texture.from('assets/10_connect.png'),
    PIXI.Texture.from('assets/9_connect.png'),
    PIXI.Texture.from('assets/M1_connect.png'),
    PIXI.Texture.from('assets/M2_connect.png'),
];
//it will create win text
function showWinText(win,winTextContainer){
  // win Label
   const winLabel = new PIXI.Text("WIN:", { fontSize: 40, fill: 0x00000 });
  winLabel.anchor.set(0.5);
  winLabel.position.set(100, 630);
  winTextContainer.addChild(winLabel);
// win value
  const winValue = new PIXI.Text("0", { fontSize: 40, fill: 0x00000 });
  winValue.anchor.set(0);
  winValue.position.set(160, 608);
  winValue.text=win;
  winTextContainer.addChild(winValue);
  app.stage.addChild(winTextContainer);
}

   

  //random response will be choosen
function getResponse(number){
    console.log(number)
    fetch("./dummyResponses/response_"+number+".json")
    .then(res => res.json())
    .then((data) => {
        balanceValue.text=balanceValue.text-1;
        
        reelsSymbol(updateReelStructure(data.params[0].reelLayout,ROWS,COLS));
        app.stage.removeChild(winTextContainer);
    if(data.params[0].creditsWon>0){ 
        bg.tint = 0x808080;
        button.interactive = false;
    button.buttonMode = false;
      let timer = setTimeout(()=>{
         winTextContainer= new PIXI.Container();
        this.showWinText(data.params[0].creditsWon,winTextContainer);
        data.params[0].winningLines.lines.map((win)=>{
           showWin(win);
        })

            clearTimeout(timer);

        },600);
    }
      
    });
   }

function showWin(win){
   let winningSymbolPosition=[];
   keys.map((data,index)=>{
    win.matchPositions.map((innerData)=>{
       if(index===innerData-1){
         winningSymbolPosition.push(data);
}
    })
})
   showWinningSymbol(winningSymbolPosition,win);
   }
   //it will reflect winning symbols
function showWinningSymbol(symbols,win){
     let highLightSymbol;            
    const highLightSymbolContainer = new PIXI.Container();
    symbols.forEach((data)=>{
         highLightSymbol = new PIXI.Sprite(symbolsHighlightedTextures[win.symbol]);
         highLightSymbol.x = data.reelId  * SYMBOL_WIDTH;
        highLightSymbol.y = data.rowId * SYMBOL_HEIGHT;
        highLightSymbolContainer.addChild(highLightSymbol);
    });
           app.stage.addChild(highLightSymbolContainer);
       let timer=  setTimeout(()=>{
             app.stage.removeChild(highLightSymbolContainer);
             bg.tint = 0xFFFFFF;
             button.interactive = true;
             button.buttonMode = true;
             balanceValue.text=Number(balanceValue.text) + win.creditsWon;
             clearTimeout(timer);
          },1200);
  
   }
    
//this function updates the structure of reel area
function updateReelStructure(reelLayout,row,column){
    app.stage.removeChild(reelsContainer);
    reelsContainer= new PIXI.Container();
    let mainReel=[];
    for(let i =0;i<row;i++){
        let dummyReel=[];
        for(let j =0;j<column;j++){
            let a= reelLayout.shift();
            dummyReel.push(a);
        }
        mainReel.push(dummyReel);
     }
return mainReel;

}

// symbols will be visible as per reelLayout
function reelsSymbol(reelLayout){
    app.stage.removeChild(reelsContainer);
     reelsContainer= new PIXI.Container();
    reelLayout.map((data,index)=>{
        const reel = [];
        data.map((innerData,innerIndex)=>{
             const symbol = new PIXI.Sprite(symbolsTextures[innerData]);
            symbol.x = innerIndex * SYMBOL_WIDTH;
             symbol.y = index* SYMBOL_HEIGHT;
             reelsContainer.addChild(symbol);
         })
          app.stage.addChild(reelsContainer);
        reels.push(reel);
    })   
}
reelsSymbol(updateReelStructure(reelLayout,ROWS,COLS));



// It will create spin button 
function createButton(text, x, y, width, height, onClick) {
    // Button Background  
    bg.beginFill(0xFFFFFF);
    bg.lineStyle(7, 0x00000);
    bg.drawCircle(width, height, 60);    
    bg.endFill();
    button.addChild(bg);

    // Button Label
    const label = new PIXI.Text(text, { fontSize: 20, fill: 0x00000 });
    label.anchor.set(0.5);
    label.position.set(120, 40);
    button.addChild(label);

    // Button Interaction
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', onClick);
    button.position.set(x, y);
    app.stage.addChild(button);
    return button;
}

createButton("SPIN", 1100, 100, 120, 40, () => {
getResponse(Math.floor(Math.random() * 21) + 1);
});


