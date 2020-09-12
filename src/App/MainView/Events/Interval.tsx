import ms from "ms";
import React from "react";
import { msToPx } from "./msToPx";

type Props = {
  end: number;
  start: number;
};

export function Interval(props: Props) {
  const { end, start } = props;

  const duration = Math.max(0, end - start);
  const height = Math.min(msToPx(ms("10h")), msToPx(duration));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height,
        transition: "height 1s",
      }}
    />
  );
}
