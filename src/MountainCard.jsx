import React from 'react';

const MountainCard = (props) => (
  <div class="grid grid-cols-1 flex items-center justify-center">
    <div class="mt-5 text-2xl font-semibold">{props.name}</div>
    <div>({props.nameKana})</div>
    <div class="m-3 text-1xl">({props.prefectures})</div>
    <div class="m-1 text-1xl">地域: {props.area}</div>
    <div class="m-1 text-1xl">標高: {props.elevation}m</div>
  </div>
);
export default MountainCard;