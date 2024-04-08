"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as math from 'mathjs'

import Pill from "./components";

interface SuggestionProps {
  name: string;
  category?: string;
  value: number;
  id: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionProps[]>([]);
  const [selectedExpences, setSelectedExpence] = useState<SuggestionProps[]>(
    []
  );
  const [selectedExpenceSet, setSelectedExpenceSet] = useState<any>(new Set());
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [result, setResult] = useState<number|null>(null);

  const inputRef: any = useRef(null);

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      axios
        .get("https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete")
        .then((res: any) => res.data),
  });

  useEffect(() => {
    const fetchUsers = () => {
      setActiveSuggestion(0);
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      // fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => {
          console.error(err);
        });
    };

    fetchUsers();
  }, [searchTerm]);

  useEffect(()=>{
    if(selectedExpences.length==0) return 
    const calc =()=>{
      let equation="";
      selectedExpences.forEach(item=>equation += ` ${item.value}`);
      // return math.evaluate('12.7 cm to inch')   
      debugger
      // console.log(math)
      const res = math.evaluate(equation+" +0")   
      setResult(res)
    }
    calc()

  },[selectedExpences])

  const handleSelectFormula = (expence: SuggestionProps) => {
    setSelectedExpence([...selectedExpences, expence]);
    setSelectedExpenceSet(new Set([...selectedExpenceSet, expence.id]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (expence: any) => {
    const updatedUsers = selectedExpences.filter(
      (selectedExpence) => selectedExpence.id !== expence.id
    );
    setSelectedExpence(updatedUsers);

    const updatedEmails = new Set(selectedExpenceSet);
    updatedEmails.delete(expence.id);
    setSelectedExpenceSet(updatedEmails);
  };

  const handleKeyDown = (e: any) => {
    console.log(e.key===' ')
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedExpences.length > 0
    ) {
      const lastUser = selectedExpences[selectedExpences.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp" && suggestions?.length > 0) {
      e.preventDefault();
      setActiveSuggestion((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.length
    ) {
      handleSelectFormula(suggestions[activeSuggestion]);
    } else if (
      e.key === " " 
    ) {
      console.log( e.target.value)
      const uid=uuidv4()
      handleSelectFormula({name:'', value: e.target.value, id:uid});
    }
  };

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  console.log(data)
// const result =math.evaluate('12.7 cm to inch')     // 5 inch

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex flex-col  expence-search-container">
        <div className=" bg-white flex w-full items-center flex-wrap p-1 border-[1px] border-solid rounded-2xl border-[#ccc] expence-search-input">

          {/* Pills */}
          {selectedExpences.map((expence) => {
            return (
              <Pill
                key={expence.name}
                text={`${expence.name==''?expence.value:expence.name}`}
                operator={expence.name==''}
                onClick={() => handleRemoveUser(expence)}
              />
            );
          })}

          {/* input feild with search suggestions */}
          <div>
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search For a expence..."
              onKeyDown={handleKeyDown}
              className="text-black px-2 focus:outline-none"
            />

            {/* Search Suggestions */}
            {searchTerm && (
              <ul className=" absolute flex-col w-full mt-1.5 rounded-lg bg-white m-0 p-0  flex max-h-[300px] overflow-y-scroll items-center gap-2 px-2 py-2.5">
                {suggestions?.map((expense: any) => {
                  return !selectedExpenceSet.has(expense.id) ? (
                    <li
                      className={
                        ` hover:bg-[#ccc] flex items-center p-1 w-full text-black h-5  ${expense.id === activeSuggestion ? "bg-[#ccc]" : ""}`
                      }
                      key={expense.id}
                      onClick={() => handleSelectFormula(expense)}
                    >
                      <span>{expense.name}</span>
                    </li>
                  ) : (
                    <></>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        {result&&<div className="flex text-white">
          Result : {result}

        </div>}
      </div>
    </main>
  );
}

function result(){
  return math.evaluate('12.7 cm to inch')   
}