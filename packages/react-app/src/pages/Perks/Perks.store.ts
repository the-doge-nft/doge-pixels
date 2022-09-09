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
      title: "DOGs First Birthday",
      description: "Claim 1 of 4 clips from 'In Doge We Trust' as a soulbound token on Ethereum.",
      link: "https://ownthedoge.com/birthday",
      date: "2022-08-30"
    },
    {
      title: "In Doge We Trust",
      description: "Claim an NFT for the music video 'In Doge We Trust' by Bassjackers, in celebration of DOG's first birthday.",
      link: "https://ownthedoge.com/radio",
      date: "2022-08-30"
    },
    {
      title: "Doge Academy's PFP NFT",
      description: "All pixel holders get a free mint from The Doge Academy's PFP project. With this NFT, one also gets a chance to choose one course this semester from the plethora of courses offered.",
      link: "https://dogegenerals.com/",
      date: "2022-08-30"
    },
    {
      title: "Doge Face Filter NFT",
      description: "Our fren Hafid built an amazing face filter for the Own The Doge team. It was airdropped to all Pixel holders on Polygon and can easily be integrated with your webcam to make video calling a whole different experience.",
      link: "https://mobile.twitter.com/TheDogeAcademy/status/1536756641382604800",
      date: "2022-08-30"
    },
    {
      title: "Puppet NFTs",
      description: "Through one of our Do Only Good Everyday initiative where we had partnered with the Spare Parts Puppet Theatre, Australia's flagship puppet company, to bring their beautiful puppets into the NFT world.",
      link: "https://twitter.com/TheDogeAcademy/status/1564777484171763728",
      date: "2022-08-30"
    },
    {
      title: "xSublimatio NFTs",
      description: "Collaboration with PauzePierre to get all pixel holders a free H2O molecule mint from his amazing project Fraction NFT.",
      link: "https://mobile.twitter.com/xsublimatio",
      date: "2022-08-30"
    },
    {
      title: "Doge Bandana",
      description: "One-of-a-kind, limited edition high-quality 100% discounted $DOG bandada is our first merch drop in collaboration with Shopify",
      link: "https://shop.ownthedoge.com",
      date: "2022-08-30"
    }
  ]
}

export default PerksStore
