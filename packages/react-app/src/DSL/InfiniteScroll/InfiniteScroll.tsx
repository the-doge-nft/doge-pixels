import { Box, Flex } from "@chakra-ui/react";
import { throttle } from "lodash";
import React, { PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../Spinner/Spinner";
import Typography, { TVariant } from "../Typography/Typography";

export interface InfinteScrollProps {
  next: () => any;
  hasMore: boolean;
  dataLength: number;
  height?: number;
  endDataMessage?: string;
  renderLoader?: () => ReactNode;
}

const InfiniteScroll: React.FC<PropsWithChildren<InfinteScrollProps>> = ({
  children,
  next,
  hasMore,
  dataLength,
  endDataMessage,
  height,
  renderLoader,
}) => {
  const [showLoader, setShowLoader] = useState(true);
  const [actionTriggered, setActionTriggered] = useState(false);
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: any) => {
      const [target] = entries;
      const query = throttle(() => {
        setActionTriggered(true);
        setShowLoader(true);
        next();
      }, 500);

      if (target.isIntersecting && !actionTriggered && hasMore) {
        query();
      }
    },
    [actionTriggered, hasMore],
  );

  useEffect(() => {
    const root = height ? infiniteScrollRef.current : null;
    const options = {
      root,
      threshold: 0,
      rootMargin: "600px",
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [handleObserver, actionTriggered, height]);

  // reset actionTriggered on new data loaded
  const previousDataLength = useRef<typeof dataLength | null>();
  useEffect(() => {
    if (dataLength !== previousDataLength.current) {
      setActionTriggered(false);
      setShowLoader(false);
    }
  }, [dataLength]);
  useEffect(() => {
    previousDataLength.current = dataLength;
  });

  const defaultEndMessage = "-";

  return (
    <Box
      w={"full"}
      h={!height ? "full" : "inherit"}
      overflowY={!!height ? "scroll" : "hidden"}
      ref={infiniteScrollRef}
      style={{ height }}
      pb={2}
    >
      {children}
      {showLoader && hasMore && (
        <>
          {renderLoader && renderLoader()}
          {!renderLoader && (
            <Flex justifyContent={"center"} mt={4}>
              <Spinner />
            </Flex>
          )}
        </>
      )}
      <Box ref={loadMoreRef} mt={-1}>
        {!hasMore && dataLength > 0 && (
          <Box textAlign={"center"} mt={14}>
            <Typography variant={TVariant.ComicSans16}>
              {endDataMessage ? endDataMessage : defaultEndMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default InfiniteScroll;
