// import React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import upgrade from "./assets/towers/upgrade.png";
import ringSrc from "./assets/towers/ring.png";
import sell from "./assets/towers/sell.png";
import { gameState } from "./state";

const MenuSC = styled.div`
position: absolute;
left: 800;
top: 300;
`;

const MenuUpgradeSC = styled.div`
position: absolute;
left: 28px;
color: gold;
z-index: 1;
top: -5px;
`;

const MenuUpgradeImgSC = styled.img`
position: absolute;
top: -27px;
left: -10px;
z-index: -1;
`;

const MenuRingSC = styled.img`
position: absolute;
top: -40px;
left: -17px;
z-index: -1;
`;

const MenuSellSC = styled.img`
position: absolute;
left: 25px;
`;



export const Menu = () =>{



if(gameState.tower4Menu){
    return (
        <div className="menu" style={{left: gameState.tower4Menu.x + 'px' , top: gameState.tower4Menu.y + 'px'}}>
            <MenuUpgradeSC> 
                <MenuUpgradeImgSC src={upgrade}/> 
                cost 
            </MenuUpgradeSC>
            <MenuRingSC />
            <MenuSellSC />
        </div>
    );
} else {
    return null;
}
};
