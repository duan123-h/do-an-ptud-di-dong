import React from "react";
import { Image } from "react-native";

const maleAvatar = require("@/assets/images/avatar-male.jpg");
const femaleAvatar = require("@/assets/images/avatar-female.jpg");
const defaultAvatar = require("@/assets/images/avatar-male.jpg");

type Props = {
    image?:String,
    gender?: boolean,
    className? :String,
    style?: any
};

const CircleAvatar = ({ image, gender, className,style  }: Props) => {
  let source;

  if (image) {
    source = { uri: image };
  } else {
    if (gender==true) {
      source = maleAvatar;
    } else if (gender==false) {
      source = femaleAvatar;
    } else {
      source = defaultAvatar;
    }
  }

  return (
    <Image resizeMode="cover" style={style} className={`rounded-full ${className}`} source={source} ></Image>
  );
};

export default CircleAvatar;