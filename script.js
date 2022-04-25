// format= 0 000 0 001 0 001 0 100 0 001 0 001 0 000 0 001 
// format= 0 aDi 0 Dia 0 Co3 0 Co2 0 Co1 0 Rw3 0 Rw2 0 Rw1 
function playGame(n){
  
  const gridContainer=document.querySelector('.gridContainer'); 

  const board = (function(){
    //empty current grid
    gridContainer.textContent='';
    gridContainer.classList.remove('XTurn','OTurn');
    
    //reinitialize board
    let Oboard=0n;  
    let Xboard=0n;
    let turn;
    turn=Math.floor(Math.random()*2);
    turn==0 ? gridContainer.classList.add('OTurn'): gridContainer.classList.add('XTurn');  //randomly start with X or O

    //create grid structure
    gridContainer.style['grid-template-rows']=`repeat(${n}, ${300/n}px)`;
    gridContainer.style['grid-template-columns']=`repeat(${n}, ${300/n}px)`;

    //create cells in grid
    for (let i = 0; i < n*n; i++) {
      const cell=document.createElement('div');
      cell.classList.add('cell');
      gridContainer.appendChild(cell);
    }

    function generateCellValues(){
      let cell=[]; 
      let rowIndenter=0;
      for (let i = 0; i < n*n; i++) {  //for each cell, assign its cell value
        cell[i]=0;

        //add to appropriate row.
        if((i%n===0)&&(i>0))  //pad with 0 every n+1th cell
          rowIndenter++;
        cell[i]+=2**(i+rowIndenter);
        
        
        //add to appropriate column
        //i=0,3,6 => Co1 => p=12,13,14 =>   n(n+1)   + Math.floor(i/n) places
        //i=1,4,7 => Co2 => p=16,17,18 => (n+1)(n+1) + Math.floor(i/n) places
        //i=2,5,8 => Co3 => p=20,21,22 => (n+2)(n+1) + Math.floor(i/n)
        //i=0,4,8,12=> Co1 => p=20,21,22,23 => n(n+1) + Math.floor(i/n) places
        //i=1,5,9.13=> CO2 => p=25,26,27,28 => (n+1)(n+1) + Math.floor(i/n) places
        //i=2,6,10,14=>Co3 => p=30,31,32,33 => (n+2)(n+1) + Math.floor(i/n) places
        
        //cell +=2**((n rows + (colNumberFinder))*(n+1) + indent)
        let colPos=( (n+ i%n)*(n+1) + Math.floor(i/n) );
        let colVal=2**colPos;
        cell[i]+=colVal;

        // //add to appropriate diagonal 
        if(i%(n+1)===0)                                     //if its on the diagonal    
          cell[i]+=2**( (2*n*(n+1)) + (Math.floor(i/n+1)) );  //diagonal value is stored after the [n rows+ n columns]*(n+1) digits for each
          
        //add to appropriate antiDiagonal 
        if ( (i%(n-1) === 0) && (i!==0) && (i!==(n**2 - 1)) ) //excludes first and last element, which also happen to satisfy this condition
          cell[i]+= 2**( (2*n + 1)*(n+1) + i/(n-1) - 1);      //antiDiagonal value is stored after [n rows + n columns + 1diag]*(n-1) digits for each
      }

      return cell;
    }

    /* BELOW IS A FUNCTION FOR YOU TO SEE THE FORM OF EACH CELL VALUE, AS CONCEPTUALIZED WITH SPACES */
    // function displayNbits(matrix){          
    //   let n=matrix.length**0.5
    //   result=matrix.map(cell=>{
    //     return _num2paddedString(cell,n);
    //   });  
    //   console.table(result);
    //   console.log('0 aDia 0 Diag 0 Col4 0 Col3 0 Col2 0 Col1 0 Row4 0 Row3 0 Row2 0 Row1')
    //   for (let i = 2; i < n*n; i+=n) {
    //     console.log(result[i],i);
    //   }
    // }

    function _num2paddedString(val,matrixSide){
      let N=(2*matrixSide+2)*(matrixSide+1);
      num=val.toString(2);
        while(num.length<N){                                   
          num='0'+num;
        }
        const regex=new RegExp(`(.)(.{${matrixSide}})`,'g')
        num=[...num.replace(regex,'$1 $2 ')];
        num=num.join('');
        return num;
    }

    // displayNbits(generateCellValues());
    /* IT IS NOT USED IN THE FUNCTION, AND IS SOLELY FOR YOUR UNDERSTANDING */


    function listen(cells){
      cells.forEach(cell=>{
        cell.addEventListener('click',(e)=>{
          let currVal=BigInt(e.target.getAttribute('data-key'));  //use bigInt inside this function to eliminate any errors
          
          /* debugging tool */
          console.clear();
          console.log('curVal:',_num2paddedString(currVal,4));
          /* debugging tool */
          
          if(!currVal)
            return;          
          
          if(turn==0){
            e.target.classList.add('O');
            Oboard+=currVal;
          }
          else{
            e.target.classList.add('X');
            Xboard+=currVal;
          }

          /* debugging tool */
          console.log('Xboard:',_num2paddedString(Xboard,4));
          console.log('Oboard:',_num2paddedString(Oboard,4));
          /* debugging tool */
  
          if(_checkForWin())
            _showEndScreen();
          //next person play
          gridContainer.classList.toggle('XTurn');
          gridContainer.classList.toggle('OTurn');
          turn=!turn; 
        },{once:true});
      });
    }

    function _checkForWin(){
      let currBoard = turn==0 ? Oboard: Xboard;
      let result= currBoard;
      
      //n=2 => 1L 0R shifts
      //n=3 => 1L 1R shifts
      //n=4 => 2L 1R shifts

      for (let i = 1; i <= n/2; i++) { //for every even number
          result=result&(currBoard<<BigInt(i));
      }
      for (let i = 1; i <= (n-1)/2; i++) { //for every even number
          result=result&(currBoard>>BigInt(i));
      }
      return !!result;
    }

    function _showEndScreen(){
      gridContainer.classList.toggle('inactive');
      document.body.classList.toggle('hide');
      const replayBtn=document.querySelector('button.replayBtn');

      replayBtn.addEventListener('click',function newGame(){
        gridContainer.classList.toggle('inactive');
        document.body.classList.toggle('hide');
        playGame(Number(document.querySelector('.spinner input').value));
        replayBtn.removeEventListener('click',newGame);
      });
    }

    return {
      generateCellValues,
      listen
    };
  })();

  const cells=gridContainer.querySelectorAll('.cell');
  board.generateCellValues().map((cellVal,i)=>{
    cells[i].setAttribute('data-key',cellVal);
  })
  board.listen(cells);
}

playGame(2);