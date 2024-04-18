// import React from "react";
import { observer } from "mobx-react-lite";
import { gameState } from "./state";
import styled from "styled-components";

import upgrade from "./assets/towers/upgrade.png";
import ringSrc from "./assets/towers/ring.png";
import sell from "./assets/towers/sell.png";
import lock from "./assets/towers/upgradeLocked.png";
import flag from "./assets/towers/flag.png";


const MenuSC = styled.div`
position: absolute;
z-index: 1;
`;

const MenuUpgradeSC = styled.div`
position: absolute;
left: -10px;
top: -50px;
color: gold;
z-index: 2;
`;

const MenuUpgradeImgSC = styled.img`
position: absolute;
top: 0px;
left: 12.5px;
z-index: -1;
transform: translate(-50%, -50%);
`;

const MenuRingSC = styled.img`
position: absolute;
top: 0px;
left: 0px;
z-index: 1;
transform: translate(-50%, -50%);
`;

const MenuSellSC = styled.img`
position: absolute;
left: 2px;
top:60;
z-index: 1;
transform: translate(-50%, -50%);
`;

const MenuFlagSC = styled.img`
position: absolute;
left: 50px;
top:30;
z-index: 1;
transform: translate(-50%, -50%);
`;

export const Menu = observer(() =>{

if(gameState.tower4Menu){
    return (
        <MenuSC style={{left: gameState.tower4Menu.x + 'px' , top: gameState.tower4Menu.y -15 + 'px'}}>
            <MenuUpgradeSC> 
                <MenuUpgradeImgSC src={gameState.tower4Menu.canBeUpgraded ? upgrade : lock} style={ gameState.gold < gameState.tower4Menu.upgradeCost ?  { filter: 'grayscale(100%)' } : {}} onClick={gameState.tower4Menu.upgrade}/> 
                {gameState.tower4Menu.upgradeCost} 
            </MenuUpgradeSC>
            <MenuRingSC src={ringSrc} />
            <MenuFlagSC src={gameState.tower4Menu.hasFlag ? flag : '' } onClick={gameState.tower4Menu.openRadius}/>
            <MenuSellSC src={sell} onClick={gameState.tower4Menu.sell}/>
        </MenuSC>
    );
} else {
    return null;
}
});
