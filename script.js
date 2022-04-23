function findWinCombos(n){
  let winCombos=[];
  let cell=[];
  
  let rowSum=0;
  let colSum=Array(n).fill(0);
  let diagSum=[0,0];
  
  for (let i = 0; i < n**2; i++) {
    cell[i]=2**i; //assign cell values

    //add the respective values to the sum counters
    rowSum+=cell[i];
    colSum[i%n]+=cell[i];
    if((i)%(n+1)===0)
      diagSum[0]+=cell[i];
    if(((i%(n-1))===0)&&(i !==(n**2-1))&&(i!==0)) //exclude the first&last cell, which happens to satisfy the first condition
      diagSum[1]+=cell[i];

    //check if end of row & push to winCombos
    if((i+1)%n===0){ 
      winCombos.push(rowSum);
      rowSum=0; //need to reset this, cause we're reusing one variable for every row
    }
  }
  
  //since we're persisitently storing the other two variables, we can just push them at the end of the loop
  winCombos.push(...colSum,...diagSum); 

  return winCombos.map(combo=>combo.toString(2));
}
  