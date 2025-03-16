import React from "react";

const MountainCard = (props) => (
  <div className="m-3 grid grid-cols-1 flex items-center justify-center">
    <div className="mt-5 text-2xl font-semibold">{props.name}</div>
    <div>({props.nameKana})</div>
    <div className="m-3 text-1xl">({props.prefectures})</div>
    <div className="m-1 text-1xl">地域: {props.area}</div>
    <div className="m-1 text-1xl">標高: {props.elevation}m</div>
  </div>
);
export default MountainCard;
