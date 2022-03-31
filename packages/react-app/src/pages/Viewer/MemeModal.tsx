import React, {useEffect, useState } from "react";
import Modal from "../../DSL/Modal/Modal";
import { Image } from "@chakra-ui/react";
import PixelDoge from "../../images/meme/mint/pixel.png"
import VibinDoge from "../../images/meme/mint/vibin.gif"
import GoodRubDoge from "../../images/meme/mint/goodrub.gif";
import GroovyDoge from "../../images/meme/mint/groovy.gif";
import MetaDoge from "../../images/meme/mint/meta.gif";
import SchoolOfDoge from "../../images/meme/mint/schoolofdoge.gif";

import GrassFadeDoge from "../../images/meme/burn/grassfadeyo.gif"
import ThisIsFineDoge from "../../images/meme/burn/thisisfine.jpg"
import AtTheTableDoge from "../../images/meme/burn/atthetable.gif";
import DisasterDoge from "../../images/meme/burn/dogedisaster.png"

import MonaDoge from "../../images/meme/pam_meme.png"

type MemeType = "burn" | "mint" | "mona"
interface MemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: MemeType
}
const BurnMemes = [
  GrassFadeDoge,
  ThisIsFineDoge,
  AtTheTableDoge,
  DisasterDoge
]

const MintMemes = [
  PixelDoge,
  VibinDoge,
  GoodRubDoge,
  GroovyDoge,
  MetaDoge,
  SchoolOfDoge
]

const MonaMeme = [
  MonaDoge
]

const getRandomMemeIndex = (type: "burn" | "mint" | "mona") => {
  let length: number
  if (type === "burn") {
    length = BurnMemes.length
  } else if (type === "mint") {
    length = MintMemes.length
  } else {
    length = MonaMeme.length
  }
  return Math.floor(Math.random()*length)
}

const getImageByType = (type: "burn" | "mint" | "mona", index: number) => {
  if (type === "burn") {
    return BurnMemes[index]
  } else if (type === "mint") {
    return MintMemes[index]
  } else if (type === "mona") {
    return MonaMeme[index]
  } else {
    throw new Error("Unknown modal type")
  }
}

const MemeModal = ({isOpen, onClose, type}: MemeModalProps) => {
  const [index, setIndex] = useState(getRandomMemeIndex(type))
  useEffect(() => {
    if (isOpen) {
      setIndex(getRandomMemeIndex(type))
    }
  }, [isOpen, type])

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  return <Modal
    defaultPosition={{x: -1 * windowWidth / 4, y: windowHeight / 4}}
    name={"meme_modal"}
    size={"xs"}
    isOpen={isOpen}
    onClose={onClose}
  >
    <Image w={"full"} src={getImageByType(type, index)}/>
  </Modal>
}

export default MemeModal


