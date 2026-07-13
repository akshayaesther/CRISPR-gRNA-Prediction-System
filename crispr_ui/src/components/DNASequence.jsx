function DNASequence({ sequence }) {

  const getColor = (base) => {
    switch(base){
      case "A": return "#4CAF50"; // green
      case "T": return "#FF5252"; // red
      case "G": return "#FFC107"; // yellow
      case "C": return "#03A9F4"; // blue
      default: return "white";
    }
  };

  return(
    <div className="dna-sequence">

      {sequence.toUpperCase().split("").map((base,index)=>(
        <span
          key={index}
          style={{color:getColor(base)}}
          className="nucleotide"
        >
          {base}
        </span>
      ))}

    </div>
  );
}

export default DNASequence;