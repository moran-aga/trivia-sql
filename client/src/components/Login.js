// import React, { useEffect } from "react";
// import { useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

const Login = ({ getPlayerName, input, leaderBoardTable }) => {
  return (
    <>
      <div>
        <h1>Login</h1>
        <input
          onChange={(e) => getPlayerName(e)}
          required
          name="[username]"
          type="text"
          placeholder="enter username"
        />
        <Link to="/game">start</Link>
      </div>
      {leaderBoardTable}
    </>
  );
};

export default Login;
