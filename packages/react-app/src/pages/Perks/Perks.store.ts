export interface PerkItem {
  title: string;
  description: string;
  link: string;
  date: string;
  isLive: boolean;
}

class PerksStore {
  items: PerkItem[] = [
    {
      title: "Doge x Bad Luck Brian",
      description:
        "Doge meets Bad Luck Brian in Kabosu's hometown of Sakura City, Japan! Top 100 pixels holders get 4 free mints, and the rest of pixel holders get 3 free!",
      link: "https://zora.co/collect/0x36daf12d18b00389bac65b04bdc9013b1b3514d7",
      date: "2023-06-06",
      isLive: true,
    },
    {
      title: "The Doge Couch",
      description:
        "Introducing the Doge Couch, the ultimate statement piece for your virtual living room in the metaverse! This ain't just any ordinary couch - this is a 3-Dimensional masterpiece based on a 3d scan of the original couch that Doge sits upon. That's right, the one and only original couch that was in the headlines for being auctioned by @PleaseDAO for 21ETH is now available to grace your digital living space!",
      link: "https://app.manifold.xyz/c/the-doge-couch",
      date: "2023-03-01",
      isLive: false,
    },
    {
      title: "First Doge",
      description:
        "This is the FIRST EVER Kabosu photo taken by Atsuko Sato and the first posted on her blog years before Doge became a global phenomenon.",
      link: "https://zora.co/collections/0xbd494f7450aba56d7207b1f35b8b2de6622fd7b8",
      date: "2022-02-09",
      isLive: false,
    },
    {
      title: "Nounlet #69",
      description: "Claim fractions of Nounlet #69",
      link: "https://ownthedoge.com/nounlet",
      date: "2023-01-02",
      isLive: false,
    },
    {
      title: "Lords of Dogetown",
      description: "Claim a 1 out of 115 random NFTs from our Lords of Dogetown Sandbox game",
      link: "https://ownthedoge.com/lords-of-dogetown",
      date: "2022-11-09",
      isLive: false,
    },
    {
      title: "Doge Major",
      description: "Claim a fraction of 'Doge Major' created by Anas Abdin",
      link: "https://ownthedoge.com/doge-major",
      date: "2022-10-01",
      isLive: false,
    },
    {
      title: "DOGs First Birthday",
      description: "Claim 1 of 4 clips from 'In Doge We Trust' as a soulbound token on Ethereum.",
      link: "https://ownthedoge.com/birthday",
      date: "2022-08-30",
      isLive: false,
    },
    {
      title: "In Doge We Trust",
      description:
        "Claim an NFT for the music video 'In Doge We Trust' by Bassjackers, in celebration of DOG's first birthday.",
      link: "https://ownthedoge.com/radio",
      date: "2022-08-30",
      isLive: false,
    },
    {
      title: "Puppet NFTs",
      description:
        "Through one of our Do Only Good Everyday initiative where we had partnered with the Spare Parts Puppet Theatre, Australia's flagship puppet company, to bring their beautiful puppets into the NFT world.",
      link: "https://twitter.com/TheDogeAcademy/status/1564777484171763728",
      date: "2022-07-19",
      isLive: false,
    },
    {
      title: "Doge Face Filter NFT",
      description:
        "Our fren Hafid built an amazing face filter for the Own The Doge team. It was airdropped to all Pixel holders on Polygon and can easily be integrated with your webcam to make video calling a whole different experience.",
      link: "https://mobile.twitter.com/TheDogeAcademy/status/1536756641382604800",
      date: "2022-07-06",
      isLive: false,
    },
    {
      title: "xSublimatio NFTs",
      description:
        "Collaboration with PauzePierre to get all pixel holders a free H2O molecule mint from his amazing project Fraction NFT.",
      link: "https://mobile.twitter.com/xsublimatio",
      date: "2022-07-05",
      isLive: false,
    },
    {
      title: "Doge Bandana",
      description:
        "One-of-a-kind, limited edition high-quality 100% discounted $DOG bandada is our first merch drop in collaboration with Shopify",
      link: "https://shop.ownthedoge.com",
      date: "2022-06-09",
      isLive: false,
    },
    {
      title: "Doge Academy's PFP NFT",
      description:
        "All pixel holders get a free mint from The Doge Academy's PFP project. With this NFT, one also gets a chance to choose one course this semester from the plethora of courses offered.",
      link: "https://thedogeacademy.com/",
      date: "2022-06-01",
      isLive: false,
    },
  ];
}

export default PerksStore;
