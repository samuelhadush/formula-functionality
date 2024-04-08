"use client";

interface props {
    text:string,
    operator?:boolean,
    onClick:(e:React.MouseEvent<HTMLSpanElement>)=>void
}
const Pill = ({  operator=false,text, onClick }:props) => {
  if(operator) return <span className="text-gray-400 px-2"> {text} </span>
  return (
    <span className="user-pill text-black px-2 rounded-2xl border-[1px] border-[#ccc]" onClick={onClick}>
      <span>{text} ×</span>
    </span>
  );
};

export default Pill;
