(function(){  //Persistent UI

  //cache the persistent DOM
  const gridContainer=document.querySelector('.gridContainer');
  const replayBtn=document.querySelector('button.replayBtn');
  const endMessage=document.querySelector('.endMessage');
  const spinnerBtns=document.querySelectorAll('.spinner>button');
  const spinnerInput=document.querySelector('.spinner>input');
  let newGridSize=Number(spinnerInput.value);
  const maxSize=spinnerInput.getAttribute('max');
  const minSize=spinnerInput.getAttribute('min');

  //attach event listeners to UI buttons(hidden by default)
  spinnerBtns.forEach(button =>
    button.addEventListener('click',e =>{
      newGridSize=Number(spinnerInput.value);  //update internal record, incase user modified the input directly
      if(e.target.getAttribute('class')==='minus')
          newGridSize-= newGridSize<=minSize ? 0: 1;
      else if(e.target.getAttribute('class')==='plus')
          newGridSize+= newGridSize>=maxSize ? 0: 1;
      spinnerInput.value=newGridSize;
  }));

  replayBtn.addEventListener('click',()=>{
    if((spinnerInput.value>maxSize)||(spinnerInput.value<minSize))
      return;
    endMessage.classList.remove('Owon','Xwon');
    toggleEndScreen();
    game(newGridSize);
  });

  //auto start first game
  game(newGridSize);

  function game(n){
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

    //create cells in DOM grid
    for (let i = 0; i < n*n; i++) {
      const cell=document.createElement('div');
      cell.classList.add('cell');
      gridContainer.appendChild(cell);
    }

    const cells=gridContainer.querySelectorAll('.cell');
    let cellValues=assignCellValues(cells);
    cells.forEach(cell=>cell.addEventListener('click',cellClicked,{once:true}));


    function assignCellValues(domCells){
    // format= 0 000 0 001 0 001 0 100 0 001 0 001 0 000 0 001
    // format= 0 aDi 0 Dia 0 Co3 0 Co2 0 Co1 0 Rw3 0 Rw2 0 Rw1
      let result=[];

      let rowIndenter=0;
      for (let i = 0; i < n*n; i++) {  //for each cell, assign its cell value
        let cellVal=0n;

        //add to appropriate row.
        if((i%n===0)&&(i>0))  //pad with 0 every n+1th cell
          rowIndenter++;
        cellVal+=2n** BigInt(i+rowIndenter);


        //add to appropriate column
        //i=0,3,6 => Co1 => p=12,13,14 =>   n(n+1)   + Math.floor(i/n) places
        //i=1,4,7 => Co2 => p=16,17,18 => (n+1)(n+1) + Math.floor(i/n) places
        //i=2,5,8 => Co3 => p=20,21,22 => (n+2)(n+1) + Math.floor(i/n)
        //i=0,4,8,12=> Co1 => p=20,21,22,23 => n(n+1) + Math.floor(i/n) places
        //i=1,5,9.13=> CO2 => p=25,26,27,28 => (n+1)(n+1) + Math.floor(i/n) places
        //i=2,6,10,14=>Co3 => p=30,31,32,33 => (n+2)(n+1) + Math.floor(i/n) places

        //cell +=2**((n rows + (colNumberFinder))*(n+1) + indent)
        const colPos = BigInt( (n+ i%n)*(n+1) + Math.floor(i/n) );
        cellVal+=2n**colPos;

        // //add to appropriate diagonal
        if(i%(n+1)===0){                                     //if its on the diagonal
          const diaPos = BigInt( (2*n*(n+1)) + (Math.floor(i/n)) );
          cellVal+=2n**diaPos  //diagonal value is stored after the [n rows+ n columns]*(n+1) digits for each
        }
        //add to appropriate antiDiagonal
        if ( (i%(n-1) === 0) && (i!==0) && (i!==(n**2 - 1)) ){ //excludes first and last element, which also happen to satisfy this condition
          const antiDiaPos = BigInt( (2*n + 1)*(n+1) + i/(n-1) - 1);
          cellVal+= 2n**antiDiaPos;      //antiDiagonal value is stored after [n rows + n columns + 1diag]*(n-1) digits for each
        }
        result.push(BigInt(cellVal));
      }
      return result;
    }

    function cellClicked(e){
      const index=[...gridContainer.children].indexOf(e.target);
      let currVal=cellValues[index];  //use bigInt inside this function to eliminate any errors

      if(turn==0){
        e.target.classList.add('O');
        Oboard+=currVal;
      }
      else{
        e.target.classList.add('X');
        Xboard+=currVal;
      }

      /* debugging tool */
      // console.clear();
      // console.log('curVal:',num2paddedString(currVal,n));
      // console.log('Xboard:',num2paddedString(Xboard,n));
      // console.log('Oboard:',num2paddedString(Oboard,n));
      /* debugging tool */

      if(checkForWin()){
        const whoWon= turn==0 ? 'Owon' : 'Xwon';
        endMessage.classList.add(whoWon);
        toggleEndScreen();
      }

      //next person play
      gridContainer.classList.toggle('XTurn');
      gridContainer.classList.toggle('OTurn');
      turn=!turn;
    }

    function checkForWin(){
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
    /* BELOW IS A FUNCTION FOR YOU TO SEE THE FORM OF EACH CELL VALUE, AS CONCEPTUALIZED WITH SPACES */
    // function displayNbits(matrix){
    //   let n=matrix.length**0.5
    //   result=matrix.map(cell=>{
    //     return num2paddedString(cell,n);
    //   });
    //   console.table(result);
    //   console.log('0 aDia 0 Diag 0 Col4 0 Col3 0 Col2 0 Col1 0 Row4 0 Row3 0 Row2 0 Row1')
    //   for (let i = 2; i < n*n; i+=n) {
    //     console.log(result[i],i);
    //   }
    // }
    //
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
    //
    // displayNbits(assignCellValues());
    /* IT IS NOT USED IN THE FUNCTION, AND IS SOLELY FOR YOUR UNDERSTANDING */
  };

  function toggleEndScreen(){
    gridContainer.classList.toggle('inactive');
    document.body.classList.toggle('hide');
  }
})();