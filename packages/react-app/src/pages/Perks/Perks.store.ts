import { makeObservable } from "mobx"

export interface PerkItem {
  title: string;
  description: string;
  link: string;
  date: string;
}

class PerksStore {
  items: PerkItem[] = [
    {
      title: "In Doge We Trust",
      description: "Claim an NFT for the music video 'In Doge We Trust' by Bassjackers, in celebration of DOG's first birthday.",
      link: "https://ownthedoge.com/radio",
      date: "2022-08-30"
    },
    {
      title: "DOGs First Birthday",
      description: "Claim 1 of 4 clips from 'In Doge We Trust' as a soulbound token on Ethereum.",
      link: "https://ownthedoge.com/birthday",
      date: "2022-08-30"
    }
  ]
}

export default PerksStore
