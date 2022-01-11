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

type MemeType = "burn" | "mint"
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

const getRandomMemeIndex = (type: "burn" | "mint") => {
  let length: number
  if (type === "burn") {
    length = BurnMemes.length
  } else {
    length = MintMemes.length
  }
  return Math.floor(Math.random()*length)
}

const getImageByType = (type: "burn" | "mint", index: number) => {
  if (type === "burn") {
    return BurnMemes[index]
  } else {
    return MintMemes[index]
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


