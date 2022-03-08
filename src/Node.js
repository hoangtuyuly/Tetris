import React from 'react';
import "./Node.css"


function Node({type, color}) {

  return (
    <div className = "node" 
    style={{
      backgroundColor: color
    }}>
    </div>
  );
}

export default Node;