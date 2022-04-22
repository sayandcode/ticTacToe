// a1 = 100 000 000 ; [0,0] (top left corner)
// a2 = 010 000 000 ; [0,1] (top edge)
// a3 = 001 000 000 ; [0,2] (top right corner)
// b1 = 000 100 000 ; [1,0] (left edge)
// b2 = 000 010 000 ; [1,1] (middle square)
// b3 = 000 001 000 ; [1,2] (right edge)
// c1 = 000 000 100 ; [2,0] (bottom left corner)
// c2 = 000 000 010 ; [2,1] (bottom edge)
// c3 = 000 000 001 ; [2,2] (bottom right corner)

// function run(n){
    n=3;
    //assign cell values
    let cell=Array(n**2).fill(null);  
    for (let i = 0; i < n**2; i++) {
      cell[i]=2**i;
    }
  
    //find all wins
    //winning combinations(2n+2)
    let winCombos=[];
  
    cell.reduce(([rowSum,colSum,diagSum],cellVal,cellIndex)=>{
      
      //add the values to the sum counters
      rowSum+=cellVal;
      colSum[cellIndex%n]+=cellVal;
      if((cellIndex)%(n+1)===0){
        diagSum[0]+=cellVal;
      }
      if(((cellIndex%(n-1))===0)&&(cellIndex !==n**2-1)){
        diagSum[1]+=cellVal;
      }

      //check if end of row, push to winCombos, and reset
      //row check
      if((cellIndex+1)%n===0){ 
        winCombos.push(rowSum);
        rowSum=0;
      }
      //dont need to check if end for column and diag, since we're storing the variable anyway
      
      return [rowSum,colSum,diagSum];
    },[0,Array(n).fill(0),[0,0]]);

    winCombos.push(...[colSum])
    console.log(winCombos.map(combo=>combo.toString(2)));
  // }
  