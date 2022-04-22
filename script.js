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
  
    //rows
    //for each row, add the value of each cell
    cell.reduce((sum,cellVal,cellIndex)=>{//function that checks whether end of row, otherwise adds to sum
      sum+=cellVal;
      if((cellIndex+1)%n===0){  //when does a row end? when (index+1)%(n)===0
        winCombos.push(sum)//push the obtained sum
        sum=0;//reset the sum
      }
      return sum;
    });
  
    //column
    let colSum=cell.reduce((sum,cellVal,cellIndex)=>{
      sum[cellIndex%3]+=cellVal//determine which column its in
      return sum;
    },[0,0,0]);
  
    winCombos.push(...colSum);
  
      //diagonal
    //antiDiag
    console.log(winCombos.map(combo=>combo.toString(2)));
  // }
  