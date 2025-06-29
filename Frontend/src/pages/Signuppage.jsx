import React from "react";
import Signup from "../components/Signup";
import myimage from "../assets/logo.svg"; // Importing the image
import style from './Signuppage.module.css';

function Signuppage() {
  return (
    <div className={style.loginpage}>

    <div className={style.leftContainer}>
    <Signup />
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

export default Signuppage;
