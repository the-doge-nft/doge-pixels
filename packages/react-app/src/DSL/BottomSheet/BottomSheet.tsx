import React, { PropsWithChildren } from "react";
import { BottomSheet as SpringBottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { defaultSnapProps, snapPoints } from "react-spring-bottom-sheet/dist/types";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSnap?: number | ((props: defaultSnapProps) => number);
  snapPoints?: snapPoints;
}

const BottomSheet: React.FC<PropsWithChildren<BottomSheetProps>> = React.forwardRef(
  ({ isOpen, children, onClose, defaultSnap, snapPoints }, ref) => {
    return (
      // @ts-ignore
      <SpringBottomSheet ref={ref} 
      snapPoints={snapPoints} defaultSnap={defaultSnap} onDismiss={onClose} open={isOpen}>
        {children}
      </SpringBottomSheet>
    );
  },
);

export default BottomSheet;
