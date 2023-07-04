// var longestSubstring = function(s, k){
//     let left=0, right=0, max=0, count=1
//     const len=s.length, map=new Map()
//     while(left<=right && right<len){
//         if(count==1)
//             map.set(s[right], (map.get(s[right]) || 0)+1)
//         let valid = true;
//         console.log(map)
//         for (value of map.values()) { if (value < k) valid = false};
//         if (valid) {
//             console.log(valid)
//           max = Math.max(max, right - left + 1);
//         }
//         if(right!==len-1)
//             right++
//         else {
//             map.set(s[left], map.get(s[left])-1)
//             if(map.get(s[left])==0)
//                 map.delete(s[left])
//             left++
//             count++

//     }}
//     return(max)
// }
// console.log(longestSubstring("ababbc", 2));

// // const map1=new Map()
// // map1.set('a', 1)
// // map1.set("c", 3);
// // map1.set("b", 2);
// // console.log(map1.values())
// // for (value of map1.values())
// // console.log(value)

// const m=new Set("aaabc").size
// console.log(m)



import React, { useState, useEffect } from "react";

function ChatList() {
  const [users, setUsers] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = await fetch(
      "https://randomuser.me/api/?results=20&inc=name,picture,id,cell&nat=in"
    )
      .then((response) => response.json)
      .then((data) => setUsers(data));
  }
  console.log(users);

  return <div></div>;
}

export default ChatList;


if([])
[] ? console.log(true) : console.log(false);
else 
console.log(false)

console.log([].length)

import React from "react";
import ReactDOM from "react-dom/client";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { favoritecolor: "red" };
  }
  render() {
    return <h1>My Favorite Color is {this.state.favoritecolor}</h1>;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Header />);



