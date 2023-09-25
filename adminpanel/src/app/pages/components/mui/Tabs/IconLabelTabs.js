import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import code from "../Tabs/demo-code/icon-label-tabs.txt";

export default function IconLabelTabs() {
    const [value, setValue] = React.useState(0);

    return (
        <JumboDemoCard title={"Icon Tabs with Label"} demoCode={code}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
            <Tabs
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
                indicatorColor={"primary"}
                textColor={"primary"}
            >
                <Tab icon={<PhoneIcon/>} label="RECENTS"/>
                <Tab icon={<FavoriteIcon/>} label="FAVORITES"/>
                <Tab icon={<PersonPinIcon/>} label="NEARBY"/>
            </Tabs>
        </JumboDemoCard>
    );
}
