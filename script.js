// format= 0 000 0 001 0 001 0 100 0 001 0 001 0 000 0 001 
// format= 0 aDi 0 Dia 0 Co3 0 Co2 0 Co1 0 Rw3 0 Rw2 0 Rw1 
function playGame(n){
  //cache the DOM
  const gridContainer=document.querySelector('.gridContainer'); 
  gridContainer.style['grid-template-rows']=`repeat(${n}, ${300/n}px)`;
  gridContainer.style['grid-template-columns']=`repeat(${n}, ${300/n}px)`;
  let turn;

  const board = (function(){
    //empty board
    let Oboard=0;  
    let Xboard=0

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
        //i=0,3,6 => Co1 => p=12,13,14 =>   n(n+1)   + Math.round(i/n) places
        //i=1,4,7 => Co2 => p=16,17,18 => (n+1)(n+1) + Math.round(i/n) places
        //i=2,5,8 => Co3 => p=20,21,22 => (n+2)(n+1) + Math.round()
        //cell +=2**(cross rows + (colNumberFinder)*(n+1) + indent)
        cell[i]+=2**( n*(n+1) + (i%n + 1)*(n+1) + Math.round(i/n) );

        //add to appropriate diagonal 
        if(i%(n+1)===0)                                     //if its on the idagonal    
          cell[i]+=2**( (2*n*(n+1)) + (Math.round(i/4)) );  //diagonal value is stored after the [n rows+ n columns]*(n+1) digits for each
          
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
    //     return num2paddedString(cell,n);
    //   });  
    //   console.table(result);
    //   console.log(result[0]);
    //   console.log(result[3]);
    //   console.log(result[6]);
    // }

    // function num2paddedString(val,matrixSide){
    //   let N=(2*matrixSide+2)*(matrixSide+1);
    //   num=val.toString(2);
    //     while(num.length<N){                                   
    //       num='0'+num;
    //     }
    //     const regex=new RegExp(`(.)(.{${matrixSide}})`,'g')
    //     num=[...num.replace(regex,'$1 $2 ')];
    //     num=num.join('');
    //     return num;
    // }

    // displayNbits(generateCellValues());
    /* IT IS NOT USED IN THE FUNCTION, AND IS SOLELY FOR YOUR UNDERSTANDING */

    function create(){
      for (let i = 0; i < n*n; i++) {
        const cell=document.createElement('div');
        cell.classList.add('cell');
        gridContainer.appendChild(cell);
      }
      turn=Math.floor(Math.random()*2);
      turn==0 ? gridContainer.classList.add('OTurn'): gridContainer.classList.add('XTurn');  //randomly start with X or O
    }

    function listen(cells){
      cells.forEach(cell=>{
        cell.addEventListener('click',(e)=>{
          let currVal=Number(e.target.getAttribute('data-key'));
          if(!currVal)
            return;          
          
          //mark the cell
          if(turn==0){
            e.target.classList.add('O');
            Oboard+=currVal;
          }
          else{
            e.target.classList.add('X');
            Xboard+=currVal;
          }

          if(checkForWin())
            alert('Won');
          
          //next person play
          gridContainer.classList.toggle('XTurn');
          gridContainer.classList.toggle('OTurn');
          turn=!turn; 
        },{once:true});
      });
    }

    function checkForWin(){
      let currBoard = turn==0 ? Oboard: Xboard;
      
      let result= currBoard;
      for (let i = 1; i < n; i++) {
        if(i%2)
          result=result&(currBoard<<1);
        if(i%2==0)
          result=result&(currBoard>>1);
      }
      return !!result;
    }

    return {
      create,
      generateCellValues,
      listen
    };
  })();

  board.create();  //creates an nxn board in the DOM, and assigns value to each cell 
  const cells=gridContainer.querySelectorAll('.cell');
  board.generateCellValues().map((cellVal,i)=>{
    cells[i].setAttribute('data-key',cellVal);
  })
  board.listen(cells);
}

playGame(3);