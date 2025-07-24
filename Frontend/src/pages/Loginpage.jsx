import React from "react";
import Login from "../components/Login";
import myimage from "../assets/logo.svg"; 
import style from './Loginpage.module.css';

function Loginpage() {
  return (
    <div className={style.loginpage}>

    <div className={style.leftContainer}>
    <Login />
    </div>

    <div className={style.rightContainer}>
    <img 
      src={myimage}
      alt="Right Side" 
      className={style.imageContainer}
    />
    </div>

</div>

  );
}

export default Loginpage;
