import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import PerksStore, { PerkItem } from "./Perks.store";

const Perks = observer(() => {
  const store = useMemo(() => new PerksStore(), [])
  return <Box w={"full"} borderWidth={1} borderColor={"green.300"}>
    {store.items.map(item => <Perk item={item}/>)}
  </Box>
})

const Perk: React.FC<{item: PerkItem}> = ({ item }) => {
  const {title} = item
  return <Box>
    <Typography variant={TVariant.ComicSans12}>{title}</Typography>
  </Box>
}

export default Perks
