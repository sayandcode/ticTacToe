// format= 0 000 0 001 0 001 0 100 0 001 0 001 0 000 0 001 
// format= 0 aDi 0 Dia 0 Co3 0 Co2 0 Co1 0 Rw3 0 Rw2 0 Rw1 
const board = (function(){
function assignCellValues(n){
  let cell=[]; 
  let indenter=0;
  for (let i = 0; i < n*n; i++) {  //for each cell
    cell[i]=0;

    //add to appropriate row.
    if((i%n===0)&&(i>0))  //pad with 0 every n+1th cell
      indenter++;
    cell[i]+=2**(i+indenter);

    //add to appropriate column
    cell[i]+=2**(i+(n*(n+1))+indenter)

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
//   let N=(2*n+2)*(n+1);
//   result=matrix.map(cell=>{
//     num=cell.toString(2);
//     while(num.length<N){                                   
//       num='0'+num;
//     }
//     const regex=new RegExp(`(.)(.{${n}})`,'g')
//     num=[...num.replace(regex,'$1 $2 ')];
//     num=num.join('');
//     return num;
//   });  
//   console.table(result);
// }
/* IT IS NOT USED IN THE FUNCTION, AND IS SOLELY FOR YOUR UNDERSTANDING */

return {
  assignCellValues
}

})();