function DNAHelix({ className }) {

  const pairs = [];

  for(let i=0;i<20;i++){
    pairs.push(
      <div className="pair" key={i}>
        <span className="left"></span>
        <span className="right"></span>
      </div>
    )
  }

  return(
    <div className={`dna-wrapper ${className}`}>
      <div className="dna">
        {pairs}
      </div>
    </div>
  );
}

export default DNAHelix;