import {useState} from 'react';

/*  
  get the numbers and array of number and put them in an array
  check if the number  is included in the array
  if yes, add it in a state of ready exist
  if not add it to ready existing array and show new numbers
*/
function App() {
  const [numbers, setNumbers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);

  //to time my onchange event
  const debounce = (callback, delay)=>{
    let timeout;
    return function(e) {
        clearTimeout( timeout );
        timeout = setTimeout( ()=>{callback(e)}, delay );
    }
  }
  const handleInputChange = debounce((e)=>{
    const {value} = e.target;
    // create an array containing the numbers
    const inputArray = value.split(',')
    //loop through the array
    const dup = [];
    const nonDup = [];
    inputArray.forEach((val)=>{
      //check if the element have -
      if(val.includes('-')){
        //split by -
        const ranges = val.split('-')
        for(let i = ranges[0].trim(); i <= ranges[1].trim(); i++){
          performFilter(parseInt(i),dup,nonDup)
        }
      }else{
        performFilter(parseInt(val.trim()),dup,nonDup)
      }
    })
    setDuplicates(dup);
    //use set to remove duplicates 
    let chars = [...numbers, ...nonDup];
    let uniqueChars = [...new Set(chars)];
    setNumbers(uniqueChars.sort((a,b)=>a-b));
  },700)
  const performFilter = (val,dup,nonDup)=>{
    if(numbers.includes(val)){
      if(val){
        dup.push(val);
      }
    }else{
      if(val){
        nonDup.push(val);
      }
    }
  }
  const resetFields = ()=>{
    setNumbers([]);
    setDuplicates([]);
  }
  const handleSubmit = async ()=>{
    try{
      const response = await fetch('http://localhost:4000/save',{method: 'post', body:JSON.stringify(numbers)})
      const data = await response.json();
      console.log(data);
    }catch(err){
      console.log(err)
    }
  }
  return (
    <div className="app">
      <div className="form">
        <input placeholder="input numbers 500,600,650-700" type="text" className="form__input" onChange={(e)=>handleInputChange(e)}/>
        <button onClick={handleSubmit} className="form__button" style={{marginRight:'20px'}}>send</button>
        <button onClick={resetFields} className="form__button">reset</button>
      </div>
      <div className="form__result">
        <p className="form__resultp"><span className="title">Numbers:</span>{numbers.map((num)=><span key={num}>{num}</span>)}</p>
        <p className="form__resultp" ><span className="title">Duplicates:</span>{duplicates.map((num)=><span key={num}>{num}</span>)}</p>
      </div>
    </div>
  );
}

export default App;
